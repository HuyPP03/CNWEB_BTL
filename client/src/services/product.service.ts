import apiClient from './api.client';
import { ProductV2, ProductVariant, AttributeType } from '../types/product';

// Interface cho tham số truy vấn sản phẩm
export interface ProductQueryParams {
    id?: number;
    slug?: string;
    name?: string;
    brandId?: number;
    categoryId?: number;
    min?: number;
    max?: number;
    page?: number;
    limit?: number;
}

// Interface cho tham số truy vấn biến thể sản phẩm
export interface ProductVariantQueryParams {
    id?: number;
    productId?: number;
    stock?: number;
    min?: number;
    max?: number;
}

// Interface cho kết quả trả về từ API
export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    meta?: {
        limit: number;
        page: number;
        total: number;
    };
}

const productService = {
    /**
     * Lấy danh sách sản phẩm với các tham số lọc, phân trang
     * @param params Tham số truy vấn
     * @returns Danh sách sản phẩm và thông tin phân trang
     */
    async getProducts(params: ProductQueryParams = {}): Promise<ApiResponse<ProductV2[]>> {
        console.log('params', params);
        return apiClient.get<ApiResponse<ProductV2[]>>('/products', { params });
    },

    /**
   * Lấy chi tiết sản phẩm theo ID
   * @param id ID của sản phẩm
   * @returns Thông tin chi tiết của sản phẩm
   */
    async getProductById(id: number): Promise<ApiResponse<ProductV2[]>> {
        return apiClient.get<ApiResponse<ProductV2[]>>('/products', {
            params: { id }
        });
    },

    /**
     * Lấy chi tiết sản phẩm theo slug
     * @param slug Slug của sản phẩm
     * @returns Thông tin chi tiết của sản phẩm
     */
    async getProductBySlug(slug: string): Promise<ApiResponse<ProductV2[]>> {
        return apiClient.get<ApiResponse<ProductV2[]>>('/products', {
            params: { slug }
        });
    },    /**
     * Lấy danh sách biến thể sản phẩm với các tham số lọc
     * @param params Tham số truy vấn
     * @returns Danh sách biến thể sản phẩm
     */
    async getProductVariants(params: ProductVariantQueryParams = {}): Promise<ApiResponse<ProductVariant[]>> {
        return apiClient.get<ApiResponse<ProductVariant[]>>('/product-variant', { params });
    },

    /**
     * Lấy danh sách các loại thuộc tính theo ID danh mục
     * @param categoryId ID của danh mục
     * @returns Danh sách các loại thuộc tính và thuộc tính con
     */
    async getAttributeTypesByCategoryId(categoryId: number, varriantId?: number): Promise<ApiResponse<AttributeType[]>> {
        return apiClient.get<ApiResponse<AttributeType[]>>(`/public/attribute-types/${categoryId}?variantId=${varriantId}`);
    },

}

export default productService;