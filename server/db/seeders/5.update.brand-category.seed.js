'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			const data = [
				{
					name: 'Samsung',
					categories: [
						'Điện thoại',
						'Smartwatch',
						'Tablet',
						'Sạc dự phòng',
						'Sạc, cáp',
						'Ốp lưng điện thoại',
						'Ốp lưng máy tính bảng',
						'Dây đồng hồ',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
						'Màn hình máy tính',
						'Máy in',
					],
				},
				{
					name: 'Imou',
					categories: [
						'Camera',
						'Thiết bị giám sát',
						'Camera trong nhà',
						'Camera ngoài trời',
					],
				},
				{
					name: 'Baseus',
					categories: [
						'Phụ kiện',
						'Điện thoại',
						'Sạc dự phòng',
						'Sạc, cáp',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
						'Camera trong nhà',
						'Camera ngoài trời',
						'Hub, cáp chuyển đổi',
					],
				},
				{
					name: 'JBL',
					categories: [
						'Loa',
						'Tai nghe',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
					],
				},
				{
					name: 'Anker',
					categories: [
						'Phụ kiện',
						'Điện thoại',
						'Sạc dự phòng',
						'Sạc, cáp',
						'Ốp lưng điện thoại',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
					],
				},
				{
					name: 'Xiaomi',
					categories: [
						'Điện thoại',
						'Smartwatch',
						'Tablet',
						'Sạc dự phòng',
						'Sạc, cáp',
						'Dây đồng hồ',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
						'Chuột máy tính',
						'Bàn phím',
						'Router - Thiết bị mạng',
						'Màn hình máy tính',
					],
				},
				{
					name: 'Oppo',
					categories: [
						'Điện thoại',
						'Tablet',
						'Sạc, cáp',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
					],
				},
				{
					name: 'Vivo',
					categories: ['Điện thoại'],
				},
				{
					name: 'Realme',
					categories: [
						'Điện thoại',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
					],
				},
				{
					name: 'Asus',
					categories: [
						'Laptop',
						'Phụ kiện',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Chuột máy tính',
						'Bàn phím',
						'Router - Thiết bị mạng',
						'Máy tính để bàn',
						'Màn hình máy tính',
					],
				},
				{
					name: 'Dell',
					categories: [
						'Laptop',
						'Phụ kiện',
						'Máy tính để bàn',
						'Màn hình máy tính',
					],
				},
				{
					name: 'HP',
					categories: [
						'Laptop',
						'Phụ kiện',
						'Chuột máy tính',
						'Bàn phím',
						'Máy tính để bàn',
					],
				},
				{
					name: 'Lenovo',
					categories: [
						'Laptop',
						'Phụ kiện',
						'Tablet',
						'Máy tính để bàn',
						'Màn hình máy tính',
					],
				},
				{
					name: 'Acer',
					categories: [
						'Laptop',
						'Phụ kiện',
						'Máy tính để bàn',
						'Màn hình máy tính',
					],
				},
				{
					name: 'MSI',
					categories: [
						'Laptop',
						'Phụ kiện',
						'Chuột máy tính',
						'Bàn phím',
						'Máy tính để bàn',
						'Màn hình máy tính',
					],
				},
				{
					name: 'Sony',
					categories: [
						'Laptop',
						'Phụ kiện',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
					],
				},
				{
					name: 'Huawei',
					categories: ['Laptop', 'Smartwatch'],
				},
				{
					name: 'Intel',
					categories: ['Laptop', 'Phụ kiện', 'Máy tính để bàn'],
				},
				{
					name: 'AMD',
					categories: ['Laptop', 'Phụ kiện', 'Máy tính để bàn'],
				},
				{
					name: 'Iphone',
					categories: ['Điện thoại'],
				},
				{
					name: 'Honor',
					categories: ['Điện thoại', 'Tablet'],
				},
				{
					name: 'TCL',
					categories: ['Điện thoại', 'Tablet'],
				},
				{
					name: 'TECNO',
					categories: ['Điện thoại'],
				},
				{
					name: 'Nokia',
					categories: ['Điện thoại'],
				},
				{
					name: 'Masstel',
					categories: ['Điện thoại', 'Smartwatch'],
				},
				{
					name: 'Mobell',
					categories: ['Điện thoại', 'Loa'],
				},
				{
					name: 'Itel',
					categories: ['Điện thoại'],
				},
				{
					name: 'Viettel',
					categories: ['Điện thoại'],
				},
				{
					name: 'Benco',
					categories: ['Điện thoại'],
				},
				{
					name: 'Macbook',
					categories: ['Laptop'],
				},
				{
					name: 'Gigabyte',
					categories: [
						'Laptop',
						'Máy tính để bàn',
						'Màn hình máy tính',
					],
				},
				{
					name: 'LG',
					categories: [
						'Laptop',
						'Loa',
						'Máy tính để bàn',
						'Màn hình máy tính',
					],
				},
				{
					name: 'Watch',
					categories: ['Smartwatch'],
				},
				{
					name: 'BEFIT',
					categories: ['Smartwatch'],
				},
				{
					name: 'GARMIN',
					categories: ['Smartwatch'],
				},
				{
					name: 'KiDCARE',
					categories: ['Smartwatch'],
				},
				{
					name: 'MYKID',
					categories: ['Smartwatch'],
				},
				{
					name: 'Amazit',
					categories: ['Smartwatch'],
				},
				{
					name: 'CITIZEN',
					categories: ['Đồng hồ'],
				},
				{
					name: 'ORIENT',
					categories: ['Đồng hồ'],
				},
				{
					name: 'CASIO',
					categories: ['Đồng hồ'],
				},
				{
					name: 'MVMT',
					categories: ['Đồng hồ', 'Dây đồng hồ'],
				},
				{
					name: 'ELIO',
					categories: ['Đồng hồ'],
				},
				{
					name: 'NAKZEN',
					categories: ['Đồng hồ'],
				},
				{
					name: 'G-SHOCK',
					categories: ['Đồng hồ'],
				},
				{
					name: 'BABY-G',
					categories: ['Đồng hồ'],
				},
				{
					name: 'EDIFICE',
					categories: ['Đồng hồ'],
				},
				{
					name: 'CANDINO',
					categories: ['Đồng hồ'],
				},
				{
					name: 'Q&Q',
					categories: ['Đồng hồ'],
				},
				{
					name: 'TOMMY HILFIGER',
					categories: ['Đồng hồ'],
				},
				{
					name: 'EYKI',
					categories: ['Đồng hồ'],
				},
				{
					name: 'FESTINA',
					categories: ['Đồng hồ'],
				},
				{
					name: 'FERRARI',
					categories: ['Đồng hồ'],
				},
				{
					name: 'TITAN',
					categories: ['Đồng hồ'],
				},
				{
					name: 'MOVADO',
					categories: ['Đồng hồ'],
				},
				{
					name: 'CERTINA',
					categories: ['Đồng hồ'],
				},
				{
					name: 'ERNEST BOREL',
					categories: ['Đồng hồ'],
				},
				{
					name: 'KORLEX',
					categories: ['Đồng hồ'],
				},
				{
					name: 'SMILE KID',
					categories: ['Đồng hồ'],
				},
				{
					name: 'EDOX',
					categories: ['Đồng hồ'],
				},
				{
					name: 'PROTREK',
					categories: ['Đồng hồ'],
				},
				{
					name: 'iPad',
					categories: ['Tablet'],
				},
				{
					name: 'Xmobile',
					categories: [
						'Sạc dự phòng',
						'Sạc, cáp',
						'Hub, cáp chuyển đổi',
					],
				},
				{
					name: 'AVA+',
					categories: [
						'Sạc dự phòng',
						'Sạc, cáp',
						'Ốp lưng điện thoại',
						'Miếng dán màn hình',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
					],
				},
				{
					name: 'AVA',
					categories: ['Sạc dự phòng', 'Sạc, cáp'],
				},
				{
					name: 'UGREEN',
					categories: [
						'Sạc dự phòng',
						'Sạc, cáp',
						'Hub, cáp chuyển đổi',
						'Chuột máy tính',
					],
				},
				{
					name: 'HYDRUS',
					categories: ['Sạc dự phòng', 'Sạc, cáp'],
				},
				{
					name: 'Apple',
					categories: [
						'Sạc, cáp',
						'Ốp lưng điện thoại',
						'Ốp lưng máy tính bảng',
						'Dây đồng hồ',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Hub, cáp chuyển đổi',
						'Chuột máy tính',
						'Bàn phím',
						'Máy tính để bàn',
					],
				},
				{
					name: 'Mozer',
					categories: ['Sạc, cáp'],
				},
				{
					name: 'Belkin',
					categories: ['Sạc, cáp'],
				},
				{
					name: 'Innostyle',
					categories: ['Sạc, cáp', 'Miếng dán màn hình'],
				},
				{
					name: 'Mbeat',
					categories: ['Sạc, cáp'],
				},
				{
					name: 'e.VALU',
					categories: ['Sạc, cáp'],
				},
				{
					name: 'Beats',
					categories: [
						'Sạc, cáp',
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
					],
				},
				{
					name: 'Energizer',
					categories: ['Sạc, cáp'],
				},
				{
					name: 'HYPER',
					categories: ['Sạc, cáp', 'Hub, cáp chuyển đổi'],
				},
				{
					name: 'JM',
					categories: [
						'Ốp lưng điện thoại',
						'Ốp lưng máy tính bảng',
						'Túi đựng AirPods',
					],
				},
				{
					name: 'UNIQ',
					categories: [
						'Ốp lưng điện thoại',
						'Ốp lưng máy tính bảng',
						'Miếng dán màn hình',
						'Miếng dán Camera',
						'Túi đựng AirPods',
						'Dây đồng hồ',
					],
				},
				{
					name: 'ARAREE',
					categories: ['Ốp lưng điện thoại'],
				},
				{
					name: 'LAUT',
					categories: [
						'Ốp lưng điện thoại',
						'Ốp lưng máy tính bảng',
						'Túi đựng AirPods',
					],
				},
				{
					name: 'COSANO',
					categories: ['Ốp lưng điện thoại'],
				},
				{
					name: 'SPIGEN',
					categories: ['Ốp lưng điện thoại'],
				},
				{
					name: 'MOBOSI',
					categories: ['Ốp lưng điện thoại', 'Miếng dán màn hình'],
				},
				{
					name: 'JINCASE',
					categories: ['Ốp lưng điện thoại', 'Miếng dán màn hình'],
				},
				{
					name: 'KINGXBAR',
					categories: ['Ốp lưng điện thoại'],
				},
				{
					name: 'OSMIA',
					categories: ['Ốp lưng điện thoại', 'Túi đựng AirPods'],
				},
				{
					name: 'SWITCHEASY',
					categories: ['Ốp lưng điện thoại', 'Túi đựng AirPods'],
				},
				{
					name: 'JINYA',
					categories: ['Ốp lưng điện thoại'],
				},
				{
					name: 'TGVIS',
					categories: ['Ốp lưng điện thoại'],
				},
				{
					name: 'MEEKER',
					categories: ['Ốp lưng điện thoại'],
				},
				{
					name: 'JCPAL',
					categories: [
						'Ốp lưng điện thoại',
						'Ốp lưng máy tính bảng',
						'Miếng dán màn hình',
						'Miếng dán Camera',
					],
				},
				{
					name: 'ESR',
					categories: ['Ốp lưng máy tính bảng', 'Miếng dán màn hình'],
				},
				{
					name: 'Panzer Glass',
					categories: ['Miếng dán màn hình'],
				},
				{
					name: 'O-TECH',
					categories: ['Miếng dán màn hình'],
				},
				{
					name: 'GOLDSPIN',
					categories: ['Miếng dán màn hình'],
				},
				{
					name: 'Unibest',
					categories: ['Miếng dán màn hình'],
				},
				{
					name: 'MOCOLL',
					categories: ['Miếng dán màn hình'],
				},
				{
					name: 'LeArmor',
					categories: ['Miếng dán màn hình'],
				},
				{
					name: 'Trust Active',
					categories: ['Miếng dán màn hình'],
				},
				{
					name: 'ZAGG',
					categories: ['Miếng dán màn hình'],
				},
				{
					name: 'TPUIMD',
					categories: ['Túi đựng AirPods'],
				},
				{
					name: 'Phương Linh',
					categories: ['Dây đồng hồ'],
				},
				{
					name: 'M&W',
					categories: ['Dây đồng hồ'],
				},
				{
					name: 'SHUWATCH',
					categories: ['Dây đồng hồ'],
				},
				{
					name: 'RUI ZHI',
					categories: ['Dây đồng hồ'],
				},
				{
					name: 'Marshall',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
					],
				},
				{
					name: 'SoundPeats',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
					],
				},
				{
					name: 'SOUL',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
					],
				},
				{
					name: 'HAVIT',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
					],
				},
				{
					name: 'HyperX',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Chuột máy tính',
						'Bàn phím',
					],
				},
				{
					name: 'ZADEZ',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
						'Chuột máy tính',
						'Bàn phím',
					],
				},
				{
					name: 'SHOKZ',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
					],
				},
				{
					name: 'MONSTER',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
					],
				},
				{
					name: 'SOUNARC',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
					],
				},
				{
					name: 'DENON',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
					],
				},
				{
					name: 'ALPHA WORKS',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
					],
				},
				{
					name: 'Fizz',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
					],
				},
				{
					name: 'Logitech',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Chuột máy tính',
						'Bàn phím',
					],
				},
				{
					name: 'Bowers & Wilkins',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
					],
				},
				{
					name: 'Soundcore',
					categories: [
						'Tai nghe Bluetooth',
						'Tai nghe dây',
						'Tai nghe chụp tai',
						'Tai nghe thể thao',
						'Loa',
					],
				},
				{
					name: 'Harman Kardon',
					categories: ['Loa'],
				},
				{
					name: 'Klipsch',
					categories: ['Loa'],
				},
				{
					name: 'Mozard',
					categories: ['Loa'],
				},
				{
					name: 'Microlab',
					categories: ['Loa'],
				},
				{
					name: 'ENKOR',
					categories: ['Loa'],
				},
				{
					name: 'BUGANI',
					categories: ['Loa'],
				},
				{
					name: 'SOUNDMAX',
					categories: ['Loa'],
				},
				{
					name: 'JAMMY',
					categories: ['Loa'],
				},
				{
					name: 'Sumico',
					categories: ['Loa'],
				},
				{
					name: 'PARAMAX',
					categories: ['Loa'],
				},
				{
					name: 'Dalton',
					categories: ['Loa'],
				},
				{
					name: 'BIRICi',
					categories: ['Loa'],
				},
				{
					name: 'NANOMAX',
					categories: ['Loa'],
				},
				{
					name: 'Zenbos',
					categories: ['Loa'],
				},
				{
					name: 'BOBOS',
					categories: ['Loa'],
				},
				{
					name: 'SHABA',
					categories: ['Loa'],
				},
				{
					name: 'EZVIZ',
					categories: ['Camera trong nhà', 'Camera ngoài trời'],
				},
				{
					name: 'TP-Link',
					categories: [
						'Camera trong nhà',
						'Camera ngoài trời',
						'Router - Thiết bị mạng',
					],
				},
				{
					name: 'Tiandy',
					categories: ['Camera trong nhà', 'Camera ngoài trời'],
				},
				{
					name: 'BotsLab',
					categories: ['Camera trong nhà', 'Camera ngoài trời'],
				},
				{
					name: 'SSE Selection',
					categories: ['Camera trong nhà', 'Camera ngoài trời'],
				},
				{
					name: 'Rapoo',
					categories: ['Chuột máy tính', 'Bàn phím'],
				},
				{
					name: 'DAREU',
					categories: ['Chuột máy tính', 'Bàn phím'],
				},
				{
					name: 'CORSAIR',
					categories: ['Chuột máy tính', 'Bàn phím'],
				},
				{
					name: 'AKKO',
					categories: ['Chuột máy tính', 'Bàn phím'],
				},
				{
					name: 'Tenda',
					categories: ['Router - Thiết bị mạng'],
				},
				{
					name: 'TOTOLINK',
					categories: ['Router - Thiết bị mạng'],
				},
				{
					name: 'MERCUSYS',
					categories: ['Router - Thiết bị mạng'],
				},
				{
					name: 'Linksys',
					categories: ['Router - Thiết bị mạng'],
				},
				{
					name: 'ViewSonic',
					categories: ['Màn hình máy tính'],
				},
				{
					name: 'SINGPC',
					categories: ['Màn hình máy tính', 'Máy tính để bàn'],
				},
				{
					name: 'HIKVISION',
					categories: [
						'Camera trong nhà',
						'Camera ngoài trời',
						'Màn hình máy tính',
					],
				},
			];

			// Lấy tất cả brands và categories hiện có
			const existingBrands = await queryInterface.sequelize.query(
				'SELECT id, name FROM `Brands`',
				{
					type: queryInterface.sequelize.QueryTypes.SELECT,
					transaction,
				},
			);

			const existingCategories = await queryInterface.sequelize.query(
				'SELECT id, name FROM `Categories`',
				{
					type: queryInterface.sequelize.QueryTypes.SELECT,
					transaction,
				},
			);

			// Tạo mapping để dễ tìm kiếm
			const brandMap = new Map();
			existingBrands.forEach((brand) => {
				brandMap.set(brand.name, brand.id);
			});

			const categoryMap = new Map();
			existingCategories.forEach((category) => {
				categoryMap.set(category.name, category.id);
			});

			// Mảng để lưu các bản ghi BrandCategories cần thêm
			const brandCategoryRecords = [];

			// Xử lý từng brand và category
			for (const brand of data) {
				let brandId;

				// Kiểm tra nếu brand đã tồn tại
				if (brandMap.has(brand.name)) {
					brandId = brandMap.get(brand.name);
				} else {
					// Nếu brand chưa tồn tại, tạo mới
					await queryInterface.sequelize.query(
						`INSERT INTO \`Brands\` (name, \`createdAt\`, \`updatedAt\`)
						VALUES ('${brand.name}', NOW(), NOW())`,
						{
							type: queryInterface.sequelize.QueryTypes.INSERT,
							transaction,
						},
					);

					// Truy vấn lại để lấy ID
					const newBrand = await queryInterface.sequelize.query(
						`SELECT id FROM \`Brands\` WHERE name = '${brand.name}' LIMIT 1`,
						{
							type: queryInterface.sequelize.QueryTypes.SELECT,
							transaction,
						},
					);

					brandId = newBrand[0].id;
					brandMap.set(brand.name, brandId);
				}

				// Xử lý từng category của brand
				for (const categoryName of brand.categories) {
					let categoryId;

					// Kiểm tra nếu category đã tồn tại
					if (categoryMap.has(categoryName)) {
						categoryId = categoryMap.get(categoryName);
					} else {
						// Nếu category chưa tồn tại, tạo mới
						await queryInterface.sequelize.query(
							`INSERT INTO \`Categories\` (name, \`createdAt\`, \`updatedAt\`)
							VALUES ('${categoryName}', NOW(), NOW())`,
							{
								type: queryInterface.sequelize.QueryTypes
									.INSERT,
								transaction,
							},
						);

						// Truy vấn lại để lấy ID
						const newCategory =
							await queryInterface.sequelize.query(
								`SELECT id FROM \`Categories\` WHERE name = '${categoryName}' LIMIT 1`,
								{
									type: queryInterface.sequelize.QueryTypes
										.SELECT,
									transaction,
								},
							);

						categoryId = newCategory[0].id;
						categoryMap.set(categoryName, categoryId);
					}

					// Thêm bản ghi liên kết vào mảng
					brandCategoryRecords.push({
						brandId,
						categoryId,
						createdAt: new Date(),
						updatedAt: new Date(),
					});
				}
			}

			// Thêm tất cả bản ghi vào bảng BrandCategories
			if (brandCategoryRecords.length > 0) {
				await queryInterface.bulkInsert(
					'BrandCategories',
					brandCategoryRecords,
					{ transaction },
				);
			}

			await transaction.commit();
			console.log('Brand-Category relationships created successfully');
		} catch (error) {
			await transaction.rollback();
			console.error(
				'Error creating Brand-Category relationships:',
				error,
			);
			throw error;
		}
	},

	down: async (queryInterface, Sequelize) => {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			// Xóa tất cả các bản ghi trong bảng BrandCategories
			await queryInterface.bulkDelete('BrandCategories', null, {
				transaction,
			});
			await transaction.commit();
			console.log(
				'All Brand-Category relationships removed successfully',
			);
		} catch (error) {
			await transaction.rollback();
			console.error(
				'Error removing Brand-Category relationships:',
				error,
			);
			throw error;
		}
	},
};
