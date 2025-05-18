import VNPayService from './vnpay.service';
import MomoService from './momo.service';
import PayPalService from './paypal.service';

export enum PaymentGateway {
	VNPAY = 'vnpay',
	MOMO = 'momo',
	PAYPAL = 'paypal',
}

export class PaymentService {
	/**
	 * Tạo URL hoặc data thanh toán dựa vào cổng thanh toán được chọn
	 */
	public static async createPayment(
		gateway: PaymentGateway,
		params: any,
	): Promise<string | any> {
		switch (gateway) {
			case PaymentGateway.VNPAY:
				return VNPayService.createPaymentUrl(params);
			case PaymentGateway.MOMO:
				return MomoService.createPaymentUrl(params);
			case PaymentGateway.PAYPAL:
				return PayPalService.createPayment(params);
			default:
				throw new Error(`Payment gateway ${gateway} not supported`);
		}
	}

	/**
	 * Xác minh callback từ cổng thanh toán
	 */
	public static verifyPayment(
		gateway: PaymentGateway,
		params: any,
	): boolean | Promise<any> {
		switch (gateway) {
			case PaymentGateway.VNPAY:
				return VNPayService.verifyReturnUrl(params);
			case PaymentGateway.MOMO:
				return MomoService.verifyCallback(params);
			case PaymentGateway.PAYPAL:
				return true; // PayPal xác thực trong phương thức executePayment
			default:
				throw new Error(`Payment gateway ${gateway} not supported`);
		}
	}

	/**
	 * Hoàn tiền
	 */
	public static async refund(
		gateway: PaymentGateway,
		params: any,
	): Promise<any> {
		switch (gateway) {
			case PaymentGateway.VNPAY:
				return VNPayService.refund(params);
			case PaymentGateway.MOMO:
				return MomoService.refund(params);
			case PaymentGateway.PAYPAL:
				return PayPalService.refund(params);
			default:
				throw new Error(`Payment gateway ${gateway} not supported`);
		}
	}

	/**
	 * Thực hiện lệnh thanh toán sau khi người dùng xác nhận (đặc biệt cho PayPal)
	 */
	public static async executePayment(
		gateway: PaymentGateway,
		params: any,
	): Promise<any> {
		switch (gateway) {
			case PaymentGateway.PAYPAL:
				return PayPalService.executePayment(
					params.paymentId,
					params.payerId,
				);
			default:
				throw new Error(`Execute payment not supported for ${gateway}`);
		}
	}
}

export { VNPayService, MomoService, PayPalService };
