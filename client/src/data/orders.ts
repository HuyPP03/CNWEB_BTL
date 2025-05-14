import { Order, OrderSummary } from "../types";

// Sample orders data
export const mockOrders: Order[] = [
    {
        id: 'ORD001',
        userId: '1',
        date: '2025-04-30',
        status: 'delivered',
        total: 14490000,
        items: [
            {
                id: '1',
                productId: 'mac-mini-m4',
                name: 'Mac mini M4 2024 10CPU 10GPU',
                image: 'https://cdn2.cellphones.com.vn/100x100,webp,q100/media/catalog/product/v/n/vn_mac_studio_m2_pdp_image_position_5_2.jpg',
                price: 14490000,
                quantity: 1
            }
        ],
        shippingAddress: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
        paymentMethod: 'Thanh toán khi nhận hàng (COD)'
    },
    {
        id: 'ORD002',
        userId: '1',
        date: '2025-04-25',
        status: 'pending',
        total: 29990000,
        items: [
            {
                id: '2',
                productId: 'samsung-s25-ultra',
                name: 'Samsung Galaxy S25 Ultra 256GB-Xanh',
                image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:350:0/q:80/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_2__6.png',
                price: 29990000,
                quantity: 1
            }
        ],
        shippingAddress: '456 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        paymentMethod: 'Chuyển khoản ngân hàng'
    },
    {
        id: 'ORD003',
        userId: '1',
        date: '2025-04-20',
        status: 'shipping',
        total: 25490000,
        items: [
            {
                id: '3',
                productId: 'iphone-15-pro',
                name: 'iPhone 15 Pro 256GB',
                image: 'https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-max-blue-titanium-600x600.jpg',
                price: 25490000,
                quantity: 1
            }
        ],
        shippingAddress: '789 Đường Lê Duẩn, Quận 1, TP. Hồ Chí Minh',
        paymentMethod: 'Thẻ tín dụng/ghi nợ'
    },
    {
        id: 'ORD004',
        userId: '1',
        date: '2025-04-15',
        status: 'confirmed',
        total: 16190000,
        items: [
            {
                id: '4',
                productId: 'hp-laptop',
                name: 'HP 15 fd0234TU i5 1334U',
                image: 'https://cdn.tgdd.vn/Products/Images/44/331568/macbook-pro-14-inch-m4-pro-den-600x600.jpg',
                price: 16190000,
                quantity: 1
            }
        ],
        shippingAddress: '101 Đường Đồng Khởi, Quận 1, TP. Hồ Chí Minh',
        paymentMethod: 'Thanh toán khi nhận hàng (COD)'
    },
    {
        id: 'ORD005',
        userId: '1',
        date: '2025-04-10',
        status: 'canceled',
        total: 990000,
        items: [
            {
                id: '5',
                productId: 'samsung-charger',
                name: 'Bộ sạc Samsung 45W',
                image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:0/q:80/plain/https://cellphones.com.vn/media/wysiwyg/s25-op-mipow.png',
                price: 990000,
                quantity: 1
            }
        ],
        shippingAddress: '202 Đường Điện Biên Phủ, Quận 3, TP. Hồ Chí Minh',
        paymentMethod: 'Thẻ tín dụng/ghi nợ'
    }
];

// Sample order summary data
export const orderSummary: OrderSummary = {
    totalOrders: 5,
    totalSpent: 87150000 // Sum of all order totals
};