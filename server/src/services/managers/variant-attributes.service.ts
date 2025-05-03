import { db } from '../../loaders/database.loader';

export const variantAttributeService = {
  async getAttribute(variantId?: number) {
    const where = variantId ? { variantId } : {};
    return db.variantAttributes.findAll({ where });
  },

  async createAttribute(data: Array<{
    productId: number;
    variantId: number;
    attributeTypeId: number;
    attributeValueId: number;
    name?: string;
  }>) {
    return db.variantAttributes.bulkCreate(data);
  },

  async updateAttribute(id: number, data: Partial<{
    attributeTypeId: number;
    attributeValueId: number;
    name: string;
  }>) {
    return db.variantAttributes.update(data, { where: { id } });
  },

  async deleteAttribute(id: number) {
    return db.variantAttributes.destroy({ where: { id } });
  },
};
