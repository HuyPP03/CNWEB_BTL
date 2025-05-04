import { District, Province, Ward } from "../types/location";

// Mock data for provinces
export const provinces: Province[] = [
    { id: '1', name: 'Hồ Chí Minh' },
    { id: '2', name: 'Hà Nội' },
    { id: '3', name: 'Đà Nẵng' },
    { id: '4', name: 'An Giang' },
    { id: '5', name: 'Bà Rịa - Vũng Tàu' },
    { id: '6', name: 'Bắc Giang' },
    { id: '7', name: 'Bắc Kạn' },
    { id: '8', name: 'Bạc Liêu' },
    { id: '9', name: 'Bắc Ninh' },
    { id: '10', name: 'Bến Tre' },
    { id: '11', name: 'Bình Định' },
    { id: '12', name: 'Bình Dương' },
    { id: '13', name: 'Bình Phước' },
    { id: '14', name: 'Bình Thuận' },
    { id: '15', name: 'Cà Mau' },
    { id: '16', name: 'Cần Thơ' },
    { id: '17', name: 'Cao Bằng' },
    { id: '18', name: 'Đắk Lắk' },
];

// Mock data for districts in Hà Nội
export const districts: District[] = [
    { id: '1', name: 'Quận Đống Đa', provinceId: '2' },
    { id: '2', name: 'Quận Ba Đình', provinceId: '2' },
    { id: '3', name: 'Quận Hoàn Kiếm', provinceId: '2' },
    { id: '4', name: 'Quận Hai Bà Trưng', provinceId: '2' },
    { id: '5', name: 'Quận Cầu Giấy', provinceId: '2' },
];

// Mock data for wards in Đống Đa
export const wards: Ward[] = [
    { id: '1', name: 'Phường Cát Linh', districtId: '1' },
    { id: '2', name: 'Phường Hàng Bột', districtId: '1' },
    { id: '3', name: 'Phường Khâm Thiên', districtId: '1' },
    { id: '4', name: 'Phường Khương Thượng', districtId: '1' },
    { id: '5', name: 'Phường Kim Liên', districtId: '1' },
    { id: '6', name: 'Phường Láng Hạ', districtId: '1' },
    { id: '7', name: 'Phường Láng Thượng', districtId: '1' },
    { id: '8', name: 'Phường Nam Đồng', districtId: '1' },
    { id: '9', name: 'Phường Ngã Tư Sở', districtId: '1' },
    { id: '10', name: 'Phường Ô Chợ Dừa', districtId: '1' },
    { id: '11', name: 'Phường Phương Liên', districtId: '1' },
    { id: '12', name: 'Phường Phương Liên - Trung Tự', districtId: '1' },
    { id: '13', name: 'Phường Phương Mai', districtId: '1' },
    { id: '14', name: 'Phường Quang Trung', districtId: '1' },
    { id: '15', name: 'Phường Thịnh Quang', districtId: '1' },
    { id: '16', name: 'Phường Thổ Quan', districtId: '1' },
    { id: '17', name: 'Phường Trung Liệt', districtId: '1' },
    { id: '18', name: 'Phường Trung Phụng', districtId: '1' },
];
