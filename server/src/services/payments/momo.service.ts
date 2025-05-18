import axios from 'axios';
import * as crypto from 'crypto';
import env from '../../../env';

export interface MomoConfig {
	partnerCode: string;
	accessKey: string;
	secretKey: string;
	apiEndpoint: string;
	returnUrl: string;
	notifyUrl: string;
}

export interface MomoPaymentParams {
	amount: number;
	orderId: string;
	orderInfo: string;
	requestId: string;
	extraData?: string;
}

export interface MomoRefundParams {
	amount: number;
	orderId: string;
	transId: string;
	requestId: string;
	description: string;
}

export class MomoService {
	private config: MomoConfig;

	constructor() {
		this.config = {
			partnerCode: env.payment.MOMO_PARTNER_CODE,
			accessKey: env.payment.MOMO_ACCESS_KEY,
			secretKey: env.payment.MOMO_SECRET_KEY,
			apiEndpoint: env.payment.MOMO_API_ENDPOINT,
			returnUrl: env.payment.MOMO_RETURN_URL,
			notifyUrl: env.payment.MOMO_NOTIFY_URL,
		};
	}

	private createSignature(rawData: string): string {
		return crypto
			.createHmac('sha256', this.config.secretKey)
			.update(rawData)
			.digest('hex');
	}

	/**
	 * Tạo URL thanh toán MoMo
	 */
	public async createPaymentUrl(params: MomoPaymentParams): Promise<string> {
		const requestBody: Record<string, any> = {
			partnerCode: this.config.partnerCode,
			accessKey: this.config.accessKey,
			requestId: params.requestId,
			amount: params.amount,
			orderId: params.orderId,
			orderInfo: params.orderInfo,
			returnUrl: this.config.returnUrl,
			notifyUrl: this.config.notifyUrl,
			extraData: params.extraData || '',
			requestType: 'captureMoMoWallet',
		};

		// Tạo chuỗi signature
		const rawSignature = `partnerCode=${requestBody.partnerCode}&accessKey=${requestBody.accessKey}&requestId=${requestBody.requestId}&amount=${requestBody.amount}&orderId=${requestBody.orderId}&orderInfo=${requestBody.orderInfo}&returnUrl=${requestBody.returnUrl}&notifyUrl=${requestBody.notifyUrl}&extraData=${requestBody.extraData}`;
		const signature = this.createSignature(rawSignature);
		requestBody.signature = signature;

		try {
			const response = await axios.post(
				this.config.apiEndpoint,
				requestBody,
			);
			return response.data.payUrl;
		} catch (error) {
			throw new Error(`MoMo payment error: ${error}`);
		}
	}

	/**
	 * Xác minh callback từ MoMo
	 */
	public verifyCallback(data: any): boolean {
		const signature = data.signature;
		// Tạo chuỗi dữ liệu để xác minh
		const rawSignature = `partnerCode=${data.partnerCode}&accessKey=${this.config.accessKey}&requestId=${data.requestId}&amount=${data.amount}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&orderType=${data.orderType}&transId=${data.transId}&message=${data.message}&localMessage=${data.localMessage}&responseTime=${data.responseTime}&errorCode=${data.errorCode}&payType=${data.payType}&extraData=${data.extraData}`;

		// Tính toán lại chữ ký
		const calculatedSignature = this.createSignature(rawSignature);
		return calculatedSignature === signature;
	}

	/**
	 * Hoàn tiền qua MoMo
	 */
	public async refund(params: MomoRefundParams): Promise<any> {
		const requestBody: Record<string, any> = {
			partnerCode: this.config.partnerCode,
			accessKey: this.config.accessKey,
			requestId: params.requestId,
			amount: params.amount,
			orderId: params.orderId,
			transId: params.transId,
			description: params.description,
		};

		// Tạo chuỗi signature
		const rawSignature = `partnerCode=${requestBody.partnerCode}&accessKey=${requestBody.accessKey}&requestId=${requestBody.requestId}&amount=${requestBody.amount}&orderId=${requestBody.orderId}&transId=${requestBody.transId}&description=${requestBody.description}`;
		const signature = this.createSignature(rawSignature);
		requestBody.signature = signature;

		try {
			const response = await axios.post(
				`${this.config.apiEndpoint}/refund`,
				requestBody,
			);
			return response.data;
		} catch (error) {
			throw new Error(`MoMo refund error: ${error}`);
		}
	}
}

export default new MomoService();
