import { db } from '../../loaders/database.loader';
import { Transaction } from 'sequelize';

export const getPromotion = (id: string) => db.productPromotions.findByPk(id);

export const createProductPromotion = (data: any, transaction?: Transaction) => {
    return db.productPromotions.create(data, { transaction });
};
export const updateProductPromotion = async (
    id: string,
    data: any,
    transaction?: Transaction
) => {
    const productPromotion = await db.productPromotions.findByPk(id, { transaction });
    if (!productPromotion) return null;

    await productPromotion.update(data, { transaction });
    return productPromotion;
}

export const deleteProductPromotion = async (
    id: string,
    transaction?: Transaction
) => {
    return db.productPromotions.destroy({ where: { promotionId: id }, transaction }
    );
};

