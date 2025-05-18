import { Request, Response } from 'express';
import { PaymentGateway, PaymentService } from '../services/payments';
import { db } from '../loaders/database.loader';
import { changeStock } from '../services/customers/orders.service';
import env from '../../env';
export class PaymentController {
	/**
	 * Tạo yêu cầu thanh toán
	 */
	public static async createPayment(
		req: Request,
		res: Response,
	): Promise<void> {
		try {
			const { gateway, ...paymentData } = req.body;

			if (!gateway || !Object.values(PaymentGateway).includes(gateway)) {
				res.status(400).json({
					success: false,
					message:
						'Cổng thanh toán không hợp lệ hoặc không được hỗ trợ',
				});
				return;
			}

			// Kiểm tra và xử lý dữ liệu theo từng cổng thanh toán
			switch (gateway) {
				case PaymentGateway.VNPAY: {
					if (
						!paymentData.amount ||
						!paymentData.orderId ||
						!paymentData.orderInfo
					) {
						res.status(400).json({
							success: false,
							message: 'Thiếu thông tin thanh toán cho VNPay',
						});
						return;
					}

					// Thêm địa chỉ IP nếu không có
					paymentData.ipAddr =
						paymentData.ipAddr || req.ip || '127.0.0.1';

					const paymentUrl = await PaymentService.createPayment(
						PaymentGateway.VNPAY,
						paymentData,
					);

					res.status(200).json({
						success: true,
						data: { redirectUrl: paymentUrl },
					});
					break;
				}

				case PaymentGateway.MOMO: {
					if (
						!paymentData.amount ||
						!paymentData.orderId ||
						!paymentData.orderInfo
					) {
						res.status(400).json({
							success: false,
							message: 'Thiếu thông tin thanh toán cho MoMo',
						});
						return;
					}

					// Tạo requestId nếu không có
					paymentData.requestId =
						paymentData.requestId || `REQ-${Date.now()}`;

					const paymentUrl = await PaymentService.createPayment(
						PaymentGateway.MOMO,
						paymentData,
					);

					res.status(200).json({
						success: true,
						data: { redirectUrl: paymentUrl },
					});
					break;
				}

				case PaymentGateway.PAYPAL: {
					if (
						!paymentData.amount ||
						!paymentData.currency ||
						!paymentData.description
					) {
						res.status(400).json({
							success: false,
							message: 'Thiếu thông tin thanh toán cho PayPal',
						});
						return;
					}

					// Thêm URL callback nếu không có
					const baseUrl = `${req.protocol}://${req.get('host')}`;
					paymentData.returnUrl =
						paymentData.returnUrl ||
						`${baseUrl}/api/payments/paypal/success`;
					paymentData.cancelUrl =
						paymentData.cancelUrl ||
						`${baseUrl}/api/payments/paypal/cancel`;

					const result = await PaymentService.createPayment(
						PaymentGateway.PAYPAL,
						paymentData,
					);

					res.status(200).json({
						success: true,
						data: result,
					});
					break;
				}

				default:
					res.status(400).json({
						success: false,
						message: 'Cổng thanh toán không được hỗ trợ',
					});
			}
		} catch (error: any) {
			console.error('Payment error:', error);
			res.status(500).json({
				success: false,
				message: `Lỗi khi tạo thanh toán: ${
					error.message || 'Lỗi không xác định'
				}`,
			});
		}
	}

	/**
	 * Xử lý callback từ VNPay
	 */
	public static async vnpayCallback(
		req: Request,
		res: Response,
	): Promise<void> {
		try {
			const vnpParams = req.query;

			const isValid = PaymentService.verifyPayment(
				PaymentGateway.VNPAY,
				vnpParams,
			);

			console.log('VNPay callback is valid:', isValid);

			if (isValid) {
				// Xử lý thanh toán thành công tại đây (cập nhật DB, ...)
				const orderId = Number(vnpParams.vnp_TxnRef);

				await db.payments.update(
					{ status: 'success' },
					{ where: { orderId: orderId } },
				);

				await db.orders.update(
					{ status: 'pending' },
					{ where: { id: orderId } },
				);
				changeStock(orderId);

				// Chuyển hướng người dùng về trang thành công
				res.redirect(
					`/payment-success?orderId=${vnpParams.vnp_TxnRef}`,
				);
			} else {
				// Cập nhật trong db
				const orderId = Number(vnpParams.vnp_TxnRef);

				await db.payments.update(
					{ status: 'failed' },
					{ where: { orderId: orderId } },
				);
				// Xử lý thanh toán thất bại
				res.redirect('/payment-failed');
			}
		} catch (error) {
			console.error('VNPay callback error:', error);
			res.redirect('/payment-failed');
		}
	}

	/**
	 * Xử lý callback từ MoMo
	 */
	public static async momoCallback(
		req: Request,
		res: Response,
	): Promise<void> {
		try {
			const momoParams = req.query;
			// Chuyển đối tượng params để xác thực
			const isValid = PaymentService.verifyPayment(
				PaymentGateway.MOMO,
				momoParams,
			);

			if (isValid) {
				// Xử lý thanh toán thành công tại đây (cập nhật DB, ...)
				const orderId = Number(momoParams.orderId);

				await db.payments.update(
					{ status: 'success' },
					{ where: { orderId: orderId } },
				);

				await db.orders.update(
					{ status: 'pending' },
					{ where: { id: orderId } },
				);
				changeStock(orderId);

				// Chuyển hướng người dùng về trang thành công
				res.redirect(`/payment-success?orderId=${momoParams.orderId}`);
			} else {
				// Cập nhật trong db
				const orderId = Number(momoParams.orderId);

				await db.payments.update(
					{ status: 'failed' },
					{ where: { orderId: orderId } },
				);
				// Xử lý thanh toán thất bại
				res.redirect('/payment-failed');
			}
		} catch (error) {
			console.error('MoMo callback error:', error);
			res.redirect('/payment-failed');
		}
	}

	/**
	 * Xử lý callback thành công từ PayPal
	 */
	public static async paypalSuccess(
		req: Request,
		res: Response,
	): Promise<void> {
		try {
			const { paymentId, PayerID } = req.query;

			if (!paymentId || !PayerID) {
				res.redirect('/payment-failed');
				return;
			}

			// Thực hiện thanh toán
			const result = await PaymentService.executePayment(
				PaymentGateway.PAYPAL,
				{ paymentId, payerId: PayerID },
			);

			if (result && result.state === 'approved') {
				// Xử lý thanh toán thành công tại đây (cập nhật DB, ...)
				const orderId = Number(paymentId);

				await db.payments.update(
					{ status: 'success' },
					{ where: { orderId: orderId } },
				);

				await db.orders.update(
					{ status: 'pending' },
					{ where: { id: orderId } },
				);
				changeStock(orderId);

				// Chuyển hướng người dùng về trang thành công
				res.redirect(
					`${env.app.client_url}/payment-success?paymentId=${paymentId}`,
				);
			} else {
				const orderId = Number(paymentId);

				await db.payments.update(
					{ status: 'failed' },
					{ where: { orderId: orderId } },
				);

				res.redirect(
					`${env.app.client_url}/payment-failed?paymentId=${paymentId}`,
				);
			}
		} catch (error) {
			console.error('PayPal callback error:', error);
			res.redirect(`${env.app.client_url}/payment-failed}`);
		}
	}

	/**
	 * Xử lý callback hủy từ PayPal
	 */
	public static async paypalCancel(
		req: Request,
		res: Response,
	): Promise<void> {
		res.redirect('/payment-cancelled');
	}

	/**
	 * Hoàn tiền
	 */
	public static async refund(req: Request, res: Response): Promise<void> {
		try {
			const { gateway, ...refundData } = req.body;

			if (!gateway || !Object.values(PaymentGateway).includes(gateway)) {
				res.status(400).json({
					success: false,
					message:
						'Cổng thanh toán không hợp lệ hoặc không được hỗ trợ',
				});
				return;
			}

			const result = await PaymentService.refund(gateway, refundData);

			res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error: any) {
			console.error('Refund error:', error);
			res.status(500).json({
				success: false,
				message: `Lỗi khi hoàn tiền: ${
					error.message || 'Lỗi không xác định'
				}`,
			});
		}
	}
}

export default PaymentController;
