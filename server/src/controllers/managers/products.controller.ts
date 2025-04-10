import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as productService from '../../services/managers/products.service';

// Lấy tất cả sản phẩm
export const getAllProducts = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const products = await productService.getAllProducts();
        return res.status(200).json(new ResOk().formatResponse(products));
    } catch (error) {
        next(error);
    }
};

// Lấy sản phẩm theo ID
export const getProductById = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(new ResOk().formatResponse(product));
    } catch (error) {
        next(error);
    }
};

// Tạo sản phẩm mới
export const createProduct = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        return res.status(201).json(new ResOk().formatResponse(newProduct));
    } catch (error) {
        next(error);
    }
};

// Cập nhật sản phẩm
export const updateProduct = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(new ResOk().formatResponse(updatedProduct));
    } catch (error) {
        next(error);
    }
};

// Xoá sản phẩm
export const deleteProduct = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const deleted = await productService.deleteProduct(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(new ResOk().formatResponse({ message: 'Deleted successfully' }));
    } catch (error) {
        next(error);
    }
};
