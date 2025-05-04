export interface CartItem {
    id: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    quantity: number;
    stock: number;
    specifications: string;
}

export interface RecommendedProduct {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    discount: number;
}