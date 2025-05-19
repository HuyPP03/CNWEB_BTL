import axios from 'axios';
import * as crypto from 'crypto';
import * as qs from 'qs';
import moment from 'moment';
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
	bankCode?: string;
}

export interface VNPayRefundParams {
	amount: number;
	orderId: string;
	transDate: string;
	transType?: string;
	user: string;
	ipAddr?: string;
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

	/**
	 * Sắp xếp object theo đúng định dạng VNPay yêu cầu
	 */
	private sortObject(obj: any): any {
		let sorted: any = {};
		let str: string[] = [];
		let key: string | number;

		// Lấy tất cả các key và mã hóa URI
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				str.push(encodeURIComponent(key));
			}
		}

		// Sắp xếp các key
		str.sort();

		// Tạo object với các key đã sắp xếp và mã hóa giá trị
		for (key = 0; key < str.length; key++) {
			sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
				/%20/g,
				'+',
			);
		}

		return sorted;
	}

	/**
	 * Tạo URL thanh toán VNPay
	 */
	public createPaymentUrl(params: VNPayPaymentParams): string {
		// Đặt múi giờ cho việc tạo thời gian
		process.env.TZ = 'Asia/Ho_Chi_Minh';

		// Tạo ngày thanh toán theo định dạng yyyyMMddHHmmss
		const date = new Date();
		const createDate = moment(date).format('YYYYMMDDHHmmss');

		// Tạo các tham số thanh toán
		let vnp_Params: any = {};
		vnp_Params['vnp_Version'] = '2.1.0';
		vnp_Params['vnp_Command'] = 'pay';
		vnp_Params['vnp_TmnCode'] = this.config.tmnCode;
		vnp_Params['vnp_Locale'] = params.locale || 'vn';
		vnp_Params['vnp_CurrCode'] = 'VND';
		vnp_Params['vnp_TxnRef'] = params.orderId;
		vnp_Params['vnp_OrderInfo'] = params.orderInfo;
		vnp_Params['vnp_OrderType'] = 'other';
		vnp_Params['vnp_Amount'] = params.amount * 100; // Số tiền * 100
		vnp_Params['vnp_ReturnUrl'] = this.config.returnUrl;
		vnp_Params['vnp_IpAddr'] = params.ipAddr;
		vnp_Params['vnp_CreateDate'] = createDate;

		// Thêm mã ngân hàng nếu có
		if (params.bankCode) {
			vnp_Params['vnp_BankCode'] = params.bankCode;
		}

		// Sắp xếp tham số theo thứ tự a-z và mã hóa các giá trị
		vnp_Params = this.sortObject(vnp_Params);

		// Tạo chuỗi dữ liệu để tạo chữ ký
		const signData = qs.stringify(vnp_Params, { encode: false });

		// Tạo chữ ký
		const hmac = crypto.createHmac('sha512', this.config.secretKey);
		const signed = hmac
			.update(Buffer.from(signData, 'utf-8'))
			.digest('hex');

		// Thêm chữ ký vào tham số
		vnp_Params['vnp_SecureHash'] = signed;

		// Tạo URL thanh toán
		const paymentUrl =
			this.config.vnpUrl +
			'?' +
			qs.stringify(vnp_Params, { encode: false });

		return paymentUrl;
	}

	/**
	 * Xác minh callback từ VNPay
	 */
	public verifyReturnUrl(
		vnpParams: Record<string, string | number>,
	): boolean {
		// Lấy chữ ký từ dữ liệu trả về
		const secureHash = vnpParams.vnp_SecureHash as string;

		// Tạo bản sao của tham số và loại bỏ các trường chữ ký
		const verifyParams: any = { ...vnpParams };
		delete verifyParams.vnp_SecureHash;
		delete verifyParams.vnp_SecureHashType;

		// Sắp xếp các tham số theo thứ tự a-z và mã hóa
		const sortedParams = this.sortObject(verifyParams);

		// Tạo chuỗi dữ liệu để tính toán chữ ký
		const signData = qs.stringify(sortedParams, { encode: false });

		// Tính toán lại chữ ký
		const hmac = crypto.createHmac('sha512', this.config.secretKey);
		const calculated = hmac
			.update(Buffer.from(signData, 'utf-8'))
			.digest('hex');

		// So sánh chữ ký tính toán với chữ ký nhận được
		return calculated === secureHash;
	}

	/**
	 * Hoàn tiền qua VNPay
	 */
	public async refund(params: VNPayRefundParams): Promise<any> {
		// Đặt múi giờ
		process.env.TZ = 'Asia/Ho_Chi_Minh';

		// Tạo ngày giờ theo định dạng YYYYMMDDHHmmss
		const date = new Date();
		const createDate = moment(date).format('YYYYMMDDHHmmss');
		const requestId = moment(date).format('HHmmss');

		// TransactionNo mặc định là 0 cho refund
		const transactionNo = '0';

		// Tạo thông tin order
		const orderInfo = 'Hoan tien GD ma:' + params.orderId;

		// Tạo chuỗi dữ liệu để ký
		const data =
			requestId +
			'|' +
			'2.1.0' +
			'|' +
			'refund' +
			'|' +
			this.config.tmnCode +
			'|' +
			(params.transType || '02') +
			'|' +
			params.orderId +
			'|' +
			params.amount * 100 +
			'|' +
			transactionNo +
			'|' +
			params.transDate +
			'|' +
			params.user +
			'|' +
			createDate +
			'|' +
			(params.ipAddr || '127.0.0.1') +
			'|' +
			orderInfo;

		// Tạo chữ ký
		const hmac = crypto.createHmac('sha512', this.config.secretKey);
		const secureHash = hmac
			.update(Buffer.from(data, 'utf-8'))
			.digest('hex');

		// Tạo object dữ liệu để gửi đi
		const refundParams = {
			vnp_RequestId: requestId,
			vnp_Version: '2.1.0',
			vnp_Command: 'refund',
			vnp_TmnCode: this.config.tmnCode,
			vnp_TransactionType: params.transType || '02',
			vnp_TxnRef: params.orderId,
			vnp_Amount: params.amount * 100,
			vnp_TransactionNo: transactionNo,
			vnp_TransactionDate: params.transDate,
			vnp_CreateBy: params.user,
			vnp_CreateDate: createDate,
			vnp_IpAddr: params.ipAddr || '127.0.0.1',
			vnp_OrderInfo: orderInfo,
			vnp_SecureHash: secureHash,
		};

		try {
			// URL API của VNPay
			const apiUrl =
				'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';

			// Gửi yêu cầu hoàn tiền
			const response = await axios.post(apiUrl, refundParams, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			return response.data;
		} catch (error) {
			throw new Error(`VNPay refund error: ${error}`);
		}
	}
}

export default new VNPayService();
