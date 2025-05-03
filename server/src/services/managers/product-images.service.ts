import { db } from '../../loaders/database.loader';
import { Transaction } from 'sequelize';
import { upload } from '../../utility/media.util';

export const uploadProductImage = async (req: any, res: any) => {
    upload.single('image')(req, res, async (err: any) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const { productId } = req.params;
        const imageUrl = req.file?.path; // Kiểm tra null cho trường hợp không có file

        if (!imageUrl) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        try {
            // Tạo mới ảnh cho sản phẩm, mặc định ảnh này không phải ảnh chính
            const productImage = await db.productImages.create({
                productId,
                imageUrl,
                isPrimary: false, // Đặt mặc định isPrimary là false
            });

            return res.status(201).json(productImage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error saving product image to database' });
        }
    });
};

export const getProductImages = async (productId: string) => {
    try {
        // Lấy tất cả các ảnh của sản phẩm
        return await db.productImages.findAll({ where: { productId } });
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching product images');
    }
};

export const deleteProductImage = async (id: string, transaction?: Transaction) => {
    try {
        // Kiểm tra xem ảnh có tồn tại không trước khi xóa
        const productImage = await db.productImages.findByPk(id, { transaction });
        if (!productImage) {
            throw new Error('Product image not found');
        }

        await productImage.destroy({ transaction });
        return productImage;
    } catch (error) {
        console.error(error);
        throw new Error('Error deleting product image');
    }
};

// Service để cập nhật ảnh chính cho sản phẩm
export const setPrimaryImage = async (productId: string, imageId: string, transaction?: Transaction) => {
    try {
        // Đặt tất cả các ảnh của sản phẩm thành không phải ảnh chính
        await db.productImages.update(
            { isPrimary: false },
            { where: { productId }, transaction }
        );

        // Cập nhật ảnh với id được chọn thành ảnh chính
        const updatedImage = await db.productImages.update(
            { isPrimary: true },
            { where: { id: imageId, productId }, returning: true, transaction }
        );

        if (updatedImage[0] === 0) {
            throw new Error('Image not found or update failed');
        }

        return updatedImage[1][0]; // Trả về ảnh đã được cập nhật
    } catch (error) {
        console.error(error);
        throw new Error('Error updating primary image');
    }
};
