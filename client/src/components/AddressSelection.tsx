import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, X } from 'lucide-react';

type Province = {
    id: string;
    name: string;
};

type District = {
    id: string;
    name: string;
    provinceId: string;
};

type Ward = {
    id: string;
    name: string;
    districtId: string;
};

// Mock data for provinces
const provinces: Province[] = [
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
const districts: District[] = [
    { id: '1', name: 'Quận Đống Đa', provinceId: '2' },
    { id: '2', name: 'Quận Ba Đình', provinceId: '2' },
    { id: '3', name: 'Quận Hoàn Kiếm', provinceId: '2' },
    { id: '4', name: 'Quận Hai Bà Trưng', provinceId: '2' },
    { id: '5', name: 'Quận Cầu Giấy', provinceId: '2' },
];

// Mock data for wards in Đống Đa
const wards: Ward[] = [
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

// Address Selection Modal Component
const AddressSelection: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddressSelected: (address: { province: string; district: string; ward: string }) => void;
}> = ({ isOpen, onClose, onAddressSelected }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'province' | 'district' | 'ward'>('province');
    const [selectedProvince, setSelectedProvince] = useState<Province | null>({ id: '2', name: 'Hà Nội' });
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>({ id: '1', name: 'Quận Đống Đa', provinceId: '2' });
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowAnimation(true);
        } else {
            setShowAnimation(false);
        }
    }, [isOpen]);

    // Filter items based on search query
    const filteredProvinces = searchQuery
        ? provinces.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : provinces;

    const filteredDistricts = searchQuery
        ? districts.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : districts;

    const filteredWards = searchQuery
        ? wards.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : wards;

    const handleProvinceSelect = (province: Province) => {
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setActiveTab('district');
        setSearchQuery('');
    };

    const handleDistrictSelect = (district: District) => {
        setSelectedDistrict(district);
        setSelectedWard(null);
        setActiveTab('ward');
        setSearchQuery('');
    };

    const handleWardSelect = (ward: Ward) => {
        setSelectedWard(ward);
        if (selectedProvince && selectedDistrict) {
            onAddressSelected({
                province: selectedProvince.name,
                district: selectedDistrict.name,
                ward: ward.name
            });
            onClose();
        }
    };

    const handleBack = () => {
        if (activeTab === 'district') {
            setActiveTab('province');
        } else if (activeTab === 'ward') {
            setActiveTab('district');
        }
        setSearchQuery('');
    };

    const modalStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            transition: 'opacity 0.2s ease-in-out',
            opacity: showAnimation ? 1 : 0
        },
        modal: {
            transform: showAnimation ? 'translateY(0)' : 'translateY(20px)',
            transition: 'transform 0.3s ease-in-out',
            opacity: showAnimation ? 1 : 0
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={modalStyles.overlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="bg-white w-full max-w-xl md:max-w-2xl lg:max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
                style={modalStyles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center p-4 border-b">
                    <button
                        onClick={handleBack}
                        className={`mr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 ${activeTab === 'province' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                        disabled={activeTab === 'province'}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-lg font-semibold text-center flex-1">Chọn địa chỉ nhận hàng</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Current selection */}
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                    <p className="text-blue-800 font-medium">
                        {selectedProvince?.name || ''}
                        {selectedDistrict ? ` › ${selectedDistrict.name}` : ''}
                        {selectedWard ? ` › ${selectedWard.name}` : ''}
                    </p>
                </div>

                {/* Search input */}
                <div className="p-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Tìm nhanh tỉnh thành, quận huyện, phường xã"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={() => setSearchQuery('')}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 pt-2 pb-1 text-center text-gray-500 text-sm">
                    Hoặc chọn
                </div>

                <div className="flex border-b">
                    <button
                        className={`flex-1 py-3 font-medium transition-all duration-200 ${activeTab === 'province' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('province')}
                    >
                        Tỉnh/TP
                    </button>
                    <button
                        className={`flex-1 py-3 font-medium transition-all duration-200 ${activeTab === 'district' ? 'text-blue-600 border-b-2 border-blue-600' : selectedProvince ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 cursor-not-allowed'}`}
                        onClick={() => selectedProvince && setActiveTab('district')}
                        disabled={!selectedProvince}
                    >
                        Quận/Huyện
                    </button>
                    <button
                        className={`flex-1 py-3 font-medium transition-all duration-200 ${activeTab === 'ward' ? 'text-blue-600 border-b-2 border-blue-600' : selectedDistrict ? 'text-gray-500 hover:text-gray-700' : 'text-gray-300 cursor-not-allowed'}`}
                        onClick={() => selectedDistrict && setActiveTab('ward')}
                        disabled={!selectedDistrict}
                    >
                        Phường/Xã
                    </button>
                </div>

                {/* Content based on active tab */}
                <div className="overflow-y-auto h-64 bg-gray-50">
                    {activeTab === 'province' && (
                        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                            {filteredProvinces.length > 0 ? (
                                filteredProvinces.map((province) => (
                                    <button
                                        key={province.id}
                                        onClick={() => handleProvinceSelect(province)}
                                        className="p-4 text-left hover:bg-blue-50 transition-colors duration-150 border-l border-t border-gray-100"
                                    >
                                        <span className={selectedProvince?.id === province.id ? 'font-medium text-blue-600' : ''}>
                                            {province.name}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 p-6 text-center text-gray-500">
                                    Không tìm thấy tỉnh/thành phố nào phù hợp
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'district' && (
                        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                            {filteredDistricts.length > 0 ? (
                                filteredDistricts.map((district) => (
                                    <button
                                        key={district.id}
                                        onClick={() => handleDistrictSelect(district)}
                                        className="p-4 text-left hover:bg-blue-50 transition-colors duration-150 border-l border-t border-gray-100"
                                    >
                                        <span className={selectedDistrict?.id === district.id ? 'font-medium text-blue-600' : ''}>
                                            {district.name}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 p-6 text-center text-gray-500">
                                    {searchQuery ? 'Không tìm thấy quận/huyện nào phù hợp' : 'Không có quận/huyện nào cho tỉnh/thành phố đã chọn'}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'ward' && (
                        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                            {filteredWards.length > 0 ? (
                                filteredWards.map((ward) => (
                                    <button
                                        key={ward.id}
                                        onClick={() => handleWardSelect(ward)}
                                        className="p-4 text-left hover:bg-blue-50 transition-colors duration-150 border-l border-t border-gray-100"
                                    >
                                        <span className={selectedWard?.id === ward.id ? 'font-medium text-blue-600' : ''}>
                                            {ward.name}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 p-6 text-center text-gray-500">
                                    {searchQuery ? 'Không tìm thấy phường/xã nào phù hợp' : 'Không có phường/xã nào cho quận/huyện đã chọn'}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressSelection;