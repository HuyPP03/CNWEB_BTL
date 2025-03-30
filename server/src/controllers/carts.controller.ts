import { Request, Response } from 'express';
import { Carts } from '../models/carts.model';
import { CartItems } from '../models/cart-items.model';
import { Products } from '../models/products.model';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { customerId, sessionId, variantId, quantity } = req.body;
        
        let cart = await Carts.findOne({ where: { customerId, sessionId } });
        
        if (!cart) {
            cart = await Carts.create({ customerId, sessionId });
        }
        
        let cartItem = await CartItems.findOne({ where: { cartId: cart.id, variantId } });
        
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await CartItems.create({ cartId: cart.id, variantId, quantity });
        }
        
        return res.json({ success: true, cartItem });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// Lấy giỏ hàng của người dùng
export const getCart = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { customerId } = req.params;
        const cart = await Carts.findOne({ where: { customerId }, include: { model: CartItems, include: [Products] } });
        return res.json({ success: true, cart });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};
/*
// Lấy tổng tiền giỏ hàng
export const getCartTotal = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { customerId } = req.params;
        const cart = await Carts.findOne({ where: { customerId }, include: { model: CartItems, as: 'CartItems', include: [Products] } });
        if (!cart) return res.json({ success: true, total: 0 });
        
        const total: number = cart.CartItems.reduce((sum: number, item: CartItems) => {
            return sum + item.quantity * (item.Product?.basePrice || 0);
        }, 0);
        return res.json({ success: true, total });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || 'Đã xảy ra lỗi' });
    }
};*/

// Tăng số lượng sản phẩm trong giỏ hàng
export const increaseCartItem = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cartItemId } = req.body;
        const cartItem = await CartItems.findByPk(cartItemId);
        if (!cartItem) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        
        cartItem.quantity += 1;
        await cartItem.save();
        return res.json({ success: true, cartItem });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || 'Đã xảy ra lỗi' });
    }
};

// Giảm số lượng sản phẩm trong giỏ hàng
export const decreaseCartItem = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cartItemId } = req.body;
        const cartItem = await CartItems.findByPk(cartItemId);
        if (!cartItem) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
        } else {
            await cartItem.destroy();
        }
        return res.json({ success: true, cartItem });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || 'Đã xảy ra lỗi' });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cartItemId, quantity } = req.body;
        const cartItem = await CartItems.findByPk(cartItemId);
        if (!cartItem) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        
        cartItem.quantity = quantity;
        await cartItem.save();
        return res.json({ success: true, cartItem });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeCartItem = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cartItemId } = req.params;
        await CartItems.destroy({ where: { id: cartItemId } });
        return res.json({ success: true, message: 'Sản phẩm đã được xóa khỏi giỏ hàng' });
    } catch (error) {
        return res.status(500).json({ success: false});
    }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { customerId } = req.params;
        const cart = await Carts.findOne({ where: { customerId } });
        if (cart) {
            await CartItems.destroy({ where: { cartId: cart.id } });
            await cart.destroy();
        }
        return res.json({ success: true, message: 'Giỏ hàng đã được xóa' });
    } catch (error) {
        return res.status(500).json({ success: false});
    }
};
