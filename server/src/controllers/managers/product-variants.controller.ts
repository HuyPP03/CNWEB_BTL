import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as variantService from '../../services/managers/product-variants.service';
import { variantAttributeService } from '../../services/managers/variant-attributes.service';
import { attributeValueService } from '../../services/managers/attribute-values.service';
import * as productImageService from '../../services/managers/product-images.service';

import { db } from '../../loaders/database.loader';
import * as adminLogService from '../../services/managers/admin-logs.service';
import { Admins } from '../../models/admins.model';

// Tạo biến thể mới cho sản phẩm
export const createVariant = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const files = req.files as Express.Multer.File[];
		const newVariant = await variantService.createVariant(
			req.body,
			transaction,
		);

		const images = await productImageService.createProductImages(
			files,
			newVariant.productId,
			newVariant.id,
			transaction,
		);

		const parseAttributes = (body: any) => {
			const attributes: any[] = [];
			let i = 0;

			while (body[`attributes[${i}].attributeTypeId`] !== undefined) {
				attributes.push({
					attributeTypeId: Number(
						body[`attributes[${i}].attributeTypeId`],
					),
					value: body[`attributes[${i}].value`],
				});
				i++;
			}

			return attributes;
		};

		// Trong controller:
		const attributes = parseAttributes(req.body);

		// Gọi service:
		await variantService.addVariantAttributes(
			newVariant.id,
			attributes,
			transaction,
		);

		const fullVariant = await db.productVariants.findByPk(newVariant.id, {
			include: [
				{
					model: db.variantAttributes,
					include: [{ model: db.attributeValues }],
				},
				{ model: db.productImages },
				{ model: db.products },
			],
			transaction,
		});

		// Ghi adminlog
		await adminLogService.CreateAdminLog(
			(req.user as Admins).id,
			'Create',
			newVariant.id,
			'Variant',
			req.body,
			transaction,
		);

		await transaction.commit();
		return res
			.status(201)
			.json(new ResOk().formatResponse({ fullVariant, images }));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

// Cập nhật biến thể sản phẩm
export const updateVariant = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const updatedVariant = await variantService.updateVariant(
			req.params.id,
			req.body,
			transaction,
		);
		if (!updatedVariant) {
			await transaction.rollback();
			return res.status(404).json({ message: 'Variant not found' });
		}

		const files = req.files as Express.Multer.File[];

		await productImageService.createProductImages(
			files,
			updatedVariant.productId,
			updatedVariant.id,
			transaction,
		);

		const parseAttributes = (body: any) => {
			const attributes: any[] = [];
			let i = 0;

			while (body[`attributes[${i}].attributeTypeId`] !== undefined) {
				attributes.push({
					attributeTypeId: Number(
						body[`attributes[${i}].attributeTypeId`],
					),
					value: body[`attributes[${i}].value`],
				});
				i++;
			}

			return attributes;
		};

		const attributes = parseAttributes(req.body);

		for (const attribute of attributes) {
			await variantService.updateAttribute(
				parseInt(req.params.id),
				attribute.attributeTypeId,
				attribute.value,
				transaction,
			);
		}

		// Ghi adminlog
		await adminLogService.CreateAdminLog(
			(req.user as Admins).id,
			'Update',
			updatedVariant.id,
			'Variant',
			req.body,
			transaction,
		);

		await transaction.commit();
		return res.status(200).json(new ResOk().formatResponse(updatedVariant));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

// Xoá biến thể sản phẩm
export const deleteVariant = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		// Xóa các ảnh
		const variantId = parseInt(req.params.id);
		const productImages = await db.productImages.findAll({
			where: { variantId },
			transaction,
		});

		for (const image of productImages) {
			await productImageService.deleteProductImage(image.id, transaction);
		}

		// Xóa sản phẩm
		const deletedCount = await variantService.deleteVariant(
			req.params.id,
			transaction,
		);
		if (!deletedCount) {
			await transaction.rollback();
			return res.status(404).json({ message: 'Variant not found' });
		}

		// Ghi adminlog
		await adminLogService.CreateAdminLog(
			(req.user as Admins).id,
			'Delete',
			variantId,
			'Variant',
			req.body,
			transaction,
		);

		await transaction.commit();
		return res
			.status(200)
			.json(
				new ResOk().formatResponse({ message: 'Deleted successfully' }),
			);
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
				variantAttributeService.getAttribute(
					variantId ? Number(variantId) : undefined,
				),
				attributeValueService.getValue(
					attributeTypeId ? Number(attributeTypeId) : undefined,
				),
			]);
			res.json({ attributes, values });
		} catch (error) {
			res.status(500).json({
				error: 'Failed to fetch attributes and values.',
			});
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
			res.status(201).json({
				attributes: createdAttributes,
				values: createdValues,
			});
		} catch (error) {
			res.status(500).json({
				error: 'Failed to create attributes and values.',
			});
		}
	},

	// PUT: /attributes/:id
	async updateAttribute(req: Request, res: Response) {
		const { id } = req.params;
		const { attributeData, valueData } = req.body;

		try {
			const [attrResult, valResult] = await Promise.all([
				attributeData
					? variantAttributeService.updateAttribute(
							Number(id),
							attributeData,
					  )
					: Promise.resolve(null),
				valueData
					? attributeValueService.updateValue(Number(id), valueData)
					: Promise.resolve(null),
			]);
			res.json({ updatedAttribute: attrResult, updatedValue: valResult });
		} catch (error) {
			res.status(500).json({
				error: 'Failed to update attribute or value.',
			});
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
			res.json({
				attributeDeleted: attrDeleted,
				valueDeleted: valDeleted,
			});
		} catch (error) {
			res.status(500).json({
				error: 'Failed to delete attribute or value.',
			});
		}
	},
};
