import express from 'express';
import * as order from "../controllers/customers/orders.controller";
import { verifyToken } from '../middleware/authenticate.middleware';

const router = express.Router();
router.use(verifyToken); // Kiểm tra token trước khi thực hiện các hành động khác

router.get('/', order.getOrders); // Lấy tất cả đơn hàng
router.post('/:cartId', order.createOrder); // Tạo đơn hàng mới
router.put('/:id', order.updateOrderById); // Cập nhật đơn hàng theo ID
router.delete('/:id', order.deleteOrderById); // Xóa đơn hàng theo ID

export default router;
