# Module Thanh Toán

Module thanh toán tích hợp VNPay, MoMo và PayPal để dễ dàng thực hiện thanh toán và hoàn tiền trong ứng dụng.

## Cấu hình

Thêm các biến môi trường vào file `.env`:

```env
# VNPay
VNPAY_TMN_CODE=YOUR_VNPAY_TMN_CODE
VNPAY_SECRET_KEY=YOUR_VNPAY_SECRET_KEY
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://yourdomain.com/api/payments/vnpay/callback

# MoMo
MOMO_PARTNER_CODE=YOUR_MOMO_PARTNER_CODE
MOMO_ACCESS_KEY=YOUR_MOMO_ACCESS_KEY
MOMO_SECRET_KEY=YOUR_MOMO_SECRET_KEY
MOMO_API_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_RETURN_URL=https://yourdomain.com/api/payments/momo/callback
MOMO_NOTIFY_URL=https://yourdomain.com/api/payments/momo/notify

# PayPal
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_CLIENT_SECRET
PAYPAL_MODE=sandbox # hoặc live
```

## Sử dụng API

### 1. Tạo thanh toán

```
POST /api/payments/create
```

#### Body cho VNPay

```json
{
  "gateway": "vnpay",
  "amount": 100000,
  "orderId": "ORDER123",
  "orderInfo": "Thanh toán đơn hàng #ORDER123"
}
```

#### Body cho MoMo

```json
{
  "gateway": "momo",
  "amount": 100000,
  "orderId": "ORDER123",
  "orderInfo": "Thanh toán đơn hàng #ORDER123",
  "requestId": "REQ123" // tùy chọn, sẽ tự động tạo nếu không có
}
```

#### Body cho PayPal

```json
{
  "gateway": "paypal",
  "amount": 10,
  "currency": "USD",
  "description": "Payment for Order #123",
  "invoiceId": "INV-123" // tùy chọn
}
```

#### Phản hồi

```json
{
  "success": true,
  "data": {
    "redirectUrl": "https://payment-gateway-url" // Đối với VNPay, MoMo
    // hoặc
    "paymentId": "PAY-123", // Đối với PayPal
    "approvalUrl": "https://paypal-approval-url",
    "response": { ... } // Thông tin chi tiết từ PayPal
  }
}
```

### 2. Hoàn tiền

```
POST /api/payments/refund
```

#### Body cho VNPay

```json
{
  "gateway": "vnpay",
  "amount": 100000,
  "orderId": "ORDER123",
  "transDate": "20230615123456",
  "user": "admin"
}
```

#### Body cho MoMo

```json
{
  "gateway": "momo",
  "amount": 100000,
  "orderId": "ORDER123",
  "transId": "TRANS123",
  "requestId": "REQ789",
  "description": "Hoàn tiền đơn hàng #ORDER123"
}
```

#### Body cho PayPal

```json
{
  "gateway": "paypal",
  "paymentId": "PAY-123",
  "amount": 10,
  "currency": "USD",
  "note": "Refund for Order #123" // tùy chọn
}
```

#### Phản hồi

```json
{
  "success": true,
  "data": {
    // Thông tin phản hồi từ cổng thanh toán
  }
}
```

## Sử dụng trong code

Bạn có thể sử dụng dịch vụ thanh toán trực tiếp trong code:

```typescript
import { PaymentGateway, PaymentService } from '../services/payments';

// Tạo thanh toán
const paymentUrl = await PaymentService.createPayment(
  PaymentGateway.VNPAY,
  {
    amount: 100000,
    orderId: 'ORDER123',
    orderInfo: 'Thanh toán đơn hàng #ORDER123',
    ipAddr: '127.0.0.1'
  }
);

// Hoàn tiền
const refundResult = await PaymentService.refund(
  PaymentGateway.MOMO,
  {
    amount: 100000,
    orderId: 'ORDER123',
    transId: 'TRANS123',
    requestId: 'REQ789',
    description: 'Hoàn tiền đơn hàng #ORDER123'
  }
);
```