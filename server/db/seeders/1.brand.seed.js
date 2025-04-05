'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			//delete all brands
			await queryInterface.bulkDelete('Brands', null, { transaction });

			await queryInterface.bulkInsert(
				'Brands',
				[
					{
						name: 'Apple',
						logoUrl: 'brands/apple.jpg',
						description:
							'Apple Inc. là công ty công nghệ đa quốc gia của Mỹ chuyên sản xuất thiết bị điện tử tiêu dùng, phần mềm máy tính và các dịch vụ trực tuyến.',
					},
					{
						name: 'Samsung',
						logoUrl: 'brands/samsung.png',
						description:
							'Samsung Group là một tập đoàn đa quốc gia của Hàn Quốc với nhiều lĩnh vực kinh doanh, trong đó điện tử tiêu dùng là một mảng quan trọng.',
					},
					{
						name: 'Imou',
						logoUrl: 'brands/imou.jpg',
						description:
							'Imou là thương hiệu chuyên sản xuất các thiết bị giám sát và an ninh thông minh.',
					},
					{
						name: 'Baseus',
						logoUrl: 'brands/baseus.png',
						description:
							'Baseus là thương hiệu chuyên về phụ kiện công nghệ cao cấp cho thiết bị di động và máy tính.',
					},
					{
						name: 'JBL',
						logoUrl: 'brands/jbl.jpg',
						description:
							'JBL là nhà sản xuất thiết bị âm thanh nổi tiếng với các sản phẩm loa và tai nghe chất lượng cao.',
					},
					{
						name: 'Anker',
						logoUrl: 'brands/anker.png',
						description:
							'Anker là thương hiệu chuyên sản xuất phụ kiện công nghệ, đặc biệt là các sản phẩm sạc và pin dự phòng.',
					},
					// Các thương hiệu phổ biến khác trong lĩnh vực điện thoại và điện tử
					{
						name: 'Xiaomi',
						logoUrl: 'brands/xiaomi.png',
						description:
							'Xiaomi là công ty điện tử Trung Quốc chuyên sản xuất điện thoại thông minh, thiết bị gia dụng thông minh và nhiều sản phẩm công nghệ khác.',
					},
					{
						name: 'Oppo',
						logoUrl: 'brands/oppo.png',
						description:
							'Oppo là nhà sản xuất thiết bị điện tử Trung Quốc, nổi tiếng với các dòng điện thoại thông minh.',
					},
					{
						name: 'Vivo',
						logoUrl: 'brands/vivo.png',
						description:
							'Vivo là công ty công nghệ Trung Quốc chuyên sản xuất điện thoại thông minh, phụ kiện, phần mềm và dịch vụ trực tuyến.',
					},
					{
						name: 'Realme',
						logoUrl: 'brands/realme.png',
						description:
							'Realme là thương hiệu con của Oppo, chuyên sản xuất điện thoại thông minh và các thiết bị IoT.',
					},
					{
						name: 'Asus',
						logoUrl: 'brands/asus.png',
						description:
							'Asus là công ty đa quốc gia của Đài Loan chuyên sản xuất các sản phẩm liên quan đến máy tính.',
					},
					{
						name: 'Dell',
						logoUrl: 'brands/dell.png',
						description:
							'Dell là tập đoàn đa quốc gia của Mỹ chuyên phát triển và kinh doanh máy tính và các sản phẩm công nghệ liên quan.',
					},
					{
						name: 'HP',
						logoUrl: 'brands/hp.png',
						description:
							'HP Inc. là công ty công nghệ thông tin đa quốc gia của Mỹ chuyên sản xuất máy tính cá nhân, máy in và các thiết bị liên quan.',
					},
					{
						name: 'Lenovo',
						logoUrl: 'brands/lenovo.png',
						description:
							'Lenovo Group Ltd. là tập đoàn đa quốc gia chuyên sản xuất thiết bị điện tử, máy tính và các sản phẩm liên quan đến công nghệ thông tin.',
					},
					{
						name: 'Acer',
						logoUrl: 'brands/acer.png',
						description:
							'Acer Inc. là công ty đa quốc gia của Đài Loan chuyên về phần cứng máy tính và điện tử.',
					},
					{
						name: 'MSI',
						logoUrl: 'brands/msi.png',
						description:
							'MSI là công ty công nghệ thông tin của Đài Loan chuyên thiết kế và sản xuất máy tính, bo mạch chủ, card đồ họa và nhiều thiết bị khác.',
					},
					{
						name: 'Sony',
						logoUrl: 'brands/sony.png',
						description:
							'Sony Corporation là tập đoàn đa quốc gia của Nhật Bản chuyên về điện tử tiêu dùng, game, giải trí và dịch vụ tài chính.',
					},
					{
						name: 'Huawei',
						logoUrl: 'brands/huawei.png',
						description:
							'Huawei là tập đoàn đa quốc gia của Trung Quốc chuyên về viễn thông và điện tử tiêu dùng.',
					},
					{
						name: 'Intel',
						logoUrl: 'brands/intel.png',
						description:
							'Intel Corporation là tập đoàn công nghệ đa quốc gia và là nhà sản xuất chip bán dẫn lớn nhất thế giới.',
					},
					{
						name: 'AMD',
						logoUrl: 'brands/amd.png',
						description:
							'Advanced Micro Devices, Inc. (AMD) là công ty đa quốc gia chuyên về bán dẫn máy tính có trụ sở tại Mỹ.',
					},
				],
				{ transaction },
			);

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			console.error('Error checking Brands count:', error);
			return;
		}
	},

	down: async (queryInterface, Sequelize) => {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.bulkDelete('Brands', null, { transaction });
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			console.error('Error while deleting Brands:', error);
		}
	},
};
