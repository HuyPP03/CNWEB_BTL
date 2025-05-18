import express from 'express';
import PaymentController from '../controllers/payment.controller';

const router = express.Router();

// Tạo thanh toán
router.post('/create', PaymentController.createPayment);

// Hoàn tiền
router.post('/refund', PaymentController.refund);

// VNPay callback
router.get('/vnpay/callback', PaymentController.vnpayCallback);

// MoMo callback
router.get('/momo/callback', PaymentController.momoCallback);

// PayPal callback
router.get('/paypal/success', PaymentController.paypalSuccess);
router.get('/paypal/cancel', PaymentController.paypalCancel);

export default router;
