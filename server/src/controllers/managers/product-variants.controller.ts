import { Request, Response, NextFunction } from 'express';
import { db } from '../../loaders/database.loader';
import { ResOk } from '../../utility/response.util';

// Lấy tất cả biến thể sản phẩm
export const getAllVariants = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const variants = await db.productVariants.findAll();
        return res.status(200).json(new ResOk().formatResponse(variants));
    } catch (e) {
        next(e);
    }
};

// Lấy biến thể theo id
export const getVariantById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const variant = await db.productVariants.findByPk(req.params.id);
        if (!variant) {
            return res.status(404).json({ message: 'Not found' });
        }
        return res.status(200).json(new ResOk().formatResponse(variant));
    } catch (e) {
        next(e);
    }
};

// Tạo mới biến thể sản phẩm
export const createVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const newVariant = await db.productVariants.create(req.body);
        return res.status(201).json(new ResOk().formatResponse(newVariant));
    } catch (e) {
        next(e);
    }
};

// Cập nhật biến thể
export const updateVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const variant = await db.productVariants.findByPk(req.params.id);
        if (!variant) {
            return res.status(404).json({ message: 'Not found' });
        }
        await variant.update(req.body);
        return res.status(200).json(new ResOk().formatResponse(variant));
    } catch (e) {
        next(e);
    }
};

// Xoá biến thể
export const deleteVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const deleted = await db.productVariants.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Not found' });
        }
        return res
            .status(200)
            .json(new ResOk().formatResponse({ message: 'Deleted successfully' }));
    } catch (e) {
        next(e);
    }
};
