import { Transaction } from 'sequelize';
import { db } from '../../loaders/database.loader';

// Lấy tất cả biến thể sản phẩm
export const getAllVariants = () => db.productVariants.findAll();

// Lấy biến thể sản phẩm theo ID
export const getVariantById = (id: string) => db.productVariants.findByPk(id);

// Tạo biến thể sản phẩm mới
export const createVariant = (data: any, transaction?: Transaction) => {
    return db.productVariants.create(data, { transaction });
};

// Cập nhật biến thể sản phẩm
export const updateVariant = async (
    id: string,
    data: any,
    transaction?: Transaction
) => {
    const variant = await db.productVariants.findByPk(id, { transaction });
    if (!variant) return null;

    await variant.update(data, { transaction });
    return variant;
};

// Xóa biến thể sản phẩm
export const deleteVariant = async (
    id: string,
    transaction?: Transaction
) => {
    return db.productVariants.destroy({ where: { id }, transaction });
};

export const addVariantAttributes = (data: any, transaction?: Transaction) => {
    return db.variantAttributes.create(data, { transaction });
}

export const updateAttribute = async (
    id: number,
    data: any,
    transaction?: Transaction
) => {
    const attr = await db.variantAttributes.findByPk(id);
    if (!attr) {
        throw new Error(`Attribute with id ${id} not found`);
    }
    return attr.update(data, { transaction });
};