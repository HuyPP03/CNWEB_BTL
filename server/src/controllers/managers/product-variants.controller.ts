import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as variantService from '../../services/managers/product-variants.service'; 
import { variantAttributeService } from '../../services/managers/variant-attributes.service';
import { attributeValueService } from '../../services/managers/attribute-values.service';

import { db } from '../../loaders/database.loader';
import * as adminLogService from '../../services/managers/admin-logs.service'; 
import { Admins } from 'src/models/admins.model';

// Tạo biến thể mới cho sản phẩm
export const createVariant = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const newVariant = await variantService.createVariant(req.body, transaction);

        if (req.body.attributes && req.body.attributes.length > 0) {
          for (let attribute of req.body.attributes) {
              // Gọi service để thêm thuộc tính cho biến thể
              await variantService.addVariantAttributes({
                  variantId: newVariant.id,
                  ...attribute
              }, transaction);
          }
        }

        const fullVariant = await db.productVariants.findByPk(newVariant.id, {
          include: [
            { model: db.variantAttributes, include: [{ model: db.attributeValues }] },
            { model: db.productImages },
            { model: db.products }
          ],
          transaction
        });

        // await adminLogService.CreateAdminLog(
        //     (req.user as Admins).id,
        //     'Create',
        //     newVariant.id,
        //     'Variant',
        //     req.body,
        //     transaction
        // );

        await transaction.commit();
        return res.status(201).json(new ResOk().formatResponse(fullVariant));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Cập nhật biến thể sản phẩm
export const updateVariant = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const updatedVariant = await variantService.updateVariant(req.params.id, req.body, transaction);
        if (!updatedVariant) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Variant not found' });
        }

        if (req.body.attributes && req.body.attributes.length > 0) {
          // Xóa các thuộc tính cũ nếu có
          await variantService.deleteAttribute(updatedVariant.id, transaction);
          
          // Thêm các thuộc tính mới
          for (let attribute of req.body.attributes) {
              await variantService.addVariantAttributes({
                  variantId: updatedVariant.id,
                  ...attribute
              }, transaction);
          }
      }
        // await adminLogService.CreateAdminLog(
        //     (req.user as Admins).id,
        //     'Delete',
        //     deletedVariant.id,
        //     'Variant',
        //     req.body,
        //     transaction
        // );

        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(updatedVariant));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Xoá biến thể sản phẩm
export const deleteVariant = async (req: Request, res: Response, next: NextFunction) => {
  const transaction = await db.sequelize.transaction();
  try {
      const deletedCount = await variantService.deleteVariant(req.params.id, transaction);
      if (!deletedCount) {
          await transaction.rollback();
          return res.status(404).json({ message: 'Variant not found' });
      }

      await transaction.commit();
      return res.status(200).json(new ResOk().formatResponse({ message: 'Deleted successfully' }));
  } catch (error) {
      await transaction.rollback();
      next(error);
  }
};

export const attributeController = {
    // GET: /attributes?variantId=...
    async getAttributes(req: Request, res: Response) {
      const { variantId, attributeTypeId } = req.query;
  
      try {
        const [attributes, values] = await Promise.all([
          variantAttributeService.getAttribute(variantId ? Number(variantId) : undefined),
          attributeValueService.getValue(attributeTypeId ? Number(attributeTypeId) : undefined),
        ]);
        res.json({ attributes, values });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch attributes and values.' });
      }
    },
  
    // POST: /attributes
    async createAttributes(req: Request, res: Response) {
      const { attributes, values } = req.body;
  
      try {
        const [createdAttributes, createdValues] = await Promise.all([
          variantAttributeService.createAttribute(attributes),
          attributeValueService.createValue(values),
        ]);
        res.status(201).json({ attributes: createdAttributes, values: createdValues });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create attributes and values.' });
      }
    },
  
    // PUT: /attributes/:id
    async updateAttribute(req: Request, res: Response) {
      const { id } = req.params;
      const { attributeData, valueData } = req.body;
  
      try {
        const [attrResult, valResult] = await Promise.all([
          attributeData ? variantAttributeService.updateAttribute(Number(id), attributeData) : Promise.resolve(null),
          valueData ? attributeValueService.updateValue(Number(id), valueData) : Promise.resolve(null),
        ]);
        res.json({ updatedAttribute: attrResult, updatedValue: valResult });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update attribute or value.' });
      }
    },
  
    // DELETE: /attributes/:id
    async deleteAttribute(req: Request, res: Response) {
      const { id } = req.params;
  
      try {
        const [attrDeleted, valDeleted] = await Promise.all([
          variantAttributeService.deleteAttribute(Number(id)),
          attributeValueService.deleteValue(Number(id)),
        ]);
        res.json({ attributeDeleted: attrDeleted, valueDeleted: valDeleted });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete attribute or value.' });
      }
    },
  };