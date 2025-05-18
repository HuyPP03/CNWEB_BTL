export const mainCategories = [
    { name: 'Điện thoại', path: '/smartphone', icon: 'phone' },
    { name: 'Laptop', path: '/laptop', icon: 'laptop' },
    { name: 'Phụ kiện', path: '/phu-kien', icon: 'accessories', hasDropdown: true },
    { name: 'Smartwatch', path: '/smartwatch', icon: 'watch' },
    { name: 'Đồng hồ', path: '/dong-ho', icon: 'clock' },
    { name: 'Tablet', path: '/tablet', icon: 'tablet' },
    { name: 'Màn hình, Máy in', path: '/man-hinh-may-in', icon: 'monitor', hasDropdown: true },
    { name: 'Camera', path: '/camera', icon: 'camera' },
    { name: 'Thiết bị giám sát', path: '/thiet-bi-giam-sat', icon: 'cctv' },
    { name: 'Máy in', path: '/may-in', icon: 'printer' },
];
export const accessoriesCategories = [
    {
        title: 'Phụ kiện di động',
        items: [
            { name: 'Sạc dự phòng', path: '/sac-du-phong', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/99/61/9961578164909f8a9ee7678dc95feeb0.png' },
            { name: 'Sạc, cáp', path: '/sac-cap', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/6b/64/6b646ec5f1e9a726933ee31b86a32524.png' },
            { name: 'Ốp lưng điện thoại', path: '/op-lung-dien-thoai', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/34/02/3402dd9ba3457b84482572d10bcae84e.png' },
            { name: 'Ốp lưng máy tính bảng', path: '/op-lung-may-tinh-bang', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/83/60/836050bcf5e1c92dd8d9899bef9f039d.png' },
            { name: 'Miếng dán màn hình', path: '/mieng-dan-man-hinh', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/72/f4/72f4b3ee8f5c1b1a170d590b3a07256d.png' },
            { name: 'Miếng dán Camera', path: '/mieng-dan-camera', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/33/77/33770e364079ac9dd3888190bd574b8d.png' },
            { name: 'Túi đựng AirPods', path: '/tui-dung-airpods', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/24/66/2466de3fc4831f43afb0d69462130030.png' },
            { name: 'AirTag, Vỏ bảo vệ', path: '/airtag-vo-bao-ve', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/27/e7/27e7538fb93c10e768cd0344ee8f8cd9.png' },
            { name: 'Bút tablet', path: '/but-tablet', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/3f/d5/3fd5723ac6f01521bd3d768d8ebc8d1a.png' },
            { name: 'Dây đồng hồ', path: '/day-dong-ho', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/57/0a/570af01ac292e21788f3604443e9dacb.png' },
        ]
    },
    {
        title: 'Thiết bị âm thanh',
        items: [
            { name: 'Tai nghe Bluetooth', path: '/tai-nghe-bluetooth', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/7c/09/7c09cbc92ef23816aa7d857ba8e0e194.png' },
            { name: 'Tai nghe dây', path: '/tai-nghe-day', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/12/1c/121cd7cb1fc1750893b3f41436b12c85.png' },
            { name: 'Tai nghe chụp tai', path: '/tai-nghe-chup-tai', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/cf/9e/cf9e0eecbfc3e326f1c89f13b1ffe320.png' },
            { name: 'Tai nghe thể thao', path: '/tai-nghe-the-thao', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/38/f7/38f7bf684502b5aa0c7949f6d38a6a55.png' },
            { name: 'Loa', path: '/loa', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/76/6b/766be9586a3a82491ba8106b7e558605.png' },
            { name: 'Micro', path: '/micro', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/ef/8f/ef8f2cca70f8de64c42e885b7038ba57.png' },
        ]
    },
    {
        title: 'Camera / Flycam / Gimbal',
        items: [
            { name: 'Camera trong nhà', path: '/camera-trong-nha', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/33/b9/33b9d8aeac5d4f67d759abaa5f60661e.png' },
            { name: 'Camera ngoài trời', path: '/camera-ngoai-troi', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/9e/e9/9ee9ae20f38eff97221f040a735752ce.png' },
            { name: 'Flycam', path: '/flycam', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/b7/bc/b7bceecb5bd6f63aeee395d33d7bbcd4.png' },
            { name: 'Camera hành trình', path: '/camera-hanh-trinh', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/f4/2a/f42aa8a01e29d247b177a997c808c990.png' },
            { name: 'Gimbal', path: '/gimbal', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/5a/a6/5aa6b91c9b77a1fb2ae9fe951485b2e4.png' },
            { name: 'Máy chiếu', path: '/may-chieu', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/52/5e/525e9344cd12cc2ac93344be9125895a.png' },
        ]
    },
    {
        title: 'Phụ kiện laptop',
        items: [
            { name: 'Hub, cáp chuyển đổi', path: '/hub-cap-chuyen-doi', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/e1/2d/e12deafa7615646e9cafc5bbd0667da8.png' },
            { name: 'Chuột máy tính', path: '/chuot-may-tinh', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/53/a6/53a6599a6fc414025b42c5435928008f.png' },
            { name: 'Bàn phím', path: '/ban-phim', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/7a/d3/7ad3598d5e291815bc6c7f98bb73d078.png' },
            { name: 'Router - Thiết bị mạng', path: '/router-thiet-bi-mang', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/6a/89/6a8967067fa273d7fd89b7bfa002f4ad.png' },
            { name: 'Balo, túi chống sốc', path: '/balo-tui-chong-soc', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/33/8b/338bb7d3763dee703562a108b497fc2f.png' },
            { name: 'Phần mềm', path: '/phan-mem', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/bb/07/bb07512d2429a1b38cedd20b750b734c.png' },
        ]
    },
    {
        title: 'Thương hiệu hàng đầu',
        items: [
            { name: 'Apple', path: '/thuong-hieu/apple', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/6a/6a/6a6a116227ceaf2f407f5573f44069ec.png' },
            { name: 'Samsung', path: '/thuong-hieu/samsung', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/ea/1d/ea1d0470faaea58604610926a4f45fcb.png' },
            { name: 'Imou', path: '/thuong-hieu/imou', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/ee/a1/eea14df76a63a0f6b9f3267143856602.png' },
            { name: 'Baseus', path: '/thuong-hieu/baseus', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/0a/bd/0abddded6e3650bcd1859c511fcc2747.png' },
            { name: 'JBL', path: '/thuong-hieu/jbl', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/be/88/be887406c072668c452a41be86574976.png' },
            { name: 'Anker', path: '/thuong-hieu/anker', image: 'https://cdnv2.tgdd.vn/mwg-static/common/Common/67/bd/67bd9cf55ca10673bf3df7605e295bb4.png' },
        ]
    },
];