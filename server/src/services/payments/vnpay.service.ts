import axios from 'axios';
import * as crypto from 'crypto';
import * as qs from 'querystring';
import env from '../../../env';

export interface VNPayConfig {
	tmnCode: string;
	secretKey: string;
	vnpUrl: string;
	returnUrl: string;
}

export interface VNPayPaymentParams {
	amount: number;
	orderId: string;
	orderInfo: string;
	ipAddr: string;
	locale?: 'vn' | 'en';
}

export interface VNPayRefundParams {
	amount: number;
	orderId: string;
	transDate: string;
	transType?: string;
	user: string;
}

export class VNPayService {
	private config: VNPayConfig;

	constructor() {
		this.config = {
			tmnCode: env.payment.VNPAY_TMN_CODE,
			secretKey: env.payment.VNPAY_SECRET_KEY,
			vnpUrl: env.payment.VNPAY_URL,
			returnUrl: env.payment.VNPAY_RETURN_URL,
		};
	}

	private createSignature(data: Record<string, string | number>): string {
		const sortedParams = Object.keys(data)
			.sort()
			.reduce((acc, key) => {
				acc[key] = data[key];
				return acc;
			}, {} as Record<string, string | number>);

		const signData = qs.stringify(sortedParams, { encode: false } as any);
		return crypto
			.createHmac('sha512', this.config.secretKey)
			.update(signData)
			.digest('hex');
	}

	/**
	 * Tạo URL thanh toán VNPay
	 */
	public createPaymentUrl(params: VNPayPaymentParams): string {
		const date = new Date();
		const createDate = `${date.getFullYear()}${(date.getMonth() + 1)
			.toString()
			.padStart(2, '0')}${date
			.getDate()
			.toString()
			.padStart(2, '0')}${date
			.getHours()
			.toString()
			.padStart(2, '0')}${date
			.getMinutes()
			.toString()
			.padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;

		const vnpParams: Record<string, string | number> = {
			vnp_Version: '2.1.0',
			vnp_Command: 'pay',
			vnp_TmnCode: this.config.tmnCode,
			vnp_Locale: params.locale || 'vn',
			vnp_CurrCode: 'VND',
			vnp_TxnRef: params.orderId,
			vnp_OrderInfo: params.orderInfo,
			vnp_OrderType: 'other',
			vnp_Amount: params.amount * 100, // Số tiền * 100
			vnp_ReturnUrl: this.config.returnUrl,
			vnp_IpAddr: params.ipAddr,
			vnp_CreateDate: createDate,
		};

		// Tạo chữ ký
		const signature = this.createSignature(vnpParams);
		vnpParams.vnp_SecureHash = signature;

		// Tạo URL thanh toán
		const paymentUrl = `${this.config.vnpUrl}?${qs.stringify(vnpParams)}`;
		return paymentUrl;
	}

	/**
	 * Xác minh callback từ VNPay
	 */
	public verifyReturnUrl(
		vnpParams: Record<string, string | number>,
	): boolean {
		const secureHash = vnpParams.vnp_SecureHash as string;
		delete vnpParams.vnp_SecureHash;
		delete vnpParams.vnp_SecureHashType;

		// Tính toán lại chữ ký để xác nhận
		const calculatedHash = this.createSignature(vnpParams);
		return calculatedHash === secureHash;
	}

	/**
	 * Hoàn tiền qua VNPay
	 */
	public async refund(params: VNPayRefundParams): Promise<any> {
		const date = new Date();
		const createDate = `${date.getFullYear()}${(date.getMonth() + 1)
			.toString()
			.padStart(2, '0')}${date
			.getDate()
			.toString()
			.padStart(2, '0')}${date
			.getHours()
			.toString()
			.padStart(2, '0')}${date
			.getMinutes()
			.toString()
			.padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;

		const refundParams: Record<string, string | number> = {
			vnp_Version: '2.1.0',
			vnp_Command: 'refund',
			vnp_TmnCode: this.config.tmnCode,
			vnp_TransactionType: params.transType || '02', // 02: Hoàn toàn phần
			vnp_TxnRef: params.orderId,
			vnp_Amount: params.amount * 100,
			vnp_TransactionDate: params.transDate,
			vnp_CreateBy: params.user,
			vnp_CreateDate: createDate,
			vnp_IpAddr: '127.0.0.1',
		};

		// Tạo chữ ký
		const signature = this.createSignature(refundParams);
		refundParams.vnp_SecureHash = signature;

		try {
			const response = await axios.post(
				`${this.config.vnpUrl}`,
				qs.stringify(refundParams),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
			);
			return response.data;
		} catch (error) {
			throw new Error(`VNPay refund error: ${error}`);
		}
	}
}

export default new VNPayService();
