import express from 'express';
import * as order from "../controllers/customers/orders.controller";

const router = express.Router();

router.get('/', order.getAllOrders); // Lấy tất cả đơn hàng
router.get('/:id', order.getOrderById); // Lấy đơn hàng theo ID 
router.get('/customer/:customerId', order.getOrdersByCustomerId); // Lấy đơn hàng theo customerId
router.get('/status/:status', order.getOrdersByStatus); // Lấy đơn hàng theo trạng thái
router.post('/', order.createOrder); // Tạo đơn hàng mới
router.put('/:id', order.updateOrderById); // Cập nhật đơn hàng theo ID
router.delete('/:id', order.deleteOrderById); // Xóa đơn hàng theo ID
router.get('/orders-items/:orderId', order.getOrderItemsByOrderId); // Lấy danh sách order items theo orderId

export default router;
