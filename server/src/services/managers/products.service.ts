import { Transaction } from 'sequelize';
import { db } from '../../loaders/database.loader';

export const createProduct = async (data: any, transaction?: Transaction) => {
	const newProduct = await db.products.create(
		{
			...data,
			categoryId: parseInt(data.categoryId, 10),
			brandId: parseInt(data.brandId, 10),
			slug:
				data.slug ||
				data.name
					.toLowerCase()
					.replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
					.replace(/[^a-z0-9-]/g, '') // Loại bỏ ký tự đặc biệt (chỉ giữ a-z, 0-9 và -)
					.replace(/-+/g, '-') // Gộp nhiều dấu "-" liên tiếp thành một
					.replace(/^-+|-+$/g, ''),
		},
		{ transaction },
	);

	// Tạo biến thể sản phẩm mặc định
	const variantData = {
		productId: newProduct.id, // Liên kết biến thể với sản phẩm mới tạo
		name: 'DEFAULT-' + newProduct.name,
		slug: 'default-' + newProduct.slug, // Sử dụng slug của sản phẩm làm phần của slug biến thể
		sku: 'default-' + newProduct.id, // SKU mặc định
		price: data.basePrice || 0, // Lấy giá của sản phẩm làm giá của biến thể
		discountPrice: 0, // Nếu không có giá giảm, để null
		stock: 0,
	};

	const newVariant = await db.productVariants.create(variantData, {
		transaction,
	});

	return { newProduct, newVariant };
};

// Cập nhật sản phẩm
export const updateProduct = async (
	id: number,
	data: any,
	transaction?: Transaction,
) => {
	const product = await db.products.findByPk(id, { transaction });
	if (!product) return null;

	const slug =
		data.slug ||
		data.name
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '')
			.replace(/-+/g, '-')
			.replace(/^-+|-+$/g, '');
	// Cập nhật thông tin sản phẩm
	await product.update({ ...data, slug }, { transaction });
	return product;
};

export const deleteProduct = async (id: string, transaction?: Transaction) => {
	return db.products.destroy({ where: { id }, transaction });
};
