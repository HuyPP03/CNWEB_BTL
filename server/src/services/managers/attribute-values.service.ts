import { db } from '../../loaders/database.loader';

export const attributeValueService = {
  async getValue(attributeTypeId?: number) {
    const where = attributeTypeId ? { attributeTypeId } : {};
    return db.attributeValues.findAll({ where });
  },

  async createValue(data: Array<{ attributeTypeId: number; value: string }>) {
    return db.attributeValues.bulkCreate(data);
  },

  async updateValue(id: number, data: Partial<{ value: string }>) {
    return db.attributeValues.update(data, { where: { id } });
  },

  async deleteValue(id: number) {
    return db.attributeValues.destroy({ where: { id } });
  },
};
