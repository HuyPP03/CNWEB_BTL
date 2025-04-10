import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as productService from '../../services/managers/products.service';
import { db } from '../../loaders/database.loader';
import { Admins } from '../../models/admins.model';
import * as adminLogService from '../../services/managers/admin-logs.service';

// Lấy tất cả sản phẩm
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productService.getAllProducts();
        return res.status(200).json(new ResOk().formatResponse(products));
    } catch (error) {
        next(error);
    }
};

// Lấy sản phẩm theo ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
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
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const newProduct = await productService.createProduct(req.body, transaction);

        // await adminLogService.CreateAdminLog(
        //     (req.user as Admins).id,
        //     'Create',
        //     newProduct.id,
        //     'Product',
        //     req.body,
        //     transaction
        // );

        await transaction.commit();
        return res.status(201).json(new ResOk().formatResponse(newProduct));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Cập nhật sản phẩm
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body, transaction);
        if (!updatedProduct) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }

        // await adminLogService.CreateAdminLog(
        //     (req.user as Admins).id,
        //     'Update',
        //     updatedProduct.id,
        //     'Product',
        //     req.body,
        //     transaction
        // );

        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(updatedProduct));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Xoá sản phẩm
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const deletedCount = await productService.deleteProduct(req.params.id, transaction);
        if (!deletedCount) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }

        // await adminLogService.CreateAdminLog(
        //     (req.user as Admins).id,
        //     'Delete',
        //     parseInt(req.params.id),
        //     'Product',
        //     { deleted: true },
        //     transaction
        // );

        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse({ message: 'Deleted successfully' }));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
