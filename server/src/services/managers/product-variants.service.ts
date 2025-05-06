import { Op , Transaction } from 'sequelize';
import { db } from '../../loaders/database.loader';

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
    // Bắt đầu xóa các thuộc tính của biến thể
    await db.variantAttributes.destroy({
        where: { variantId: id },
        transaction
    });

    // Sau khi xóa thuộc tính, xóa biến thể
    return db.productVariants.destroy({
        where: { id },
        transaction
    });
};

// Thêm thuộc tính cho biến thể sản phẩm
export const addVariantAttributes = (data: any, transaction?: Transaction) => {
    return db.variantAttributes.bulkCreate(data, { transaction });
}   

// Sửa thuộc tính cho biến thể sản phẩm
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

// Xóa thuộc tính cho biến thể sản phẩm
export const deleteAttribute = async (
    id: number,
    transaction?: Transaction
) => {
    return db.variantAttributes.destroy({ where: { id }, transaction });
}