import {db} from '../../loaders/database.loader';

export const createOrderItem = (orderItemData: any) => db.orderItems.bulkCreate(orderItemData);

export const deleteOrderById = (id: string) => db.orderItems.destroy({ where: { id } });
