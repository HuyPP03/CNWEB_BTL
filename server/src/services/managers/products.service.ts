import { Transaction } from 'sequelize';
import { db } from '../../loaders/database.loader';

export const getAllProducts = () => db.products.findAll();

export const getProductById = (id: string) => db.products.findByPk(id);

export const createProduct = (data: any, transaction?: Transaction) => {
    return db.products.create(data, { transaction });
};

export const updateProduct = async (
    id: string,
    data: any,
    transaction?: Transaction
) => {
    const product = await db.products.findByPk(id, { transaction });
    if (!product) return null;

    await product.update(data, { transaction });
    return product;
};

export const deleteProduct = async (
    id: string,
    transaction?: Transaction
) => {
    return db.products.destroy({ where: { id }, transaction });
};
