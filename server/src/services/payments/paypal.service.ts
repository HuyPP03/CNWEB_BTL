import axios from 'axios';
import * as querystring from 'querystring';
import env from '../../../env';

export interface PayPalConfig {
	clientId: string;
	clientSecret: string;
	mode: 'sandbox' | 'live';
}

export interface PayPalPaymentParams {
	amount: number;
	currency: string;
	returnUrl: string;
	cancelUrl: string;
	description: string;
	invoiceId?: string;
}

export interface PayPalRefundParams {
	paymentId: string;
	amount: number;
	currency: string;
	note?: string;
}

export class PayPalService {
	private config: PayPalConfig;
	private baseUrl: string;

	constructor() {
		this.config = {
			clientId: env.payment.PAYPAL_CLIENT_ID,
			clientSecret: env.payment.PAYPAL_CLIENT_SECRET,
			mode: env.payment.PAYPAL_MODE === 'live' ? 'live' : 'sandbox',
		};
		this.baseUrl =
			this.config.mode === 'live'
				? 'https://api.paypal.com'
				: 'https://api.sandbox.paypal.com';
	}

	/**
	 * Lấy access token từ PayPal
	 */
	private async getAccessToken(): Promise<string> {
		try {
			const auth = Buffer.from(
				`${this.config.clientId}:${this.config.clientSecret}`,
			).toString('base64');
			const response = await axios.post(
				`${this.baseUrl}/v1/oauth2/token`,
				'grant_type=client_credentials',
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: `Basic ${auth}`,
					},
				},
			);
			return response.data.access_token;
		} catch (error) {
			throw new Error(`PayPal authentication error: ${error}`);
		}
	}

	/**
	 * Tạo thanh toán PayPal
	 */
	public async createPayment(params: PayPalPaymentParams): Promise<any> {
		try {
			const accessToken = await this.getAccessToken();

			const paymentData = {
				intent: 'sale',
				payer: {
					payment_method: 'paypal',
				},
				redirect_urls: {
					return_url: params.returnUrl,
					cancel_url: params.cancelUrl,
				},
				transactions: [
					{
						description: params.description,
						invoice_number: params.invoiceId,
						amount: {
							total: params.amount.toFixed(2),
							currency: params.currency,
						},
					},
				],
			};

			const response = await axios.post(
				`${this.baseUrl}/v1/payments/payment`,
				paymentData,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			// Tìm approval_url
			const approvalUrl = response.data.links.find(
				(link: any) => link.rel === 'approval_url',
			);
			return {
				paymentId: response.data.id,
				approvalUrl: approvalUrl ? approvalUrl.href : null,
				response: response.data,
			};
		} catch (error) {
			throw new Error(`PayPal create payment error: ${error}`);
		}
	}

	/**
	 * Thực hiện thanh toán sau khi người dùng chấp nhận
	 */
	public async executePayment(
		paymentId: string,
		payerId: string,
	): Promise<any> {
		try {
			const accessToken = await this.getAccessToken();

			const response = await axios.post(
				`${this.baseUrl}/v1/payments/payment/${paymentId}/execute`,
				{ payer_id: payerId },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return response.data;
		} catch (error) {
			throw new Error(`PayPal execute payment error: ${error}`);
		}
	}

	/**
	 * Hoàn tiền qua PayPal
	 */
	public async refund(params: PayPalRefundParams): Promise<any> {
		try {
			const accessToken = await this.getAccessToken();

			// Tìm sale id từ payment
			const paymentResponse = await axios.get(
				`${this.baseUrl}/v1/payments/payment/${params.paymentId}`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			// Lấy sale Id
			const saleId =
				paymentResponse.data.transactions[0].related_resources[0].sale
					.id;

			// Dữ liệu hoàn tiền
			const refundData: any = {
				amount: {
					total: params.amount.toFixed(2),
					currency: params.currency,
				},
			};

			if (params.note) {
				refundData.description = params.note;
			}

			const response = await axios.post(
				`${this.baseUrl}/v1/payments/sale/${saleId}/refund`,
				refundData,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return response.data;
		} catch (error) {
			throw new Error(`PayPal refund error: ${error}`);
		}
	}
}

export default new PayPalService();
