import { Request, Response } from 'express';
import { Products } from '../models/products.model'; 

// Lấy tất cả sản phẩm
export const getAllProducts = async (_: Request, res: Response) => {
	try {
		const products = await Products.findAll();
		res.json(products);
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Lấy sản phẩm theo id
export const getProductById = async (req: Request, res: Response) => {
	try {
		const product = await Products.findByPk(req.params.id);
		if (!product) return res.status(404).json({ message: 'Not found' });
		res.json(product);
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Tạo sản phẩm mới
export const createProduct = async (req: Request, res: Response) => {
	try {
		const newProduct = await Products.create(req.body);
		res.status(201).json(newProduct);
	} catch (error) {
		res.status(400).json({ message: 'Invalid data', error });
	}
};

// Cập nhật sản phẩm
export const updateProduct = async (req: Request, res: Response) => {
	try {
		const product = await Products.findByPk(req.params.id);
		if (!product) return res.status(404).json({ message: 'Not found' });

		await product.update(req.body);
		res.json(product);
	} catch (error) {
		res.status(400).json({ message: 'Invalid update data', error });
	}
};

// Xoá sản phẩm
export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const deleted = await Products.destroy({ where: { id: req.params.id } });
		if (!deleted) return res.status(404).json({ message: 'Not found' });
		res.json({ message: 'Deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};
