import { db } from '../../loaders/database.loader';

export const getAllProducts = () => db.products.findAll();
export const getProductById = (id: string) => db.products.findByPk(id);
export const createProduct = (data: any) => db.products.create(data);
export const updateProduct = async (id: string, data: any) => {
    const product = await db.products.findByPk(id);
    if (!product) return null;
    await product.update(data);
    return product;
};
export const deleteProduct = (id: string) =>
    db.products.destroy({ where: { id } });
