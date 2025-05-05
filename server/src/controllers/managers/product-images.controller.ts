import { Request, Response } from 'express';
import * as imageService from '../../services/managers/product-images.service';

export const uploadProductImageController = async (req: Request, res: Response) => {
    try {
        await imageService.uploadProductImage(req, res); // Gọi trực tiếp service xử lý upload
    } catch (error) {
        console.error('Error in uploadProductImageController:', error);
        return res.status(500).json({ error: 'Internal server error while uploading product image' });
    }
};

export const getProductImagesController = async (req: Request, res: Response) => {
    const { productId } = req.params;
    try {
        const images = await imageService.getProductImages(productId);
        if (!images || images.length === 0) {
            return res.status(404).json({ message: 'No images found for this product' });
        }
        return res.status(200).json(images);
    } catch (error) {
        console.error('Error in getProductImagesController:', error);
        return res.status(500).json({ error: 'Error fetching product images' });
    }
};

export const deleteProductImageController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedImage = await imageService.deleteProductImage(id);
        if (!deletedImage) {
            return res.status(404).json({ message: 'Product image not found' });
        }
        return res.status(200).json({ message: 'Product image deleted successfully', deletedImage });
    } catch (error) {
        console.error('Error in deleteProductImageController:', error);
        return res.status(500).json({ error: 'Error deleting product image' });
    }
};

export const setPrimaryImageController = async (req: Request, res: Response) => {
    const { productId, imageId } = req.params;
    try {
        const updatedImage = await imageService.setPrimaryImage(productId, imageId);
        return res.status(200).json({ message: 'Primary image updated successfully', updatedImage });
    } catch (error) {
        console.error('Error in setPrimaryImageController:', error);
        return res.status(500).json({ error: 'Error updating primary image' });
    }
};
