/**
 * Map từ slug của danh mục sang ID trong database
 * Được sử dụng để chuyển đổi từ URL path sang ID cần thiết cho API call
 */
export const slugToIdMap: Record<string, number> = {
    // Danh mục chính
    'smartphone': 1,      // Điện thoại
    'laptop': 2,          // Laptop
    'phu-kien': 3,        // Phụ kiện
    'smartwatch': 4,      // Smartwatch
    'dong-ho': 5,         // Đồng hồ
    'tablet': 6,          // Tablet
    'man-hinh-may-in': 7, // Màn hình, Máy in
    'may-in': 45,         // Máy in
    'camera': 46,         // Camera
    'thiet-bi-giam-sat': 47, // Thiết bị giám sát
    'tai-nghe': 48,       // Tai nghe

    // Phụ kiện (Danh mục con của Phụ kiện)
    'phu-kien-di-dong': 8,    // Phụ kiện di động
    'thiet-bi-am-thanh': 9,   // Thiết bị âm thanh
    'camera-flycam-gimbal': 10, // Camera / Flycam / Gimbal
    'phu-kien-laptop': 11,    // Phụ kiện laptop

    // Phụ kiện di động
    'sac-du-phong': 12,       // Sạc dự phòng
    'sac-cap': 13,            // Sạc, cáp
    'op-lung-dien-thoai': 14, // Ốp lưng điện thoại
    'op-lung-may-tinh-bang': 15, // Ốp lưng máy tính bảng
    'mieng-dan-man-hinh': 16, // Miếng dán màn hình
    'mieng-dan-camera': 17,   // Miếng dán Camera
    'tui-dung-airpods': 18,   // Túi đựng AirPods
    'airtag-vo-bao-ve': 19,   // AirTag, Vỏ bảo vệ AirTag
    'but-tablet': 20,         // Bút tablet
    'day-dong-ho': 21,        // Dây đồng hồ

    // Thiết bị âm thanh
    'tai-nghe-bluetooth': 22, // Tai nghe Bluetooth
    'tai-nghe-day': 23,       // Tai nghe dây
    'tai-nghe-chup-tai': 24,  // Tai nghe chụp tai
    'tai-nghe-the-thao': 25,  // Tai nghe thể thao
    'loa': 26,                // Loa
    'micro': 27,              // Micro

    // Camera / Flycam / Gimbal
    'camera-trong-nha': 28,   // Camera trong nhà
    'camera-ngoai-troi': 29,  // Camera ngoài trời
    'flycam': 30,             // Flycam
    'camera-hanh-trinh': 31,  // Camera hành trình
    'gimbal': 32,             // Gimbal
    'may-chieu': 33,          // Máy chiếu

    // Phụ kiện laptop
    'hub-cap-chuyen-doi': 34, // Hub, cáp chuyển đổi
    'chuot-may-tinh': 35,     // Chuột máy tính
    'ban-phim': 36,           // Bàn phím
    'router-thiet-bi-mang': 37, // Router - Thiết bị mạng
    'balo-tui-chong-soc': 38, // Balo, túi chống sốc
    'phan-mem': 39,           // Phần mềm

    // Màn hình, Máy in
    'pc-man-hinh': 40,        // PC, Màn hình
    'may-in-muc-in': 41,      // Máy in, Mực in

    // PC, Màn hình
    'may-tinh-de-ban': 42,    // Máy tính để bàn
    'man-hinh-may-tinh': 43,  // Màn hình máy tính
    'may-choi-game': 44,      // Máy chơi game

};

/**
 * Map từ ID danh mục sang slug để sử dụng trong việc tạo URL
 */
export const idToSlugMap: Record<number, string> = Object.entries(slugToIdMap).reduce(
    (acc, [slug, id]) => ({
        ...acc,
        [id]: slug
    }),
    {}
);

/**
 * Chuyển đổi từ slug sang ID danh mục
 * @param slug Slug của danh mục trong URL
 * @returns ID của danh mục nếu tồn tại, undefined nếu không tìm thấy
 */
export function getIdFromSlug(slug: string): number | undefined {
    return slugToIdMap[slug];
}

/**
 * Chuyển đổi từ ID sang slug danh mục
 * @param id ID của danh mục 
 * @returns Slug của danh mục nếu tồn tại, undefined nếu không tìm thấy
 */
export function getSlugFromId(id: number): string | undefined {
    return idToSlugMap[id];
}

/**
 * Lấy ra đường dẫn URL đầy đủ cho một danh mục dựa trên ID
 * @param id ID của danh mục
 * @returns URL path đầy đủ cho danh mục, hoặc '/' nếu không tìm thấy
 */
export function getCategoryUrl(id: number): string {
    const slug = getSlugFromId(id);
    return slug ? `/${slug}` : '/';
}

