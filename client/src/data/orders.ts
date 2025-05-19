import { Order, OrderSummary } from "../types/order";

// Sample orders data based on API response format
export const mockOrders: Order[] = [    {
        id: 1,
        customerId: 3,
        warehouseId: null,
        totalAmount: "30790000.00",
        status: "cancelled",
        createdAt: "2025-05-17T11:04:46.000Z",
        updatedAt: "2025-05-17T11:04:46.000Z",
        orderItems: [
            {
                id: 2,
                orderId: 2,
                variantId: 7,
                quantity: 1,
                priceAtTime: "30790000.00",
                createdAt: "2025-05-17T11:04:46.000Z",
                updatedAt: "2025-05-17T11:04:46.000Z",
                productVariant: {
                    id: 7,
                    name: "iPhone 16 Pro Max",
                    productId: 4,
                    slug: "iphone-16-pro-max",
                    sku: "iphone-16-pro-max",
                    price: "30790000.00",
                    discountPrice: null,
                    stock: 99,
                    createdAt: "2025-05-14T04:56:52.000Z",
                    updatedAt: "2025-05-17T11:04:46.000Z"
                }
            }
        ],
        payments: [
            {
                id: 1,
                orderId: 1,
                amount: "30790000.00",
                paymentMethod: "COD",
                status: "pending",
                transactionId: null,
                createdAt: "2025-05-17T11:04:46.000Z",
                updatedAt: "2025-05-17T11:04:46.000Z"
            }
        ],
        shipping: {
            id: 1,
            orderId: 1,
            name: "Nguyễn Văn A",
            email: "nguyenvana@gmail.com",
            phone: "0987654321",
            shippingAddress: "Hà Nội, Việt Nam",
            shippingProvider: "GHN",
            trackingNumber: null,
            shippedAt: null,
            deliveredAt: null,
            createdAt: "2025-05-17T11:04:46.000Z",
            updatedAt: "2025-05-17T11:04:46.000Z"
        }
    },    {
        id: 2,
        customerId: 3,
        warehouseId: null,
        totalAmount: "14796.00",
        status: "pending",
        createdAt: "2025-05-17T07:10:38.000Z",
        updatedAt: "2025-05-17T07:10:38.000Z",
        orderItems: [
            {
                id: 1,
                orderId: 1,
                variantId: 8,
                quantity: 12,
                priceAtTime: "1233.00",
                createdAt: "2025-05-17T07:10:38.000Z",
                updatedAt: "2025-05-17T07:10:38.000Z",
                productVariant: {
                    id: 8,
                    name: "Samsung Galaxy S25",
                    productId: 3,
                    slug: "samsung-galaxy-s25",
                    sku: "samsung-s25",
                    price: "1233.00",
                    discountPrice: null,
                    stock: 0,
                    createdAt: "2025-05-14T05:04:10.000Z",
                    updatedAt: "2025-05-17T07:10:38.000Z"
                }
            }
        ],
        payments: [
            {
                id: 2,
                orderId: 2,
                amount: "14796.00",
                paymentMethod: "Banking",
                status: "completed",
                transactionId: "TX12345678",
                createdAt: "2025-05-17T07:10:38.000Z",
                updatedAt: "2025-05-17T07:10:38.000Z"
            }
        ],
        shipping: {
            id: 2,
            orderId: 2,
            name: "Trần Thị B",
            email: "tranthib@gmail.com",
            phone: "0912345678",
            shippingAddress: "Hồ Chí Minh, Việt Nam",
            shippingProvider: "GHTK",
            trackingNumber: "GH123456789",
            shippedAt: "2025-05-18T08:30:00.000Z",
            deliveredAt: null,
            createdAt: "2025-05-17T07:10:38.000Z",
            updatedAt: "2025-05-17T07:10:38.000Z"
        }
    },
    {
        id: 3,
        customerId: 3,
        warehouseId: null,
        totalAmount: "25490000.00",
        status: "shipped",
        createdAt: "2025-05-10T15:30:22.000Z",
        updatedAt: "2025-05-10T15:30:22.000Z",
        orderItems: [
            {
                id: 3,
                orderId: 3,
                variantId: 9,
                quantity: 1,
                priceAtTime: "25490000.00",
                createdAt: "2025-05-10T15:30:22.000Z",
                updatedAt: "2025-05-10T15:30:22.000Z",
                productVariant: {
                    id: 9,
                    name: "iPhone 15 Pro",
                    productId: 5,
                    slug: "iphone-15-pro",
                    sku: "iphone-15-pro",
                    price: "25490000.00",
                    discountPrice: null,
                    stock: 50,
                    createdAt: "2025-05-01T10:12:30.000Z",
                    updatedAt: "2025-05-10T15:30:22.000Z"
                }
            }
        ],
        payments: [],
        shipping: null
    },
    {
        id: 4,
        customerId: 3,
        warehouseId: null,
        totalAmount: "16190000.00",
        status: "processing",
        createdAt: "2025-05-05T09:45:12.000Z",
        updatedAt: "2025-05-05T09:45:12.000Z",
        orderItems: [
            {
                id: 4,
                orderId: 4,
                variantId: 10,
                quantity: 1,
                priceAtTime: "16190000.00",
                createdAt: "2025-05-05T09:45:12.000Z",
                updatedAt: "2025-05-05T09:45:12.000Z",
                productVariant: {
                    id: 10,
                    name: "MacBook Air M3",
                    productId: 6,
                    slug: "macbook-air-m3",
                    sku: "macbook-air-m3",
                    price: "16190000.00",
                    discountPrice: null,
                    stock: 30,
                    createdAt: "2025-04-20T08:30:15.000Z",
                    updatedAt: "2025-05-05T09:45:12.000Z"
                }
            }
        ],
        payments: [],
        shipping: null
    },
    {
        id: 5,
        customerId: 3,
        warehouseId: null,
        totalAmount: "990000.00",
        status: "delivered",
        createdAt: "2025-04-25T14:22:37.000Z",
        updatedAt: "2025-04-25T14:22:37.000Z",
        orderItems: [
            {
                id: 5,
                orderId: 5,
                variantId: 11,
                quantity: 1,
                priceAtTime: "990000.00",
                createdAt: "2025-04-25T14:22:37.000Z",
                updatedAt: "2025-04-25T14:22:37.000Z",
                productVariant: {
                    id: 11,
                    name: "Bộ sạc Samsung 45W",
                    productId: 7,
                    slug: "bo-sac-samsung-45w",
                    sku: "samsung-45w-charger",
                    price: "990000.00",
                    discountPrice: null,
                    stock: 100,
                    createdAt: "2025-04-10T11:15:33.000Z",
                    updatedAt: "2025-04-25T14:22:37.000Z"
                }
            }
        ],
        payments: [],
        shipping: null
    },
    {
        id: 6,
        customerId: 3,
        warehouseId: null,
        totalAmount: "45000000.00",
        status: "cancelled",
        createdAt: "2025-04-15T10:05:22.000Z",
        updatedAt: "2025-04-16T08:30:45.000Z",
        orderItems: [
            {
                id: 6,
                orderId: 6,
                variantId: 12,
                quantity: 1,
                priceAtTime: "45000000.00",
                createdAt: "2025-04-15T10:05:22.000Z",
                updatedAt: "2025-04-15T10:05:22.000Z",
                productVariant: {
                    id: 12,
                    name: "iPad Pro M2 12.9",
                    productId: 8,
                    slug: "ipad-pro-m2-129",
                    sku: "ipad-pro-m2-129",
                    price: "45000000.00",
                    discountPrice: null,
                    stock: 15,
                    createdAt: "2025-04-01T09:10:25.000Z",
                    updatedAt: "2025-04-15T10:05:22.000Z"
                }
            }
        ],
        payments: [],
        shipping: null
    }
];

// Sample order summary data
export const orderSummary: OrderSummary = {
    totalOrders: mockOrders.length,
    totalSpent: mockOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0)
};