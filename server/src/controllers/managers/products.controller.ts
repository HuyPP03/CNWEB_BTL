import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as productService from '../../services/managers/products.service';
import * as productImageService from '../../services/managers/product-images.service';
import { db } from '../../loaders/database.loader';
import { Admins } from '../../models/admins.model';
import * as adminLogService from '../../services/managers/admin-logs.service';

// Tạo sản phẩm mới
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const files = req.files as Express.Multer.File[];
        
        const { newProduct, newVariant } = await productService.createProduct(req.body, transaction);

        const images = await productImageService.createProductImages(files, newProduct.id, transaction);

        // Ghi adminlog
        await adminLogService.CreateAdminLog(
            (req.user as Admins).id,
            'Create',
            newProduct.id,
            'Product',
            req.body,
            transaction
        );

        await transaction.commit();
        return res.status(201).json(
            new ResOk().formatResponse({
                product: newProduct,
                defaultVariant: newVariant,
                images
            })
        );
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Cập nhật sản phẩm
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const updatedProduct = await productService.updateProduct(Number(req.params.id), req.body, transaction);

        // Xử lý ảnh
        const keepImageIds: number[] = req.body.keepImageIds || [];
        const primaryImageId: number | null = req.body.primaryImageId || null;

        // 1. Xoá các ảnh không được giữ lại
        const existingImages = await productImageService.getProductImages((updatedProduct as any)?.id, transaction);
        const imagesToDelete = existingImages.filter(
            img => !keepImageIds.includes(img.id)
        );

        for (const img of imagesToDelete) {
            await productImageService.deleteProductImage(img.id);
        }

        // 2. Tải ảnh mới nếu có
        if (req.files && Array.isArray(req.files)) {
            await productImageService.createProductImages(req.files, (updatedProduct as any)?.id, transaction);
        }

        // 3. Cập nhật ảnh chính nếu có
        if (primaryImageId) {
            await productImageService.setPrimaryImage((updatedProduct as any)?.id, primaryImageId, transaction);
        }

        if (!updatedProduct) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ghi adminlog
        await adminLogService.CreateAdminLog(
            (req.user as Admins).id,
            'Update',
            updatedProduct.id,
            'Product',
            req.body,
            transaction
        );

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
        const productId = req.params.id;
        const productImages = await db.productImages.findAll({
            where: { productId },
            transaction
        });

        for (const image of productImages) {
            await productImageService.deleteProductImage(image.id, transaction);
        }

        const deletedCount = await productService.deleteProduct(req.params.id, transaction);

        if (!deletedCount) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ghi adminlog
        await adminLogService.CreateAdminLog(
            (req.user as Admins).id,
            'Delete',
            parseInt(req.params.id),
            'Product',
            { deleted: true },
            transaction
        );

        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse({ message: 'Deleted successfully' }));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
