import {db} from '../../loaders/database.loader';
import { Transaction } from 'sequelize';

export const getShippings = async (orderId: string, transaction?: Transaction) => {
  const shippings = await db.shipping.findAll({
    where: {
      orderId: orderId,
    },
    transaction
  });
  return shippings;
}

export const createShipping = async (shipping: any, transaction?: Transaction) => {
  const newShipping = await db.shipping.create(shipping, {transaction});
  return newShipping;
}

export const updateShipping = async (shippingId: string, shipping: any, transaction?: Transaction) => {
  const updatedShipping = await db.shipping.update(shipping, {
    where: {
      id: shippingId,
    },
    transaction
  });
  return updatedShipping;
}

export const deleteShipping = async (shippingId: string, transaction?: Transaction) => {
  const deletedShipping = await db.shipping.destroy({
    where: {
      id: shippingId,
    },
    transaction
  });
  return deletedShipping;
}
