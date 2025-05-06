import express from 'express';
import * as variantsManagers from "../controllers/managers/product-variants.controller";
import * as variantsCustomers from "../controllers/customers/product-variants.controller";

const router = express.Router();

// Router cho managers (Quản lý biến thể sản phẩm)
router.post('/', variantsManagers.createVariant);            // Tạo biến thể sản phẩm mới
router.put('/:id', variantsManagers.updateVariant);          // Cập nhật biến thể sản phẩm
router.delete('/:id', variantsManagers.deleteVariant);       // Xoá biến thể sản phẩm

// Router cho managers (Quản lý thuộc tính biến thể sản phẩm)
router.post('/attributes', variantsManagers.attributeController.createAttributes); // Thêm thuộc tính cho biến thể sản phẩm
router.put('/attributes/:id', variantsManagers.attributeController.updateAttribute); // Thay đổi thuộc tính cho biến thể sản phẩm
router.delete('/attributes/:id', variantsManagers.attributeController.deleteAttribute); // Xóa thuộc tính cho biến thể sản phẩm

// Router cho customers (Khách hàng tìm kiếm biến thể sản phẩm)
router.get('/', variantsCustomers.getVariants);   // Tìm biến thể sản phẩm 

export default router;
