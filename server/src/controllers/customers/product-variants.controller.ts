import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as variantService from '../../services/customers/product-variants.service';

export const getVariants = async (req: Request, res: Response, next: NextFunction) => {
try {
    const {
      id = '',
      brandId = '',
      categoryId = '',
      min = 0,
      max,
      stock = 0,
      include = '',
      page = 1, // Mặc định trang 1
      limit = 20 // Mặc định số sản phẩm trên mỗi trang là 20
    } = req.query;

    // Tính toán phạm vi phân trang
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const pageLimit = parseInt(limit as string);

    const filters = {
      id: id ? Number(id) : undefined,
      brandId: brandId ? Number(brandId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      priceRange: {
        min: parseFloat(min as string),
        max: max ? parseFloat(max as string) : Number.MAX_SAFE_INTEGER  
      },
      stock: stock ? Number(stock) : undefined,
      include: (include as string)?.split(','),
      offset,
      limit: pageLimit
    };

    const products = await variantService.getVariants(filters);
    return res.status(200).json(new ResOk().formatResponse(products));
  } catch (error) {
    next(error);
  }
};
