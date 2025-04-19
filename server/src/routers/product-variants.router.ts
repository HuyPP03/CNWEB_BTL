import express from 'express';
import * as variantsManagers from "../controllers/managers/product-variants.controller";
import * as variantsCustomers from "../controllers/customers/product-variants.controller";

const router = express.Router();

// Router cho managers (Quản lý biến thể sản phẩm)
router.get('/managers/', variantsManagers.getAllVariants);            // Lấy tất cả biến thể sản phẩm
router.get('/managers/:id', variantsManagers.getVariantById);         // Lấy biến thể sản phẩm theo ID
router.post('/managers/', variantsManagers.createVariant);            // Tạo biến thể sản phẩm mới
router.put('/managers/:id', variantsManagers.updateVariant);          // Cập nhật biến thể sản phẩm
router.delete('/managers/:id', variantsManagers.deleteVariant);       // Xoá biến thể sản phẩm
router.post('/managers/attributes', variantsManagers.addVariantAttributes); // Thêm thuộc tính cho biến thể sản phẩm
router.put('/managers/attributes/:id', variantsManagers.addVariantAttributes); // Thêm thuộc tính cho biến thể sản phẩm

// Router cho customers (Khách hàng tìm kiếm biến thể sản phẩm)
router.get('/customers', variantsCustomers.getAllVariants);          // Lấy tất cả biến thể sản phẩm
router.get('/customers/:id', variantsCustomers.getVariantById);      // Lấy biến thể sản phẩm theo ID
router.get('/customers/search/name/:name', variantsCustomers.getVariantsByName); // Tìm biến thể theo tên
router.get('/customers/search/product/:productId', variantsCustomers.getVariantsByProductId); // Tìm biến thể theo productId
router.get('/customers/search/brand/:brandId', variantsCustomers.getVariantsByBrand); // Tìm biến thể theo brand
router.get('/customers/search/category/:categoryId', variantsCustomers.getVariantsByCategory); // Tìm biến thể theo category
router.get('/customers/search/price', variantsCustomers.getVariantsByPriceRange); // Tìm biến thể theo khoảng giá
router.get('/customers/filter', variantsCustomers.filterVariants);   // Tìm biến thể sản phẩm nâng cao với nhiều điều kiện

export default router;
