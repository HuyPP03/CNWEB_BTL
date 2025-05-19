import { Op, Transaction } from 'sequelize';
import { db } from '../../loaders/database.loader';
import { variantAttributeService } from '../../services/managers/variant-attributes.service';
import { attributeValueService } from '../../services/managers/attribute-values.service';

// Tạo biến thể sản phẩm mới
export const createVariant = (data: any, transaction?: Transaction) => {
	const variant = {
		productId: data.productId,
		name: data.name,
		slug: data.name.toLowerCase().replace(/\s+/g, '-'),
		sku: data.name.toLowerCase().replace(/\s+/g, '-'),
		price: data.price,
		discountPrice: data.discountPrice,
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
			{
				model: db.productImages,
			},
		],
		transaction,
	});
	if (!variant) return null;
	const updateData = {
		name: data.name,
		slug: data.name.toLowerCase().replace(/\s+/g, '-'),
		sku: data.name.toLowerCase().replace(/\s+/g, '-'),
		price: data.price,
		discountPrice: data.discountPrice,
		stock: data.stock,
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
		await variantAttributeService.createAttribute(
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
	attributes: VariantAttributeInput[],
	transaction?: Transaction,
) => {
	// 1. Tìm variantAttribute cần cập nhật
	const existingAttributes = await db.variantAttributes.findAll({
		where: { variantId: id },
		transaction,
	});

	const existingAttributeTypeIds = existingAttributes.map(
		(attr) => attr.attributeTypeId,
	);

	// 2. Lọc ra các attributeTypeId chưa có
	const missingAttributes = attributes.filter(
		(attr) => !existingAttributeTypeIds.includes(attr.attributeTypeId),
	);

	// if (missingAttributes.length === 0) return;

	// 3. Kiểm tra value nào đã tồn tại, value nào chưa
	const valuesToCheck = missingAttributes.map(
		({ attributeTypeId, value }) => ({
			attributeTypeId,
			value,
		}),
	);

	const existingValues = await db.attributeValues.findAll({
		where: {
			[Op.or]: valuesToCheck,
		},
		transaction,
	});
	const existingValueMap = new Map(
		existingValues.map((v) => [`${v.attributeTypeId}-${v.value}`, v]),
	);

	const toCreateValues: { attributeTypeId: number; value: string }[] = [];

	for (const attr of missingAttributes) {
		const key = `${attr.attributeTypeId}-${attr.value}`;
		if (!existingValueMap.has(key)) {
			toCreateValues.push({
				attributeTypeId: attr.attributeTypeId,
				value: attr.value,
			});
		}
	}

	// 4. Tạo các attributeValue chưa có
	const createdValues = toCreateValues.length
		? await attributeValueService.createValue(toCreateValues, transaction)
		: [];

	// 5. Kết hợp lại map giá trị
	for (const created of createdValues) {
		const key = `${created.attributeTypeId}-${created.value}`;
		existingValueMap.set(key, created);
	}

	// 6. Tạo variantAttributes mới cho những attributeTypeId chưa có
	const variantAttributesToCreate = missingAttributes.map((attr) => {
		const key = `${attr.attributeTypeId}-${attr.value}`;
		const attributeValue = existingValueMap.get(key);

		return {
			variantId: id,
			attributeTypeId: attr.attributeTypeId,
			attributeValueId: (attributeValue as any).id,
			name: attr.value,
		};
	});
	await db.variantAttributes.bulkCreate(variantAttributesToCreate, {
		transaction,
	});
};

// Xóa thuộc tính cho biến thể sản phẩm
export const deleteAttribute = async (
	id: number,
	transaction?: Transaction,
) => {
	return db.variantAttributes.destroy({ where: { id }, transaction });
};
