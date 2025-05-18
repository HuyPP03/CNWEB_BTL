'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			//delete all categories
			await queryInterface.bulkDelete('AttributeTypes', null, {
				transaction,
			});

			const categories = await queryInterface.sequelize.query(
				`SELECT id, name FROM \`Categories\`;`,
				{
					type: queryInterface.sequelize.QueryTypes.SELECT,
					transaction,
				},
			);

			const laptopId = categories.find(
				(category) => category.name === 'Laptop',
			)?.id;

			const dienthoaiId = categories.find(
				(category) => category.name === 'Điện thoại',
			)?.id;
			const smartwatchId = categories.find(
				(category) => category.name === 'Smartwatch',
			)?.id;
			const tabletId = categories.find(
				(category) => category.name === 'Tablet',
			)?.id;
			const donghoId = categories.find(
				(category) => category.name === 'Đồng hồ',
			)?.id;
			const sacduphongId = categories.find(
				(category) => category.name === 'Sạc dự phòng',
			)?.id;
			const sacCapId = categories.find(
				(category) => category.name === 'Sạc, cáp',
			)?.id;
			const oplungdienthoaiId = categories.find(
				(category) => category.name === 'Ốp lưng điện thoại',
			)?.id;
			const oplungmaytinhbangId = categories.find(
				(category) => category.name === 'Ốp lưng máy tính bảng',
			)?.id;
			const miengdanmanhinhId = categories.find(
				(category) => category.name === 'Miếng dán màn hình',
			)?.id;
			const miengdancameraId = categories.find(
				(category) => category.name === 'Miếng dán camera',
			)?.id;
			const tuidungairpodsId = categories.find(
				(category) => category.name === 'Túi đựng AirPods',
			)?.id;
			const airtagId = categories.find(
				(category) => category.name === 'AirTag, Vỏ bảo vệ AirTag',
			)?.id;
			const buttabletId = categories.find(
				(category) => category.name === 'Bút tablet',
			)?.id;
			const daydonghoId = categories.find(
				(category) => category.name === 'Dây đồng hồ',
			)?.id;
			const tainghebluetoothId = categories.find(
				(category) => category.name === 'Tai nghe Bluetooth',
			)?.id;
			const tainghedayId = categories.find(
				(category) => category.name === 'Tai nghe dây',
			)?.id;
			const tainghechuptaiId = categories.find(
				(category) => category.name === 'Tai nghe chụp tai',
			)?.id;
			const tainghethethaoId = categories.find(
				(category) => category.name === 'Tai nghe thể thao',
			)?.id;
			const loaId = categories.find(
				(category) => category.name === 'Loa',
			)?.id;
			const microId = categories.find(
				(category) => category.name === 'Micro',
			)?.id;
			const cameratrongnhaId = categories.find(
				(category) => category.name === 'Camera trong nhà',
			)?.id;
			const camerangoaitroiId = categories.find(
				(category) => category.name === 'Camera ngoài trời',
			)?.id;
			const flycamId = categories.find(
				(category) => category.name === 'Flycam',
			)?.id;
			const camerahanhtrinhId = categories.find(
				(category) => category.name === 'Camera hành trình',
			)?.id;
			const gimbalId = categories.find(
				(category) => category.name === 'Gimbal',
			)?.id;
			const maychieuId = categories.find(
				(category) => category.name === 'Máy chiếu',
			)?.id;
			const hubId = categories.find(
				(category) => category.name === 'Hub, cáp chuyển đổi',
			)?.id;
			const chuotmaytinhId = categories.find(
				(category) => category.name === 'Chuột máy tính',
			)?.id;
			const banphimId = categories.find(
				(category) => category.name === 'Bàn phím',
			)?.id;
			const routerId = categories.find(
				(category) => category.name === 'Router - Thiết bị mạng',
			)?.id;
			const phanmemId = categories.find(
				(category) => category.name === 'Phần mềm',
			)?.id;
			const maytinhdebanId = categories.find(
				(category) => category.name === 'Máy tính để bàn',
			)?.id;
			const manhinhmaytinhId = categories.find(
				(category) => category.name === 'Màn hình máy tính',
			);
			const maychoigameId = categories.find(
				(category) => category.name === 'Máy chơi game',
			)?.id;
			const mayinId = categories.find(
				(category) => category.name === 'Máy in',
			)?.id;
			const mucinId = categories.find(
				(category) => category.name === 'Mực in',
			)?.id;
			const laptopTypes = [
				{
					name: 'Bộ xử lý',
					children: [
						'Công nghệ CPU',
						'Số nhân',
						'Số luồng',
						'Tốc độ CPU',
						'Tốc độ tối đa',
					],
				},
				{
					name: 'Bộ nhớ RAM, Ổ cứng',
					children: [
						'RAM',
						'Loại RAM',
						'Tốc độ bus RAM',
						'Hỗ trợ RAM tối đa',
						'Ổ cứng',
					],
				},
				{
					name: 'Màn hình',
					children: [
						'Màn hình',
						'Độ phân giải',
						'Tần số quét',
						'Độ phủ màu',
						'Công nghệ màn hình',
					],
				},
				{
					name: 'Đồ họa Âm thanh',
					children: ['Card màn hình', 'Công nghệ âm thanh'],
				},
				{
					name: 'Cổng kết nối & tính năng mở rộng',
					children: [
						'Cổng giao tiếp',
						'Kết nối không dây',
						'Webcam',
						'Đèn bàn phím',
					],
				},
				{
					name: 'Kích thước - Khối lượng - Pin',
					children: [
						'Kích thước',
						'Chất liệu',
						'Thông tin Pin',
						'Hệ điều hành',
						'Thời điểm ra mắt',
					],
				},
			];
			const dienthoaiTypes = [
				{
					name: 'Cấu hình & Bộ nhớ',
					children: [
						'Hệ điều hành',
						'Chip xử lý (CPU)',
						'Tốc độ CPU',
						'Chip đồ họa (GPU)',
						'RAM',
						'Dung lượng lưu trữ',
						'Dung lượng còn lại (khả dụng)',
					],
				},
				{
					name: 'Camera & Màn hình',
					children: [
						'Độ phân giải camera sau',
						'Quay phim camera sau',
						'Tính năng camera sau',
						'Độ phân giải camera trước',
						'Tính năng camera trước',
						'Công nghệ màn hình',
						'Độ phân giải màn hình',
						'Màn hình rộng',
						'Độ sáng tối đa',
						'Mặt kính cảm ứng',
					],
				},
				{
					name: 'Pin & Sạc',
					children: ['Dung lượng pin', 'Loại pin', 'Công nghệ pin'],
				},
				{
					name: 'Kết nối',
					children: [
						'Mạng di động',
						'SIM',
						'Wifi',
						'GPS',
						'Bluetooth',
						'Cổng kết nối/sạc',
						'Jack tai nghe',
						'Kết nối khác',
					],
				},
				{
					name: 'Thiết kế & Đặc biệt',
					children: [
						'Chất liệu',
						'Kích thước, khối lượng',
						'Thời điểm ra mắt',
						'Hãng',
					],
				},
				{
					name: 'Tiện ích',
					children: [
						'Bảo mật nâng cao',
						'Tính năng đặc biệt',
						'Kháng nước, bụi',
						'Ghi âm',
						'Xem phim',
						'Nghe nhạc',
					],
				},
			];
			const smartwatchTypes = [
				{
					name: 'Màn hình',
					children: [
						'Công nghệ màn hình',
						'Kích thước màn hình',
						'Độ phân giải',
						'Kích thước mặt',
					],
				},
				{
					name: 'Thiết kế',
					children: [
						'Chất liệu mặt',
						'Chất liệu khung viền',
						'Chất liệu dây',
						'Độ rộng dây',
						'Chu vi cổ tay phù hợp',
						'Khả năng thay dây',
						'Kích thước, khối lượng',
					],
				},
				{
					name: 'Tiện ích',
					children: [
						'Môn thể thao',
						'Tiện ích đặc biệt',
						'Chống nước / Kháng nước',
						'Theo dõi sức khỏe',
						'Tiện ích khác',
						'Hiển thị thông báo',
					],
				},
				{
					name: 'Pin',
					children: [
						'Thời gian sử dụng pin',
						'Thời gian sạc',
						'Dung lượng pin',
						'Cổng sạc',
					],
				},
				{
					name: 'Cấu hình & Kết nối',
					children: [
						'CPU',
						'Bộ nhớ trong',
						'Hệ điều hành',
						'Kết nối với hệ điều hành',
						'Ứng dụng quản lý',
						'Kết nối',
						'Cảm biến',
						'Định vị',
					],
				},
				{
					name: 'Thông tin khác',
					children: [
						'Sản xuất tại',
						'Thời gian ra mắt',
						'Ngôn ngữ',
						'Hãng',
					],
				},
			];
			const tabletTypes = [
				{
					name: 'Màn hình',
					children: [
						'Công nghệ màn hình',
						'Độ phân giải',
						'Màn hình rộng',
					],
				},
				{
					name: 'Hệ điều hành & CPU',
					children: [
						'Hệ điều hành',
						'Chip xử lý (CPU)',
						'Tốc độ CPU',
						'Chip đồ họa (GPU)',
					],
				},
				{
					name: 'Bộ nhớ & Lưu trữ',
					children: [
						'RAM',
						'Dung lượng lưu trữ',
						'Dung lượng còn lại (khả dụng)',
						'Thẻ nhớ ngoài',
					],
				},
				{
					name: 'Camera',
					children: [
						'Độ phân giải camera sau',
						'Quay phim camera sau',
						'Tính năng camera sau',
						'Độ phân giải camera trước',
						'Tính năng camera trước',
					],
				},
				{
					name: 'Kết nối',
					children: [
						'Wifi',
						'Bluetooth',
						'Cổng kết nối/sạc',
						'Jack tai nghe',
						'Kết nối khác',
					],
				},
				{
					name: 'Tiện ích',
					children: ['Tính năng đặc biệt', 'Ghi âm'],
				},
				{
					name: 'Pin & Sạc',
					children: [
						'Dung lượng pin',
						'Loại pin',
						'Công nghệ pin',
						'Hỗ trợ sạc tối đa',
						'Sạc kèm theo máy',
					],
				},
				{
					name: 'Thông tin chung',
					children: [
						'Chất liệu',
						'Kích thước, khối lượng',
						'Thời điểm ra mắt',
						'Hãng',
					],
				},
			];
			const donghoTypes = [
				'Đối tượng sử dụng',
				'Đường kính mặt',
				'Dây đeo',
				'Độ rộng dây',
				'Khung viền',
				'Độ dày mặt',
				'Chất liệu mặt kính',
				'Tên bộ máy',
				'Thời gian sử dụng pin',
				'Kháng nước',
				'Tiện ích',
				'Nguồn năng lượng',
				'Loại máy',
				'Bộ sưu tập',
				'Sản xuất tại',
				'Thương hiệu của',
				'Hãng',
			];
			const sacduphongTypes = [
				'Dung lượng pin',
				'Hiệu suất sạc',
				'Lõi pin',
				'Công nghệ/Tiện ích',
				'Thời gian sạc đầy pin',
				'Nguồn ra',
				'Nguồn vào',
				'Kích thước',
				'Khối lượng',
				'Thương hiệu của',
				'Sản xuất tại',
				'Hãng',
			];
			const sacCapTypes = [
				'Model',
				'Chức năng',
				'Đầu vào',
				'Đầu ra',
				'Dòng sạc tối đa',
				'Kích thước',
				'Công nghệ/Tiện ích',
				'Sản xuất tại',
				'Thương hiệu của',
				'Hãng',
			];
			const oplungdienthoaiTypes = [];

			const oplungmaytinhbangTypes = [];

			const miengdanmanhinhTypes = [];

			const miengdancameraTypes = [];

			const tuidungairpodsTypes = [];

			const airtagTypes = [];

			const buttabletTypes = [
				{
					name: 'Thông số vật lý',
					children: [
						'Thời gian sạc đầy',
						'Kích thước',
						'Khối lượng',
						'Dung lượng pin',
						'Thời gian sử dụng pin',
					],
				},
				{
					name: 'Kết nối và tính năng',
					children: [
						'Tương thích thiết bị',
						'Bluetooth',
						'Wifi',
						'Cách kết nối',
					],
				},
				{
					name: 'Xuất xứ & Thương hiệu',
					children: ['Sản xuất tại', 'Thương hiệu của', 'Hãng'],
				},
			];

			const daydonghoTypes = [
				'Loại dây',
				'Độ rộng dây',
				'Chất liệu dây',
				'Màu dây',
			];

			const tainghebluetoothTypes = [
				'Thời lượng pin tai nghe',
				'Thời lượng pin hộp sạc',
				'Cổng sạc',
				'Công nghệ âm thanh',
				'Tương thích',
				'Ứng dụng kết nối',
				'Tiện ích',
				'Kết nối cùng lúc',
				'Công nghệ kết nối',
				'Điều khiển',
				'Phím điều khiển',
				'Kích thước',
				'Khối lượng',
				'Thương hiệu của',
				'Sản xuất tại',
				'Hãng',
			];

			const tainghedayTypes = [
				'Tương thích',
				'Jack cắm',
				'Độ dày dây',
				'Tiện ích',
				'Kết nối cùng lúc',
				'Điều khiển',
				'Phím điều khiển',
				'Khối lượng',
				'Thương hiệu của',
				'Sản xuất tại',
				'Hãng',
			];

			const tainghechuptaiTypes = [
				'Thời lượng pin tai nghe',
				'Cổng sạc',
				'Tương thích',
				'Jack cắm',
				'Độ dài dây',
				'Tiện ích',
				'Kết nối cùng lúc',
				'Công nghệ kết nối',
				'Điều khiển',
				'Phím điều khiển',
				'Khối lượng',
				'Kích thước',
				'Thương hiệu của',
				'Sản xuất tại',
				'Hãng',
			];

			const tainghethethaoTypes = [
				'Thời lượng pin tai nghe',
				'Thời lượng pin hộp sạc',
				'Cổng sạc',
				'Công nghệ âm thanh',
				'Tương thích',
				'Ứng dụng kết nối',
				'Tiện ích',
				'Kết nối cùng lúc',
				'Công nghệ kết nối',
				'Điều khiển',
				'Phím điều khiển',
				'Kích thước',
				'Khối lượng',
				'Thương hiệu của',
				'Sản xuất tại',
				'Hãng',
			];

			const loaTypes = [
				{
					name: 'Thông tin chung',
					children: [
						'Loại sản phẩm',
						'Tổng công suất',
						'Nguồn',
						'Thời gian sử dụng',
						'Thời gian sạc',
						'Công nghệ âm thanh',
						'Phím điều khiển',
						'Tiện tích',
					],
				},
				{
					name: 'Kết nối',
					children: [
						'Kết nối không dây',
						'Cổng phát nhạc',
						'Cổng sạc',
						'Cổng khác',
						'Khoảng cách kết nối tối đa',
					],
				},
				{
					name: 'Thông tin sản phẩm',
					children: [
						'Kích thước',
						'Thương hiệu của',
						'Chất liệu',
						'Sản xuất tại',
						'Dòng sản phẩm',
						'Hãng',
					],
				},
			];

			const microTypes = [
				'Loại micro',
				'Khoảng cách sử dụng tối đa',
				'Băng tần',
				'Tần số',
				'Độ méo tiếng',
				'Nơi sản xuất',
				'Năm sản xuất',
				'Hãng',
			];

			const cameratrongnhaTypes = [
				{
					name: 'Camera & Tiện ích',
					children: [
						'Độ phân giải',
						'Góc nhìn',
						'Góc xoay',
						'Tầm nhìn xa hồng ngoại',
						'Tiện ích',
						'Đàm thoại 2 chiều',
					],
				},
				{
					name: 'Kết nối & Lưu trữ',
					children: [
						'Kết nối',
						'Băng tần WiFi',
						'Kết nối cùng lúc',
						'Lưu trữ',
					],
				},
				{
					name: 'Nguồn điện & Điều kiện sử dụng',
					children: [
						'Nguồn điện đầu vào',
						'Cổng sạc',
						'Adapter kèm theo',
						'Nhiệt độ hoạt động',
					],
				},
				{
					name: 'Lắp đặt & Thiết bị hỗ trợ',
					children: [
						'Vị trí lắp đặt',
						'Hỗ trợ thiết bị',
						'Ứng dụng điều khiển',
						'Kích thước',
						'Thương hiệu của',
						'Sản xuất tại',
						'Hãng',
					],
				},
			];

			const camerangoaitroiTypes = [
				{
					name: 'Camera & Tiện ích',
					children: [
						'Độ phân giải',
						'Góc nhìn',
						'Góc xoay',
						'Tầm nhìn xa hồng ngoại',
						'Tiện ích',
						'Đàm thoại 2 chiều',
					],
				},
				{
					name: 'Kết nối & Lưu trữ',
					children: [
						'Kết nối',
						'Băng tần WiFi',
						'Kết nối cùng lúc',
						'Lưu trữ',
					],
				},
				{
					name: 'Nguồn điện & Điều kiện sử dụng',
					children: [
						'Nguồn điện đầu vào',
						'Cổng sạc',
						'Adapter kèm theo',
						'Nhiệt độ hoạt động',
					],
				},
				{
					name: 'Lắp đặt & Thiết bị hỗ trợ',
					children: [
						'Vị trí lắp đặt',
						'Hỗ trợ thiết bị',
						'Ứng dụng điều khiển',
						'Kích thước',
						'Thương hiệu của',
						'Sản xuất tại',
						'Hãng',
					],
				},
			];

			const flycamTypes = [
				{
					name: 'Thông tin sản phẩm',
					children: [
						'Tốc độ đi lên tối đa',
						'Tốc độ xuống tối đa',
						'Tốc độ ngang tối đa (ở mực nước biển, không có gió)',
						'Độ cao cất cánh tối đa',
						'Khoảng cách bay tối đa',
						'Góc nghiêng tối đa',
						'Thời gian bay tối đa',
						'Kích thước bình thường',
						'Kích thước tập',
						'GNSS',
						'Phạm vi ổn định khi bay',
						'Nhiệt độ hoạt động',
						'Khối lượng',
						'Thương hiệu của',
						'Hãng',
					],
				},
				{
					name: 'Camera',
					children: [
						'Cảm biến hình ảnh',
						'Ống kính',
						'Dải ISO',
						'Tốc độ màn trập',
						'Độ phân giải tối đa',
						'Chế độ chụp hình',
						'Định dạng ảnh',
						'Độ phân giải video',
						'Định dạng video',
						'Tốc độ bit tối đa của video',
						'Hỗ trợ định dạng file',
						'Color Mode',
						'Zoom kĩ thuật số',
					],
				},
				{
					name: 'Gimbal',
					children: [
						'Chống rung',
						'Phạm vi cơ học',
						'Phạm vi có thể điều khiển',
						'Tốc độ điều khiển tối đa (Nghiêng)',
					],
				},
				{
					name: 'Cảm biến',
					children: [
						'Loại cảm biến',
						'Cảm biến dưới',
						'Môi trường hoạt động',
					],
				},
				{
					name: 'Truyền video',
					children: [
						'Hệ thống truyền video',
						'Chất lượng live view',
						'Tần số hoạt động',
						'Công suất truyền',
						'Khoảng cách truyền tối đa (có cản trở, có nhiễu)',
						'Tốc độ tải xuống tối đa',
						'Độ trễ thấp nhất',
						'Ăng-ten',
						'Đầu vào',
						'Đầu ra',
						'Công suất định mức',
					],
				},
				{
					name: 'Pin',
					children: [
						'Dung lượng pin',
						'Khối lượng',
						'Định mức điện áp',
						'Giới hạn điện áp sạc',
						'Loại pin',
						'Năng lượng',
						'Nhiệt độ sạc',
					],
				},
				{
					name: 'Bộ sạc',
					children: ['Đầu ra', 'Công suất định mức'],
				},
				{
					name: 'Hub sạc',
					children: ['Loại sạc', 'Công suất định mức'],
				},
				{
					name: 'Lưu trữ',
					children: ['Thẻ microSD đề xuất'],
				},
				{
					name: 'Điều khiển từ xa',
					children: [
						'Thời gian hoạt động tối đa',
						'Công suất bộ phát (EIRP)',
						'Hãng',
					],
				},
			];

			const camerahanhtrinhTypes = [
				{
					name: 'Camera',
					children: [
						'Cảm biến',
						'Tốc độ màn trập',
						'Định dạng ảnh',
						'Độ phân giải ảnh tối đa',
						'Định dạng video',
						'Độ phân giải video',
						'Chống rung',
						'Tính ăng quay/chụp',
					],
				},
				{
					name: 'Pin',
					children: [
						'Loại pin',
						'Dung lượng pin',
						'Thời gian dùng',
						'Thời gian sạc',
						'Điện áp',
						'Nhiệt độ hoạt động',
					],
				},
				{
					name: 'Thông tin chung',
					children: [
						'Màn hình cảm ứng',
						'Số lượng micro',
						'Chống nước',
						'Wifi',
						'Bluetooth',
						'Hỗ trợ thẻ nhớ',
						'Kích thước',
						'Khối lượng',
						'Thương hiệu của',
						'Sản xuất tại',
						'Hãng',
					],
				},
			];

			const gimbalTypes = [
				'Kết nối',
				'Phạm vị góc quay',
				'Thời gian sử dụng',
				'Cổng sạc',
				'Loại pin',
				'Tiện ích',
				'Khối lượng',
				'Thương hiệu của',
				'Sản xuất tại',
				'Hãng',
			];

			const maychieuTypes = [
				{
					name: 'Tổng quan',
					children: [
						'Loại máy',
						'Độ phân giải',
						'Keystone điện tử',
						'Hỗ trợ độ phân giải',
						'Màn hình chiếu',
						'Công suất đèn chiếu',
						'Tuổi thọ đèn',
					],
				},
				{
					name: 'Công nghệ hình ảnh, âm thanh',
					children: [
						'Công nghệ hình ảnh',
						'Độ sáng',
						'Độ tương phản',
						'Công nghệ âm thanh',
						'Tổng công suất loa',
					],
				},
				{
					name: 'Kết nối',
					children: ['Bluetooth', 'Wifi', 'Cổng kết nối'],
				},
				{
					name: 'Tính năng thông minh',
					children: [
						'Hệ điều hành, giao diện',
						'Các ứng dụng sẵn có',
						'Các ứng dụng phổ biến có thể tải thêm',
						'Remote thông minh đi kèm',
						'Kết nối không dây với điện thoại, máy tính bảng',
						'Kết nối với bàn phím, chuột',
						'Tính năng thông minh khác',
					],
				},
				{
					name: 'Thông tin chung',
					children: [
						'Nguồn điện',
						'Kích thước - khối lượng',
						'Thương hiệu của',
						'Năm ra mắt',
						'Sản xuất tại',
						'Thời gian bảo hành',
						'Hãng',
					],
				},
			];

			const hubTypes = [
				'Model',
				'Chức năng',
				'Đầu ra',
				'Jack kết nối',
				'Công suất tối đa',
				'Kích thước',
				'Công nghệ/ Tiện ích',
				'Sản xuất tại',
				'Thương hiệu của',
				'Hãng',
			];

			const chuotmaytinhTypes = [
				'Tương thích',
				'Độ phân giải tối đa',
				'Cách kết nối',
				'Độ dài dây/ Khoảng cách kết nối',
				'Loại pin',
				'Khối lượng',
				'Thương hiệu của',
				'Sản xuất tại',
				'Hãng',
			];

			const banphimTypes = [
				'Tương thích',
				'Cách kết nối',
				'Độ dài dây/ Khoảng cách kết nối',
				'Kiểu bàn phím',
				'Số phím',
				'Chất liệu keycaps',
				'Pin',
				'Phần mềm hỗ trợ',
				'Kích thước',
				'Thương hiệu của',
				'Sản xuất tại',
				'Hãng',
			];

			const routerTypes = [
				'Băng tần mạng',
				'Loại thiết bị',
				'Tốc độ wifi',
				'Chuẩn mạng',
				'Số Anten',
				'Số user truy cập tối đa',
				'Mật độ phủ sóng',
				'Nút bấm hỗ trợ',
				'Kích thước',
				'Sản xuất tại',
				'Thương hiệu của',
				'Hãng',
			];

			const phanmemTypes = [
				'Loại phầm mềm/ Ứng dụng',
				'Hãng sản xuất',
				'Ngôn ngữ',
				'Tính năng cơ bản',
				'Tính năng nâng cao',
				'Tính năng khác',
				'Yêu cầu CPU',
				'Yêu cầu RAM',
				'Yêu cầu đồ họa',
				'Yêu cầu dung lượng đĩa trống',
				'Tương thích hệ điều hành',
				'Hãng',
			];

			const maytinhdebanTypes = [
				{
					name: 'Bộ xử lý',
					children: [
						'Công nghệ CPU',
						'Loại CPU',
						'Tốc độ CPU',
						'Tốc độ tối đa',
						'Số nhân - số luồng',
						'Bộ nhớ đệm',
						'Socket',
						'Chipset',
					],
				},
				{
					name: 'Bộ nhớ RAM, Ổ cứng',
					children: [
						'RAM',
						'Loại RAM',
						'Số khe RAM',
						'Tốc độ bus RAM',
						'Ổ cứng',
						'Chuẩn kết nối ổ cứng',
					],
				},
				{
					name: 'Mainboard',
					children: [
						'Model',
						'form Factor',
						'Socket',
						'CPU hỗ trợ',
						'Loại RAM hỗ trợ',
						'Tổng số khe RAM',
						'Tốc độ bus RAM hỗ trợ',
						'Tối đa RAM hỗ trợ',
						'Hỗ trợ thêm khe cắm SSD M.2/HDD',
						'Số khe cắm mở rộng',
						'Cổng I/O mặt sau',
						'Card đồ họa onboard',
						'Card đồ họa',
						'Công nghệ âm thanh',
					],
				},
				{
					name: 'CASE',
					children: [
						'Loại Case',
						'Hỗ trợ mainboard',
						'Cổng giao tiếp mặt trước',
						'Chất liệu',
						'Hỗ trợ ổ cứng tối đa',
						'Số lượng quạt kèm theo',
						'Hỗ trợ tản nhiệt nước',
					],
				},
				{
					name: 'Nguồn',
					children: ['Công suất'],
				},
				{
					name: 'Hệ điều hành',
					children: ['Hệ điều hành'],
				},
				{
					name: 'Kích thước & Khối lượng',
					children: ['Kích thước & Khối lượng'],
				},
			];

			const manhinhmaytinhTypes = [
				{
					name: 'Thông tin cấu hình',
					children: [
						'Loại màn hình',
						'Kích thước màn hình',
						'Độ phân giải',
						'Màn hình cảm ứng',
						'Tấm nền',
						'Tần số quét',
						'Thời gian đáp ứng',
						'Công nghệ màn hình',
						'Số lượng màu',
						'Độ sáng',
						'Độ tương phản tĩnh',
						'Góc nhìn',
					],
				},
				{
					name: 'Tiện tích và Cổng kết nối',
					children: [
						'Tích hợp loa',
						'Gắn ARM chuẩn VESA',
						'Tiện ích',
						'Cổng kết nối',
					],
				},
				{
					name: 'Công suất và Kích thước',
					children: [
						'Năm ra mắt',
						'Công suất tiêu thụ điện',
						'Kích thước (có chân đế)',
						'Khối lượng có chân đế',
						'Kích thước (không chân đế)',
						'Khối lượng (không chân đế)',
					],
				},
			];

			const maychoigameTypes = [
				{
					name: 'Bộ xử lý',
					children: [
						'Công nghệ CPU',
						'Số nhân',
						'Số luồng',
						'Tốc độ CPU',
						'Tốc độ tối đa',
					],
				},
				{
					name: 'Bộ nhớ RAM, Ổ cứng',
					children: [
						'RAM',
						'Loại RAM',
						'Tốc độ bus RAM',
						'Hỗ trợ RAM tối đa',
						'Ổ cứng',
					],
				},
				{
					name: 'Đồ họa và Âm thanh',
					children: ['Thiết kế card', 'Card màn hình'],
				},
				{
					name: 'Cổng kết nối & Tính năng mở rộng',
					children: ['Cổng giao tiếp', 'Giao tiếp mạng'],
				},
				{
					name: 'Kích thước & Khối lượng',
					children: ['Kích thước & Khối lượng'],
				},
				{
					name: 'Thông tin khác',
					children: ['Thời điểm ra mắt'],
				},
			];

			const mucinTypes = [
				'Nơi sản xuất',
				'Thương hiệu',
				'Máy in tương thích',
				'Số trang in tối đa',
			];

			const mayinTypes = [
				{
					name: 'Thông số',
					children: [
						'Loại máy',
						'Chức năng',
						'Chất lượng in',
						'Thời gian in trang đầu tiên',
						'Tốc độ in',
						'Hộp mực kèm theo in được',
						'Công suất in khuyến nghị',
						'Công suất in tối đa',
						'Loại mực in',
						'Bộ nhớ',
						'Màn hình hiển thị LCD',
						'Công nghệ tích hợp',
					],
				},
				{
					name: 'Giấy in',
					children: [
						'Kích thước giấy in hỗ trợ',
						'Loại giấy in hỗ trợ',
						'Khay chứa giấy đã in',
						'Khay nạp giấy',
					],
				},
				{
					name: 'Kết nối',
					children: [
						'Cổng kết nối',
						'Hệ điều hành tương thích',
						'Kết nối không dây',
					],
				},
				{
					name: 'Thông tin chung',
					children: [
						'Kích thước, khối lượng',
						'Công suất',
						'Nơi sản xuất',
						'Năm ra mắt',
						'Hãng',
					],
				},
			];

			const createAttributeValues = async (categoryId, types) => {
				if (!categoryId) return;
				if (
					Array.isArray(types) &&
					types.every((item) => typeof item === 'string')
				) {
					for (let type of types) {
						await queryInterface.bulkInsert(
							'AttributeTypes',
							[
								{
									name: type,
									categoryId,
									createdAt: new Date(),
									updatedAt: new Date(),
								},
							],
							{ transaction },
						);
					}
				} else {
					for (let type of types) {
						const { name, children } = type;
						const parentValue = await queryInterface.bulkInsert(
							'AttributeTypes',
							[
								{
									name,
									categoryId,
									createdAt: new Date(),
									updatedAt: new Date(),
								},
							],
							{ transaction },
						);

						for (let child of children) {
							await queryInterface.bulkInsert(
								'AttributeTypes',
								[
									{
										name: child,
										parentId: parentValue,
										createdAt: new Date(),
										updatedAt: new Date(),
									},
								],
								{ transaction },
							);
						}
					}
				}
			};

			await Promise.all([
				createAttributeValues(laptopId, laptopTypes),
				createAttributeValues(dienthoaiId, dienthoaiTypes),
				createAttributeValues(smartwatchId, smartwatchTypes),
				createAttributeValues(tabletId, tabletTypes),
				createAttributeValues(donghoId, donghoTypes),
				createAttributeValues(sacduphongId, sacduphongTypes),
				createAttributeValues(sacCapId, sacCapTypes),
				createAttributeValues(oplungdienthoaiId, oplungdienthoaiTypes),
				createAttributeValues(
					oplungmaytinhbangId,
					oplungmaytinhbangTypes,
				),
				createAttributeValues(miengdanmanhinhId, miengdanmanhinhTypes),
				createAttributeValues(miengdancameraId, miengdancameraTypes),
				createAttributeValues(tuidungairpodsId, tuidungairpodsTypes),
				createAttributeValues(airtagId, airtagTypes),
				createAttributeValues(buttabletId, buttabletTypes),
				createAttributeValues(daydonghoId, daydonghoTypes),
				createAttributeValues(
					tainghebluetoothId,
					tainghebluetoothTypes,
				),
				createAttributeValues(tainghedayId, tainghedayTypes),
				createAttributeValues(tainghechuptaiId, tainghechuptaiTypes),
				createAttributeValues(tainghethethaoId, tainghethethaoTypes),
				createAttributeValues(loaId, loaTypes),
				createAttributeValues(microId, microTypes),
				createAttributeValues(cameratrongnhaId, cameratrongnhaTypes),
				createAttributeValues(camerangoaitroiId, camerangoaitroiTypes),
				createAttributeValues(flycamId, flycamTypes),
				createAttributeValues(camerahanhtrinhId, camerahanhtrinhTypes),
				createAttributeValues(gimbalId, gimbalTypes),
				createAttributeValues(maychieuId, maychieuTypes),
				createAttributeValues(hubId, hubTypes),
				createAttributeValues(chuotmaytinhId, chuotmaytinhTypes),
				createAttributeValues(banphimId, banphimTypes),
				createAttributeValues(routerId, routerTypes),
				createAttributeValues(phanmemId, phanmemTypes),
				createAttributeValues(maytinhdebanId, maytinhdebanTypes),
				createAttributeValues(maychoigameId, maychoigameTypes),
				createAttributeValues(mucinId, mucinTypes),
				createAttributeValues(mayinId, mayinTypes),
				// createAttributeValues(manhinhmaytinhId, manhinhmaytinhTypes),
			]);

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			console.error('Error while inserting categories:', error);
		}
	},

	async down(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.bulkDelete('AttributeTypes', null, {
				transaction,
			});
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			console.error('Error while deleting categories:', error);
		}
	},
};
