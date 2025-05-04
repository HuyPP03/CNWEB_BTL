import { CartItem, RecommendedProduct } from "../types";

// Sample cart items data
export const initialCartItems: CartItem[] = [
    {
        id: '1',
        productId: 'mac-mini-m4',
        name: 'Mac mini M4 2024 10CPU 10GPU 16GB 256GB | Chính hãng Apple Việt Nam-Bạc',
        image: 'https://cdn2.cellphones.com.vn/100x100,webp,q100/media/catalog/product/v/n/vn_mac_studio_m2_pdp_image_position_5_2.jpg',
        price: 14490000,
        originalPrice: 14990000,
        quantity: 1,
        stock: 10,
        specifications: '10CPU 10GPU 16GB 256GB'
    },
    {
        id: '2',
        productId: 'samsung-s25-ultra',
        name: 'Samsung Galaxy S25 Ultra 256GB-Xanh',
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:350:0/q:80/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_2__6.png',
        price: 29990000,
        originalPrice: 32990000,
        quantity: 1,
        stock: 5,
        specifications: '256GB-Xanh'
    }
];

// Sample recommended products
export const recommendedProducts: Record<string, RecommendedProduct[]> = {
    'mac-mini-m4': [
        {
            id: 'r1',
            name: 'Bàn phím và chuột Logitech MX',
            image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:0/q:80/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_5__9_78.png',
            price: 2190000,
            originalPrice: 2390000,
            discount: 5
        },
        {
            id: 'r2',
            name: 'Màn hình Dell UltraSharp 27"',
            image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:0/q:80/plain/https://cellphones.com.vn/media/catalog/product/b/a/balo-laptop-divoom-pixoo-led-backpack-2022-2.jpg',
            price: 7990000,
            originalPrice: 8990000,
            discount: 3
        },
        {
            id: 'r3',
            name: 'Túi đựng laptop MacBook',
            image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:0/q:80/plain/https://cellphones.com.vn/media/catalog/product/b/a/balo-laptop-divoom-pixoo-led-backpack-2022-2.jpg',
            price: 490000,
            originalPrice: 590000,
            discount: 10
        }
    ],
    'samsung-s25-ultra': [
        {
            id: 'r4',
            name: 'Ốp lưng Samsung Galaxy S25 Ultra',
            image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:0/q:80/plain/https://cellphones.com.vn/media/wysiwyg/s25-op-mipow.png',
            price: 290000,
            originalPrice: 390000,
            discount: 10
        },
        {
            id: 'r5',
            name: 'Bộ sạc Samsung 45W',
            image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:0/q:80/plain/https://cellphones.com.vn/media/wysiwyg/s25-op-mipow.png',
            price: 990000,
            originalPrice: 1190000,
            discount: 10
        }
    ]
};