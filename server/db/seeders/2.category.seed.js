'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			//delete all categories
			await queryInterface.bulkDelete('Categories', null, {
				transaction,
			});

			await queryInterface.bulkInsert(
				'Categories',
				[
					{
						name: 'Điện thoại',
						description: 'Các loại điện thoại di động',
					},
					{
						name: 'Laptop',
						description: 'Máy tính xách tay',
					},
					{
						name: 'Phụ kiện',
						description: 'Phụ kiện cho các thiết bị điện tử',
					},
					{
						name: 'Smartwatch',
						description: 'Đồng hồ thông minh',
					},
					{
						name: 'Đồng hồ',
						description: 'Đồng hồ truyền thống',
					},
					{
						name: 'Tablet',
						description: 'Máy tính bảng',
					},
					{
						name: 'Màn hình, Máy in',
						description: 'Màn hình máy tính và máy in',
					},
				],
				{ transaction },
			);

			const categories = await queryInterface.sequelize.query(
				`SELECT id, name FROM \`Categories\`;`,
				{
					type: queryInterface.sequelize.QueryTypes.SELECT,
					transaction,
				},
			);

			// Find the ID of the "Phụ kiện" category
			const phuKienId = categories.find(
				(cat) => cat.name === 'Phụ kiện',
			)?.id;

			const manhinhMayinId = categories.find(
				(cat) => cat.name === 'Màn hình, Máy in',
			)?.id;

			if (phuKienId) {
				// Create subcategories for "Phụ kiện"
				const phuKienSubcategories = [
					{
						name: 'Phụ kiện di động',
						description: 'Phụ kiện dành cho thiết bị di động',
						parentId: phuKienId,
					},
					{
						name: 'Thiết bị âm thanh',
						description: 'Các thiết bị âm thanh',
						parentId: phuKienId,
					},
					{
						name: 'Camera / Flycam / Gimbal',
						description: 'Thiết bị chụp ảnh và quay phim',
						parentId: phuKienId,
					},
					{
						name: 'Phụ kiện laptop',
						description: 'Phụ kiện dành cho laptop',
						parentId: phuKienId,
					},
				];

				await queryInterface.bulkInsert(
					'Categories',
					phuKienSubcategories,
					{ transaction },
				);

				// Get the IDs of subcategories
				const subcategories = await queryInterface.sequelize.query(
					`SELECT id, name FROM \`Categories\`;`,
					{
						type: queryInterface.sequelize.QueryTypes.SELECT,
						transaction,
					},
				);

				const phuKienDiDongId = subcategories.find(
					(cat) => cat.name === 'Phụ kiện di động',
				)?.id;

				const thietBiAmThanhId = subcategories.find(
					(cat) => cat.name === 'Thiết bị âm thanh',
				)?.id;

				const cameraId = subcategories.find(
					(cat) => cat.name === 'Camera / Flycam / Gimbal',
				)?.id;

				const phuKienLaptopId = subcategories.find(
					(cat) => cat.name === 'Phụ kiện laptop',
				)?.id;
				if (phuKienDiDongId) {
					const phuKienDiDongItems = [
						{
							name: 'Sạc dự phòng',
							description:
								'Pin sạc dự phòng cho thiết bị di động',
							parentId: phuKienDiDongId,
						},
						{
							name: 'Sạc, cáp',
							description: 'Sạc và cáp kết nối',
							parentId: phuKienDiDongId,
						},
						{
							name: 'Ốp lưng điện thoại',
							description: 'Ốp lưng bảo vệ điện thoại',
							parentId: phuKienDiDongId,
						},
						{
							name: 'Ốp lưng máy tính bảng',
							description: 'Ốp lưng bảo vệ máy tính bảng',
							parentId: phuKienDiDongId,
						},
						{
							name: 'Miếng dán màn hình',
							description: 'Miếng dán bảo vệ màn hình',
							parentId: phuKienDiDongId,
						},
						{
							name: 'Miếng dán Camera',
							description: 'Miếng dán bảo vệ camera',
							parentId: phuKienDiDongId,
						},
						{
							name: 'Túi đựng AirPods',
							description: 'Túi bảo vệ AirPods',
							parentId: phuKienDiDongId,
						},
						{
							name: 'AirTag, Vỏ bảo vệ AirTag',
							description: 'AirTag và phụ kiện',
							parentId: phuKienDiDongId,
						},
						{
							name: 'Bút tablet',
							description: 'Bút cảm ứng cho máy tính bảng',
							parentId: phuKienDiDongId,
						},
						{
							name: 'Dây đồng hồ',
							description: 'Dây đeo cho đồng hồ thông minh',
							parentId: phuKienDiDongId,
						},
					];

					await queryInterface.bulkInsert(
						'Categories',
						phuKienDiDongItems,
						{ transaction },
					);
				}

				// Create more specific categories under "Thiết bị âm thanh"
				if (thietBiAmThanhId) {
					const thietBiAmThanhItems = [
						{
							name: 'Tai nghe Bluetooth',
							description: 'Tai nghe không dây kết nối Bluetooth',
							parentId: thietBiAmThanhId,
						},
						{
							name: 'Tai nghe dây',
							description: 'Tai nghe có dây',
							parentId: thietBiAmThanhId,
						},
						{
							name: 'Tai nghe chụp tai',
							description: 'Tai nghe trùm qua tai',
							parentId: thietBiAmThanhId,
						},
						{
							name: 'Tai nghe thể thao',
							description: 'Tai nghe chuyên dụng cho thể thao',
							parentId: thietBiAmThanhId,
						},
						{
							name: 'Loa',
							description: 'Loa di động',
							parentId: thietBiAmThanhId,
						},
						{
							name: 'Micro',
							description: 'Micro thu âm',
							parentId: thietBiAmThanhId,
						},
					];

					await queryInterface.bulkInsert(
						'Categories',
						thietBiAmThanhItems,
						{ transaction },
					);
				}

				// Create more specific categories under "Camera / Flycam / Gimbal"
				if (cameraId) {
					const cameraItems = [
						{
							name: 'Camera trong nhà',
							description: 'Camera giám sát trong nhà',
							parentId: cameraId,
						},
						{
							name: 'Camera ngoài trời',
							description: 'Camera giám sát ngoài trời',
							parentId: cameraId,
						},
						{
							name: 'Flycam',
							description: 'Máy bay không người lái có camera',
							parentId: cameraId,
						},
						{
							name: 'Camera hành trình',
							description: 'Camera ghi hình hành trình',
							parentId: cameraId,
						},
						{
							name: 'Gimbal',
							description: 'Thiết bị chống rung cho camera',
							parentId: cameraId,
						},
						{
							name: 'Máy chiếu',
							description: 'Thiết bị chiếu hình ảnh',
							parentId: cameraId,
						},
					];

					await queryInterface.bulkInsert('Categories', cameraItems, {
						transaction,
					});
				}

				// Create more specific categories under "Phụ kiện laptop"
				if (phuKienLaptopId) {
					const phuKienLaptopItems = [
						{
							name: 'Hub, cáp chuyển đổi',
							description: 'Thiết bị mở rộng cổng kết nối',
							parentId: phuKienLaptopId,
						},
						{
							name: 'Chuột máy tính',
							description: 'Chuột cho máy tính',
							parentId: phuKienLaptopId,
						},
						{
							name: 'Bàn phím',
							description: 'Bàn phím cho máy tính',
							parentId: phuKienLaptopId,
						},
						{
							name: 'Router - Thiết bị mạng',
							description: 'Thiết bị mạng không dây và có dây',
							parentId: phuKienLaptopId,
						},
						{
							name: 'Balo, túi chống sốc',
							description: 'Túi đựng laptop',
							parentId: phuKienLaptopId,
						},
						{
							name: 'Phần mềm',
							description: 'Phần mềm cho máy tính',
							parentId: phuKienLaptopId,
						},
					];

					await queryInterface.bulkInsert(
						'Categories',
						phuKienLaptopItems,
						{ transaction },
					);
				}
			}

			if (manhinhMayinId) {
				const manhinhMayinSubcategories = [
					{
						name: 'PC, Màn hình',
						description: 'Màn hình cho PC',
						parentId: manhinhMayinId,
					},
					{
						name: 'Máy in, Mực in',
						description: 'Múc in, màn hình in',
						parentId: manhinhMayinId,
					},
				];

				await queryInterface.bulkInsert(
					'Categories',
					manhinhMayinSubcategories,
					{ transaction },
				);
				// Get the IDs of subcategories
				const subcategories = await queryInterface.sequelize.query(
					`SELECT id, name FROM \`Categories\`;`,
					{
						type: queryInterface.sequelize.QueryTypes.SELECT,
						transaction,
					},
				);

				const pcManhinhId = subcategories.find(
					(category) => category.name === 'PC, Màn hình',
				)?.id;

				const mayinMucinId = subcategories.find(
					(category) => category.name === 'Máy in, Mức in',
				)?.id;

				// Create more specific categories under "PC, Màn hình"
				if (pcManhinhId) {
					const pcManhinhItems = [
						{
							name: 'Máy tính để bàn',
							description: 'Máy tính giải quyết màn hình',
							parentId: pcManhinhId,
						},
						{
							name: 'Màn hình máy tính',
							description: 'Màn hình cho máy tính',
							parentId: pcManhinhId,
						},
						{
							name: 'Máy chơi game',
							description: 'Máy chơi game',
							parentId: pcManhinhId,
						},
					];

					await queryInterface.bulkInsert(
						'Categories',
						pcManhinhItems,
						{
							transaction,
						},
					);
				}
				// Create more specific categories under "Máy in, Mực in"
				if (mayinMucinId) {
					const mayinMucinItems = [
						{
							name: 'Máy in',
							description: 'Máy in văn phòng',
							parentId: mayinMucinId,
						},
						{
							name: 'Mực in',
							description: 'Mực in cho máy in',
							parentId: mayinMucinId,
						},
					];

					await queryInterface.bulkInsert(
						'Categories',
						mayinMucinItems,
						{ transaction },
					);
				}
			}

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			console.error('Error while inserting categories:', error);
		}
	},

	async down(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.bulkDelete('Categories', null, {
				transaction,
			});
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			console.error('Error while deleting categories:', error);
		}
	},
};
