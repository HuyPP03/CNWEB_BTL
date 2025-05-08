import { db } from '../../loaders/database.loader';

export const attributeValueService = {
  async getValue(attributeTypeId?: number) {
    const where = attributeTypeId ? { attributeTypeId } : {};
    return db.attributeValues.findAll({ where });
  },

  async createValue(data: any, transaction?: any) {
    return db.attributeValues.bulkCreate(data, {transaction});
  },

  async updateValue(id: number, data: Partial<{ value: string }>) {
    return db.attributeValues.update(data, { where: { id } });
  },

  async deleteValue(id: number) {
    return db.attributeValues.destroy({ where: { id } });
  },
};
