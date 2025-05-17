import express from 'express';
import * as order from '../controllers/customers/orders.controller';
import * as shipping from '../controllers/customers/shippings.controller';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';

const router = express.Router();

router.get('/', isManager, verifyToken, order.getOrders); // Lấy tất cả đơn hàng

router.get('/customer', verifyToken, order.getOrders); // Lấy của khách hàng

router.post('/confirm/:id', verifyToken, order.confirmOrder); // Xác nhận đơn hàng
router.put('/cancel/:id', verifyToken, order.cancelOrder); // hủy đơn hàng

router.post('/', verifyToken, order.createOrder); // Tạo đơn hàng mới

router.put('/:id', isManager, verifyToken, order.updateOrderById); // Cập nhật đơn hàng theo ID
router.delete('/:id', isManager, verifyToken, order.deleteOrderById); // Xóa đơn hàng theo ID

router.put('/shipping/:id', verifyToken, shipping.updateShipping);

export default router;
