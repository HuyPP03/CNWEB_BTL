import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as productService from '../../services/customers/products.service';

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

// Tìm sản phẩm theo tên
export const getProductsByName = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name } = req.query;
		const products = await productService.getProductsByName(name as string);
		return res.status(200).json(new ResOk().formatResponse(products));
	} catch (error) {
		next(error);
	}
};

// Tìm sản phẩm theo brand
export const getProductsByBrand = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { brandId } = req.params;
		const products = await productService.getProductsByBrand(brandId);
		return res.status(200).json(new ResOk().formatResponse(products));
	} catch (error) {
		next(error);
	}
};

// Tìm sản phẩm theo category
export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { categoryId } = req.params;
		const products = await productService.getProductsByCategory(categoryId);
		return res.status(200).json(new ResOk().formatResponse(products));
	} catch (error) {
		next(error);
	}
};

// Tìm sản phẩm theo khoảng giá
export const getProductsByPriceRange = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { min, max } = req.query;
		const products = await productService.getProductsByPriceRange(
			parseFloat(min as string),
			parseFloat(max as string)
		);
		return res.status(200).json(new ResOk().formatResponse(products));
	} catch (error) {
		next(error);
	}
};

// Tìm sản phẩm nâng cao (nhiều điều kiện)
export const filterProducts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const products = await productService.filterProducts(req.query);
		return res.status(200).json(new ResOk().formatResponse(products));
	} catch (error) {
		next(error);
	}
};
