import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, MapPin, Minus, Plus } from 'lucide-react';

interface ProductOption {
    id: number;
    label: string;
    value: string;
}

interface Promotion {
    id: number;
    label: string;
    value?: string;
    isSelected?: boolean;
}

interface CartItem {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    options?: ProductOption[];
    promotions?: {
        onlinePrice?: boolean;
        choose?: Promotion[];
        all?: Promotion[];
    };
    bonusItems?: {
        name: string;
        image: string;
    }[];
}

const ShoppingCart: React.FC = () => {
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: 'Điện thoại iPhone 16 Pro Max 256GB',
            image: 'https://cdn.tgdd.vn/Products/Images/42/329959/TimerThumb/vivo-v40-lite-8gb-256gb-(20).jpg',
            price: 31090000,
            quantity: 1,
            options: [
                { id: 1, label: 'Màu', value: 'Titan Sa Mạc' }
            ],
            promotions: {
                onlinePrice: true,
                all: [
                    { id: 1, label: '4 Khuyến mãi' }
                ]
            }
        },
        {
            id: 2,
            name: 'Laptop Acer Aspire 7 A715 76 53PJ i5 12450H/16GB/512GB/Win11 (NH.QGESV.007)',
            image: 'https://cdn.tgdd.vn/Products/Images/42/329959/TimerThumb/vivo-v40-lite-8gb-256gb-(20).jpg',
            price: 13790000,
            originalPrice: 15990000,
            quantity: 1,
            options: [
                { id: 1, label: 'Màu', value: 'Đen' }
            ],
            promotions: {
                choose: [
                    { id: 1, label: 'Giảm ngay 700.000đ', value: '700000' },
                    { id: 2, label: 'Tặng Microsoft 365 Personal', value: 'microsoft' }
                ],
                all: [
                    { id: 3, label: '4 Khuyến mãi' }
                ]
            },
            bonusItems: [
                { name: 'Balo Gaming', image: '/api/placeholder/40/40' }
            ]
        }
    ]);

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleRemoveItem = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handlePromotionSelect = (itemId: number, promotionId: number) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === itemId && item.promotions?.choose) {
                    return {
                        ...item,
                        promotions: {
                            ...item.promotions,
                            choose: item.promotions.choose.map(promo => ({
                                ...promo,
                                isSelected: promo.id === promotionId
                            }))
                        }
                    };
                }
                return item;
            })
        );
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    return (
        <div className="max-w-2xl mx-auto bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-center relative border-b">
                <button className="absolute left-4">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-medium">Giỏ Hàng</h1>
            </div>

            {/* Delivery Options */}
            <div className="bg-white p-4 mb-2 flex rounded-md">
                <div className="flex items-center gap-2 w-1/2">
                    <input
                        type="radio"
                        id="delivery"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'delivery'}
                        onChange={() => setDeliveryMethod('delivery')}
                        className="w-4 h-4 accent-blue-600"
                    />
                    <label htmlFor="delivery" className="text-sm">Giao tận nơi</label>
                </div>

                <div className="flex items-center gap-2 w-1/2">
                    <input
                        type="radio"
                        id="pickup"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                        className="w-4 h-4 accent-blue-600"
                    />
                    <label htmlFor="pickup" className="text-sm">Nhận tại siêu thị</label>
                </div>
            </div>

            {/* Delivery Address */}
            {deliveryMethod === 'delivery' && (
                <div className="bg-white p-4 mb-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium mb-1">Người nhận: Anh B Huy - 0986736868</p>
                            <div className="flex items-center text-sm text-red-500">
                                <MapPin size={16} className="mr-1" />
                                <span>Hồ Chí Minh</span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-blue-500" />
                    </div>
                </div>
            )}

            {/* Cart Items */}
            <div className="bg-white mb-2">
                {cartItems.map((item, index) => (
                    <div key={item.id} className={`p-4 ${index !== cartItems.length - 1 ? 'border-b' : ''}`}>
                        <div className="flex gap-4">
                            {/* Product Image */}
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />

                            {/* Product Details */}
                            <div className="flex-1">
                                <h3 className="font-medium mb-1">{item.name}</h3>

                                {/* Product Options */}
                                {item.options?.map(option => (
                                    <div key={option.id} className="flex items-center text-sm mb-1">
                                        <span className="mr-1">{option.label}</span>
                                        <span className="font-medium">{option.value}</span>
                                        <ChevronDown size={16} className="ml-1 text-gray-500" />
                                    </div>
                                ))}

                                {/* Online Price */}
                                {item.promotions?.onlinePrice && (
                                    <div className="flex items-center text-sm text-blue-600 mb-1">
                                        <div className="w-4 h-4 flex items-center justify-center border border-blue-600 rounded-full mr-1">
                                            <span className="text-xs">đ</span>
                                        </div>
                                        <span>Online giá rẻ quá</span>
                                        <ChevronDown size={16} className="ml-1" />
                                    </div>
                                )}

                                {/* Promotions - Choose One */}
                                {item.promotions?.choose && item.promotions.choose.length > 0 && (
                                    <div className="mb-2">
                                        <p className="text-sm mb-1">Chọn 1 trong 2 khuyến mãi</p>
                                        {item.promotions.choose.map(promo => (
                                            <div key={promo.id} className="flex items-center gap-2 mb-1">
                                                <input
                                                    type="radio"
                                                    id={`promo-${item.id}-${promo.id}`}
                                                    name={`promo-${item.id}`}
                                                    className="w-4 h-4 accent-blue-600"
                                                    checked={promo.isSelected}
                                                    onChange={() => handlePromotionSelect(item.id, promo.id)}
                                                />
                                                <label htmlFor={`promo-${item.id}-${promo.id}`} className="text-sm">
                                                    {promo.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* All Promotions */}
                                {item.promotions?.all && item.promotions.all.length > 0 && (
                                    <div className="mb-2">
                                        {item.promotions.all.map(promo => (
                                            <div key={promo.id} className="flex items-center text-sm text-blue-600">
                                                <span>{promo.label}</span>
                                                <ChevronDown size={16} className="ml-1" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Bonus Items */}
                                {item.bonusItems && item.bonusItems.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Hình quà khuyến mãi</p>
                                        <div className="flex gap-2 mt-1">
                                            {item.bonusItems.map((bonusItem, i) => (
                                                <div key={i} className="flex items-center bg-gray-100 rounded p-1">
                                                    <img src={bonusItem.image} alt={bonusItem.name} className="w-6 h-6 mr-1" />
                                                    <span className="text-xs">{bonusItem.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Price and Quantity */}
                            <div className="flex flex-col items-end">
                                <div className="text-right mb-4">
                                    <p className="text-red-500 font-medium">{formatPrice(item.price)}</p>
                                    {item.originalPrice && (
                                        <p className="text-gray-500 text-sm line-through">
                                            {formatPrice(item.originalPrice)}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mt-auto">
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-sm text-gray-500"
                                    >
                                        Xoá
                                    </button>

                                    <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded"
                                    >
                                        <Minus size={16} />
                                    </button>

                                    <span className="w-6 text-center">{item.quantity}</span>

                                    <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white p-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm">Tạm tính ({totalItems} sản phẩm):</p>
                    <p className="text-lg text-red-500 font-medium">{formatPrice(subtotal)}</p>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;