import express from 'express';
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from '../controllers/carts.controller';

const router = express.Router();

router.post('/carts/add', addToCart);
router.get('/carts/:customerId', getCart);
router.put('/carts/update', updateCartItem);
router.delete('/carts/remove/:cartItemId', removeCartItem);
router.delete('/carts/clear/:customerId', clearCart);

export default router;
