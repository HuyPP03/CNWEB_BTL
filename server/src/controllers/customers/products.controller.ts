import { Request, Response, NextFunction } from 'express';
import { db } from '../../loaders/database.loader';
import { ResOk } from '../../utility/response.util';

// Lấy tất cả sản phẩm
export const getAllProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const products = await db.products.findAll();
		return res.status(200).json(new ResOk().formatResponse(products));
	} catch (error) {
		next(error);
	}
};

// Lấy sản phẩm theo id
export const getProductById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const product = await db.products.findByPk(req.params.id);
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
		const newProduct = await db.products.create(req.body);
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
		const product = await db.products.findByPk(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}
		await product.update(req.body);
		return res.status(200).json(new ResOk().formatResponse(product));
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
		const deleted = await db.products.destroy({
			where: { id: req.params.id },
		});
		if (!deleted) {
			return res.status(404).json({ message: 'Product not found' });
		}
		return res
			.status(200)
			.json(new ResOk().formatResponse({ message: 'Deleted successfully' }));
	} catch (error) {
		next(error);
	}
};
