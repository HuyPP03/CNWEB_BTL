import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as variantService from '../../services/customers/product-variants.service';

// Lấy tất cả biến thể sản phẩm
export const getAllVariants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const variants = await variantService.getAllVariants();
        return res.status(200).json(new ResOk().formatResponse(variants));
    } catch (error) {
        next(error);
    }
};

// Lấy biến thể sản phẩm theo ID
export const getVariantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const variant = await variantService.getVariantById(req.params.id);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }
        return res.status(200).json(new ResOk().formatResponse(variant));
    } catch (error) {
        next(error);
    }
};

// Tìm biến thể sản phẩm theo tên
export const getVariantsByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.query;
        const variants = await variantService.getVariantsByName(name as string);
        return res.status(200).json(new ResOk().formatResponse(variants));
    } catch (error) {
        next(error);
    }
};

// Tìm biến thể sản phẩm theo productId (sản phẩm cha)
export const getVariantsByProductId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params;
        const variants = await variantService.getVariantsByProductId(productId);
        return res.status(200).json(new ResOk().formatResponse(variants));
    } catch (error) {
        next(error);
    }
};

// Tìm biến thể sản phẩm theo brandId
export const getVariantsByBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { brandId } = req.params;
        const variants = await variantService.getVariantsByBrand(brandId);
        return res.status(200).json(new ResOk().formatResponse(variants));
    } catch (error) {
        next(error);
    }
};

// Tìm biến thể sản phẩm theo categoryId
export const getVariantsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId } = req.params;
        const variants = await variantService.getVariantsByCategory(categoryId);
        return res.status(200).json(new ResOk().formatResponse(variants));
    } catch (error) {
        next(error);
    }
};

// Tìm biến thể sản phẩm theo khoảng giá
export const getVariantsByPriceRange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { min, max } = req.query;
        const variants = await variantService.getVariantsByPriceRange(
            parseFloat(min as string),
            parseFloat(max as string)
        );
        return res.status(200).json(new ResOk().formatResponse(variants));
    } catch (error) {
        next(error);
    }
};

// Tìm biến thể sản phẩm nâng cao (nhiều điều kiện)
export const filterVariants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const variants = await variantService.filterVariants(req.query);
        return res.status(200).json(new ResOk().formatResponse(variants));
    } catch (error) {
        next(error);
    }
};

