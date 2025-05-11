import { db } from "../../loaders/database.loader"
import { Transaction } from "sequelize";

export const createReview = async (customerId: number, data: any, transaction?: Transaction) => {
    const review = {
        ...data,
        customerId,
    };
    return await db.reviews.create(review, {transaction});
};

export const getAllReviews = async (transaction?: Transaction) => {
  return await db.reviews.findAll({transaction});
};

export const getReviewsByProduct = async (productId: number, transaction?: Transaction) => {
  return await db.reviews.findAll({ where: { productId } , transaction});
};

export const updateReview = async (id: number, data: any, transaction?: Transaction) => {
  const review = await db.reviews.findByPk(id, {transaction});
  if (!review) throw new Error('Review not found');
  return await review.update(data, transaction);
};

export const deleteReview = async (id: number, transaction?: Transaction) => {
  const review = await db.reviews.findByPk(id, {transaction});
  if (!review) throw new Error('Review not found');
  return await review.destroy({transaction});
};
