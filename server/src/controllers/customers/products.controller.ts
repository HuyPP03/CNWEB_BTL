import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as productService from '../../services/customers/products.service';

// Lấy sản phẩm
export const filterProducts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			name = '',
			brandId = '',
			categoryId = '',
			min = 0,
			max,
			include = ''
		} = req.query;

		const filters = {
			name: name as string,
			brandId: brandId as string,
			categoryId: categoryId as string,
			priceRange: {
				min: parseFloat(min as string),
				max: max ? parseFloat(max as string) : Number.MAX_SAFE_INTEGER  
			},
			include: (include as string)?.split(',') 
		};

		const products = await productService.filterProducts(filters);
		return res.status(200).json(new ResOk().formatResponse(products));
	} catch (error) {
		next(error);
	}
};
