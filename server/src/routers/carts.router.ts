import express from 'express';
import * as cartController from '../controllers/customers/carts.controller';

const router = express.Router();

router.get('/:customerId', cartController.getCartWithItems); // Lấy giỏ hàng + sản phẩm trong giỏ theo customerId
router.post('/items/:cartId', cartController.addItemToCart); // Thêm sản phẩm vào giỏ hàng (hoặc tăng số lượng nếu đã có)
router.put('/items/:itemId', cartController.updateCartItemQuantity); // Cập nhật số lượng sản phẩm trong giỏ hàng
router.delete('/items/:itemId', cartController.removeItemFromCart); // Xoá một sản phẩm khỏi giỏ hàng
router.delete('/clear/:customerId', cartController.clearCart); // Xoá toàn bộ sản phẩm khỏi giỏ hàng

export default router;
