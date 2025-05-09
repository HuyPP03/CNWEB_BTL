import { db } from '../../loaders/database.loader';
import { Transaction } from 'sequelize';
import fs from 'fs';
import path from 'path';

export const createProductImages = async (files: any, productId: number, transaction?: Transaction) => {
    try {
       const fileCreates = files.map((file: any, indx: number) => {
            const relativePath = path.relative(path.resolve('./'), file.path).replace(/\\/g, '/');
            return ({
                productId,
                imageUrl: relativePath,
                isPrimary: indx === 0,
            });
       })
        return await db.productImages.bulkCreate(fileCreates, { returning: true, 
            transaction
          });
    } catch (error) {
        throw new Error('Error creating product images');
    }
}

export const uploadProductImage = async (req: any, res: any, transaction?: Transaction) => {
        const { productId } = req.params;
        const fullPath = req.file?.path;

        if (!fullPath) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        // Tạo folder chứa ảnh
        const relativePath = path.relative(path.resolve('./'), fullPath).replace(/\\/g, '/');

        try {
            const productImage = await db.productImages.create({
                productId,
                imageUrl: relativePath,
                isPrimary: false,
            }, { transaction });

            return res.status(201).json(productImage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error saving product image to database' });
        }
};

export const getProductImages = async (productId: number, transaction?: Transaction) => {
    try {
        return await db.productImages.findAll({ where: { productId } , transaction});
    } catch (error) {
        console.error('Error fetching images:', error);
        throw new Error('Error fetching product images');
    }
};

export const deleteProductImage = async (id: number, transaction?: Transaction) => {
    try {
        const productImage = await db.productImages.findByPk(id, { transaction });    
        if (!productImage) return null;

        // Lưu đường dẫn file trước khi xóa DB
        const imagePath = path.resolve(productImage.imageUrl); // Chuyển relative path thành absolute path

        await productImage.destroy({ transaction });    

        // Xóa file vật lý khỏi ổ đĩa
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting file from uploads folder:', err.message);
            } else {    
                console.log('Image file deleted from uploads folder:', imagePath);
            }
        });

        return productImage;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('Error deleting product image');
    }
};


export const setPrimaryImage = async (productId: number, imageId: number, transaction?: Transaction) => {
    try {
        await db.productImages.update(
            { isPrimary: false },
            { where: { productId }, transaction }
        );

        const [count, updated] = await db.productImages.update(
            { isPrimary: true },
            { where: { id: imageId, productId }, returning: true, transaction }
        );

        if (count === 0) {
            throw new Error('Image not found or update failed');
        }

        return updated[0];
    } catch (error) {
        console.error('Error updating primary image:', error);
        throw new Error('Error updating primary image');
    }
};
