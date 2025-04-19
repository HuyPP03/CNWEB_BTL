import express from 'express';
import * as cartController from '../controllers/customers/carts.controller';

const router = express.Router();

// Lấy giỏ hàng + sản phẩm trong giỏ theo customerId
router.get('/:customerId', cartController.getCartWithItems);

// Thêm sản phẩm vào giỏ hàng (hoặc tăng số lượng nếu đã có)
router.post('/items/:cartId', cartController.addItemToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/items/:itemId', cartController.updateCartItemQuantity);

// Xoá một sản phẩm khỏi giỏ hàng
router.delete('/items/:itemId', cartController.removeItemFromCart);

// Xoá toàn bộ sản phẩm khỏi giỏ hàng
router.delete('/clear/:cartId', cartController.clearCart);

export default router;
