import { apiClient } from './api.client';

export interface CreatePaymentRequest {
    gateway: 'vnpay';
    amount: number;
    orderId: number;
    orderInfo: string;
    ipAddr: string;
}

export interface CreatePaymentResponse {
    success: boolean;
    data: {
        redirectUrl: string;
    };
}

class PaymentService {
    /**
     * Create a payment through VNPay
     * @param params Payment parameters
     * @returns Response with redirect URL
     */
    async createPayment(params: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        console.log('Payment params:', params);
        return await apiClient.post<CreatePaymentResponse>(
            '/payments/create',
            params
        );
    }

    /**
     * Redirect user to VNPay payment page
     * @param redirectUrl URL returned from createPayment
     */
    redirectToPaymentGateway(redirectUrl: string): void {
        window.location.href = redirectUrl;
    }    /**
     * Get client IP address
     * In a production environment, this should be handled by the server
     * This implementation tries multiple approaches for better coverage
     * @returns Client IP address or a placeholder
     */
    getClientIpAddress(): string {
        // For production, the ideal solution is to have the server determine the IP
        // This client-side method is a fallback and may not be reliable in all cases

        try {
            // We'll return a placeholder for now, as client-side IP detection is unreliable
            // In a real production scenario, the server would provide this information
            return '127.0.0.1';
        } catch (error) {
            console.error('Error getting client IP address:', error);
            return '127.0.0.1';
        }
    }

    /**
     * Check payment status from URL path and params
     * @param path The current URL path
     * @param searchParams URL search parameters from the callback URL
     * @returns Payment validation result
     */
    validatePaymentCallback(path: string, searchParams: URLSearchParams): {
        success: boolean;
        orderId: string | null;
        message: string;
    } {
        // Extract orderId from query parameters
        const orderId = searchParams.get('orderId');

        // Check if path contains payment-success or payment-failed
        if (path.includes('payment-success')) {
            return {
                success: true,
                orderId,
                message: 'Giao dịch thành công'
            };
        } else if (path.includes('payment-failed')) {
            return {
                success: false,
                orderId,
                message: 'Giao dịch thanh toán thất bại. Vui lòng thử lại sau.'
            };
        }

        // For legacy URLs with vnp_* parameters
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');

        if (vnp_ResponseCode === '00') {
            return {
                success: true,
                orderId: this.extractOrderIdFromVnpOrderInfo(searchParams.get('vnp_OrderInfo')),
                message: 'Giao dịch thành công'
            };
        }

        // Payment failed with VNPay response code
        return {
            success: false,
            orderId: this.extractOrderIdFromVnpOrderInfo(searchParams.get('vnp_OrderInfo')),
            message: this.getErrorMessageFromVnpResponseCode(vnp_ResponseCode)
        };
    }

    /**
     * Extract order ID from VNPay order info
     * @param orderInfo The vnp_OrderInfo parameter value
     * @returns Extracted order ID or null
     */
    private extractOrderIdFromVnpOrderInfo(orderInfo: string | null): string | null {
        if (!orderInfo) return null;

        const orderIdMatch = orderInfo.match(/(\d+)$/);
        if (orderIdMatch && orderIdMatch[1]) {
            return orderIdMatch[1];
        }
        return null;
    }

    /**
     * Get user-friendly error message from VNPay response code
     * @param responseCode VNPay response code
     * @returns User-friendly error message
     */
    private getErrorMessageFromVnpResponseCode(responseCode: string | null): string {
        if (!responseCode) return 'Không nhận được phản hồi từ cổng thanh toán';

        switch (responseCode) {
            case '24':
                return 'Giao dịch bị hủy bởi người dùng';
            case '51':
                return 'Tài khoản không đủ số dư để thanh toán';
            case '11':
                return 'Đã hết hạn chờ thanh toán';
            case '12':
                return 'Thẻ/Tài khoản bị khóa';
            default:
                return `Giao dịch thất bại (Mã lỗi: ${responseCode})`;
        }
    }
}

export const paymentService = new PaymentService();