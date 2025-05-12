import { Op, Transaction } from 'sequelize';
import { db } from '../../loaders/database.loader';
import { variantAttributeService } from '../../services/managers/variant-attributes.service';
import { attributeValueService } from '../../services/managers/attribute-values.service';

// Tạo biến thể sản phẩm mới
export const createVariant = (data: any, transaction?: Transaction) => {
	const variant = {
		productId: data.productId,
		slug: data.name,
		sku: data.name,
		price: data.price,
		stock: data.stock,
	};
	return db.productVariants.create(variant, { transaction });
};

// Cập nhật biến thể sản phẩm
export const updateVariant = async (
	id: string,
	data: any,
	transaction?: Transaction,
) => {
	const variant = await db.productVariants.findByPk(id, {
		include: [
			{
				model: db.variantAttributes,
				include: [
					{
						model: db.attributeTypes,
					},
					{
						model: db.attributeValues,
					},
				],
			},
		],
		transaction,
	});
	if (!variant) return null;
	const updateData = {
		slug: data.name,
		sku: data.name,
		price: data.price,
		stock: data.sock,
	};
	await variant.update(updateData, { transaction });
	return variant;
};

// Xóa biến thể sản phẩm
export const deleteVariant = async (id: string, transaction?: Transaction) => {
	// Bắt đầu xóa các thuộc tính của biến thể
	await db.variantAttributes.destroy({
		where: { variantId: id },
		transaction,
	});

	// Sau khi xóa thuộc tính, xóa biến thể
	return db.productVariants.destroy({
		where: { id },
		transaction,
	});
};

interface VariantAttributeInput {
	attributeTypeId: number;
	value: string;
}

// Thêm thuộc tính cho biến thể sản phẩm
export const addVariantAttributes = async (
	variantId: number,
	attributes: VariantAttributeInput[],
	transaction?: Transaction,
) => {
	// Kiểm tra xem attribute value đã tồn tại chưa
	const variant = await db.productVariants.findOne({
		where: { id: variantId },
		include: [{ model: db.products }],
		transaction,
	});

	if (!variant) throw new Error('Variant not found');

	const createdVariantAttributes = [];

	for (const attribute of attributes) {
		const { attributeTypeId, value } = attribute;

		// Tìm hoặc tạo attributeValue
		let attributeValue = await db.attributeValues.findOne({
			where: {
				attributeTypeId,
				value,
			},
			transaction,
		});

		if (!attributeValue) {
			const [created] = await attributeValueService.createValue(
				[
					{
						attributeTypeId,
						value,
					},
				],
				transaction,
			);
			attributeValue = created;
		}

		// Lấy attributeType để lấy tên
		const attributeType = await db.attributeTypes.findByPk(
			attributeTypeId,
			{
				transaction,
			},
		);

		// Tạo variantAttribute
		const variantAttr = await variantAttributeService.createAttribute(
			[
				{
					productId: variant.productId,
					variantId: variant.id,
					attributeTypeId,
					attributeValueId: attributeValue.id,
					name: attributeType?.name || '',
				},
			],
			transaction,
		);

		createdVariantAttributes.push(variantAttr);
	}

	// Trả về toàn bộ variant attributes của variant
	return db.variantAttributes.findAll({
		where: { variantId },
		include: [
			{
				model: db.attributeValues,
				required: true,
			},
		],
		transaction,
	});
};

// Sửa thuộc tính cho biến thể sản phẩm
export const updateAttribute = async (
	id: number,
	attributeTypeId: number,
	value: string,
	transaction?: Transaction,
) => {
	// 1. Tìm variantAttribute cần cập nhật
	const attr = await db.variantAttributes.findOne({
		where: {
			variantId: id,
			attributeTypeId: attributeTypeId,
		},
		include: [{ model: db.attributeValues }],
		transaction,
	});
	if (!attr) {
		throw new Error(`variant with id ${id} not found`);
	}
	// 2. Tìm attributeValue theo attributeTypeId và value
	let attributeValue = await db.attributeValues.findOne({
		where: {
			attributeTypeId,
			value,
		},
		transaction,
	});

	// 3. Nếu chưa có thì tạo mới
	if (!attributeValue) {
		const [created] = await attributeValueService.createValue(
			[{ attributeTypeId, value }],
			transaction,
		);
		attributeValue = created;
	}

	// 4. Cập nhật variantAttribute với attributeValueId mới
	await attr.update(
		{
			attributeValueId: attributeValue.id,
			name: value,
		},
		{ transaction },
	);
};

// Xóa thuộc tính cho biến thể sản phẩm
export const deleteAttribute = async (
	id: number,
	transaction?: Transaction,
) => {
	return db.variantAttributes.destroy({ where: { id }, transaction });
};
