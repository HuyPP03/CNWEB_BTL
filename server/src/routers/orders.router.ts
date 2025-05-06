import express from 'express';
import * as order from "../controllers/customers/orders.controller";

const router = express.Router();

router.get('/', order.getOrders); // Lấy tất cả đơn hàng
router.post('/', order.createOrder); // Tạo đơn hàng mới
router.put('/:id', order.updateOrderById); // Cập nhật đơn hàng theo ID
router.delete('/:id', order.deleteOrderById); // Xóa đơn hàng theo ID

export default router;
