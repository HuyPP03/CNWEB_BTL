import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from '../data/products';
import { Product as ProductType } from '../components/ProductCard';
import {
    ChevronRight, ChevronDown, Star, Check, Heart, Phone,
    ShoppingCart, ShoppingBag, Gift, Shield, Truck
} from 'lucide-react';

// Types
interface ProductImage {
    id: number;
    url: string;
    alt: string;
}

interface ProductSpec {
    name: string;
    value: string | number;
}

interface ProductPromotion {
    id: number;
    description: string;
    code?: string;
}

interface ProductWarranty {
    period: string;
    description: string;
}

interface RatingDistribution {
    rating: number;
    percentage: number;
}

interface FullProductDetails {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviewCount: number;
    ratingDistribution: RatingDistribution[];
    images: ProductImage[];
    specs: Record<string, ProductSpec[]>;
    promotions: ProductPromotion[];
    warranty: ProductWarranty;
    inStock: boolean;
    description: string;
}

// Sample data for detailed product information
const sampleDetailedInfo = {
    images: [
        { id: 1, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-1-638682285745176008-750x500.jpg", alt: "MacBook Pro 14 inch front view" },
        { id: 2, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-2-638682285755776945-750x500.jpg", alt: "MacBook Pro 14 inch side view" },
        { id: 3, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-3-638682285761712519-750x500.jpg", alt: "MacBook Pro 14 inch back view" },
        { id: 4, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-4-638682285767856306-750x500.jpg", alt: "MacBook Pro 14 inch keyboard" },
        { id: 5, url: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/332448/macbook-pro-14-nano-m4-16-512-den-tgdd-5-638682285776811668-750x500.jpg", alt: "MacBook Pro 14 inch ports" },
    ],
    specs: {
        "cấu hình chi tiết": [
            { name: "CPU", value: "Apple M4 Pro 12 nhân" },
            { name: "RAM", value: "36GB" },
            { name: "Ổ cứng", value: "1TB SSD" },
            { name: "Màn hình", value: "14.2 inch, Liquid Retina XDR display (3024 x 1964)" },
            { name: "Card màn hình", value: "Apple M4 Pro 20 core GPU" },
            { name: "Cổng kết nối", value: "3 x Thunderbolt 4, HDMI, jack tai nghe 3.5 mm, SD card slot" },
            { name: "Hệ điều hành", value: "macOS 14 Sequoia" },
            { name: "Thiết kế", value: "Vỏ kim loại nguyên khối" },
            { name: "Kích thước", value: "31.26 x 22.12 x 1.55 cm" },
            { name: "Trọng lượng", value: "1.55 kg" },
            { name: "Thời điểm ra mắt", value: "2024" },
        ],
        "thiết kế & trọng lượng": [
            { name: "Chất liệu", value: "Nhôm tái chế" },
            { name: "Kích thước", value: "31.26 x 22.12 x 1.55 cm" },
            { name: "Trọng lượng", value: "1.55 kg" },
            { name: "Màu sắc", value: "Space Black (Đen)" },
        ],
        "pin & sạc": [
            { name: "Dung lượng pin", value: "70Whr" },
            { name: "Công nghệ pin", value: "Lithium polymer" },
            { name: "Thời gian sử dụng", value: "Lên đến 18 giờ" },
            { name: "Công suất sạc", value: "96W" },
            { name: "Cổng sạc", value: "MagSafe 3" },
        ],
    },
    promotions: [
        { id: 1, description: "Tặng Balo Laptop trị giá 790.000₫" },
        { id: 2, description: "Giảm 100.000₫ khi mua kèm Office Home & Student" },
        { id: 3, description: "Nhập mã VNPAY giảm thêm đến 200.000₫ khi thanh toán qua VNPAY-QR", code: "VNPAYTGDD" },
        { id: 4, description: "Trả góp 0% qua thẻ tín dụng" },
    ],
    warranty: {
        period: "12 tháng",
        description: "Bảo hành chính hãng tại các trung tâm bảo hành Apple"
    },
    inStock: true,
    description: `
<h3>Hiệu năng đột phá mọi giới hạn</h3>
<p>Apple M4 Pro là bộ vi xử lý hiện đại nhất của Apple, được thiết kế riêng cho dòng MacBook Pro, mang đến hiệu suất ấn tượng cho các công việc đòi hỏi sức mạnh xử lý cao như biên tập video 4K, phát triển ứng dụng, thiết kế đồ họa 3D và nhiều tác vụ phức tạp khác.</p>
<p>Với 12 nhân CPU (8 nhân hiệu suất cao và 4 nhân tiết kiệm điện), 20 nhân GPU và 16 nhân Neural Engine, M4 Pro mang đến hiệu suất vượt trội so với thế hệ trước đến 50% về khả năng xử lý và 40% về khả năng đồ họa.</p>
<img src="https://cdn.tgdd.vn/Products/Images/44/331568/macbook-pro-14-inch-m4-pro-den-6.jpg" alt="Apple M4 Pro Performance" />

<h3>Màn hình Liquid Retina XDR - Trải nghiệm hình ảnh đỉnh cao</h3>
<p>MacBook Pro 14 inch được trang bị màn hình Liquid Retina XDR với độ phân giải 3024 x 1964, hỗ trợ đầy đủ công nghệ ProMotion với tần số quét lên đến 120Hz, mang đến trải nghiệm cuộn trang mượt mà và phản hồi nhanh chóng.</p>
<p>Độ sáng tối đa lên đến 1600 nits khi xem nội dung HDR giúp hiển thị hình ảnh sống động, chi tiết với dải màu rộng P3 và công nghệ True Tone tự động điều chỉnh nhiệt độ màu phù hợp với môi trường xung quanh.</p>

<h3>Thời lượng pin ấn tượng</h3>
<p>Mặc dù sở hữu sức mạnh vượt trội, MacBook Pro 14 inch vẫn mang đến thời lượng sử dụng lên đến 18 giờ cho việc duyệt web không dây và 22 giờ cho việc xem phim trên Apple TV, cho phép bạn làm việc cả ngày mà không cần sạc pin.</p>

<h3>Kết nối đa dạng và tiện lợi</h3>
<p>MacBook Pro 14 inch được trang bị đầy đủ các cổng kết nối cần thiết: 3 cổng Thunderbolt 4, cổng HDMI, khe thẻ nhớ SDXC, jack tai nghe 3.5mm và cổng sạc MagSafe 3, mang đến sự tiện lợi tối đa cho người dùng chuyên nghiệp.</p>

<h3>Bàn phím và TouchID</h3>
<p>Bàn phím Magic Keyboard với hành trình phím thoải mái, độ nảy tốt cùng công nghệ cảm biến vân tay TouchID giúp mở khóa máy và thanh toán trực tuyến an toàn, nhanh chóng. Touchpad Force Touch rộng rãi với nhiều thao tác đa điểm và phản hồi xúc giác chính xác.</p>
    `
};

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeSpecTab, setActiveSpecTab] = useState<string>("cấu hình chi tiết");
    const [activeTab, setActiveTab] = useState<'mô tả' | 'thông số' | 'đánh giá'>('mô tả');
    const [isSpecCollapsed, setIsSpecCollapsed] = useState(true);

    // Fetch product based on ID
    useEffect(() => {
        if (id) {
            const productId = parseInt(id, 10);
            const foundProduct = mockProducts.find(p => p.id === productId);
            if (foundProduct) {
                setProduct(foundProduct);
            }
        }
    }, [id]);

    // Fallback product for when no ID is provided
    useEffect(() => {
        if (!id && mockProducts.length > 0) {
            setProduct(mockProducts[0]);
        }
    }, [id]);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
    };

    // Related products (can be of the same category or brand)
    const relatedProducts = mockProducts
        .filter(p => product ? (p.category === product.category && p.id !== product.id) : true)
        .slice(0, 5);

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 pb-10">
            {/* Breadcrumb */}
            <div className="bg-white py-2 shadow-sm mb-4">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center text-sm text-gray-500">
                        <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                        <ChevronRight className="mx-1" size={14} />
                        <Link to={`/category/${product.category}`} className="hover:text-blue-600">
                            {product.category === 'laptop' ? 'Laptop' :
                                product.category === 'smartphone' ? 'Điện thoại' :
                                    product.category === 'smartwatch' ? 'Đồng hồ thông minh' :
                                        product.category === 'audio' ? 'Tai nghe' :
                                            product.category}
                        </Link>
                        <ChevronRight className="mx-1" size={14} />
                        <Link to={`/brand/${product.brand.toLowerCase()}`} className="hover:text-blue-600">{product.brand}</Link>
                        <ChevronRight className="mx-1" size={14} />
                        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Product title - Mobile view */}
                <h1 className="text-xl font-bold text-gray-900 mb-2 md:hidden">{product.name}</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                    {/* Left column - Image gallery - Now 8/12 instead of 5/12 */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-lg p-4 mb-4">
                            {/* Product title - Desktop view */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-4 hidden md:block">{product.name}</h1>

                            <div className="relative bg-white rounded-lg overflow-hidden mb-4">
                                <div className="aspect-w-1 aspect-h-1">
                                    <img
                                        src={sampleDetailedInfo.images[selectedImageIndex].url}
                                        alt={sampleDetailedInfo.images[selectedImageIndex].alt}
                                        className="w-full h-auto object-contain"
                                    />
                                </div>

                                {/* Discount badge */}
                                {product.originalPrice > product.price && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                        Giảm {formatCurrency(product.originalPrice - product.price)}
                                    </div>
                                )}
                            </div>

                            {/* Image thumbnails */}
                            <div className="grid grid-cols-5 gap-2">
                                {sampleDetailedInfo.images.map((image, idx) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`border rounded-md overflow-hidden ${selectedImageIndex === idx ? 'border-blue-500' : 'border-gray-200'}`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Specifications overview - Mobile only */}
                        <div className="bg-white rounded-lg p-4 mb-4 lg:hidden">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-lg">Thông số kỹ thuật</h3>
                                <button
                                    onClick={() => setIsSpecCollapsed(!isSpecCollapsed)}
                                    className="text-blue-500 flex items-center text-sm"
                                >
                                    {isSpecCollapsed ? 'Xem cấu hình chi tiết' : 'Thu gọn'}
                                    <ChevronDown className={`ml-1 transition-transform ${isSpecCollapsed ? '' : 'rotate-180'}`} size={18} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex">
                                    <span className="text-gray-500 w-32">CPU:</span>
                                    <span className="text-gray-900 font-medium">{product.specs.processor}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-32">RAM:</span>
                                    <span className="text-gray-900 font-medium">{product.specs.ram}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-32">Ổ cứng:</span>
                                    <span className="text-gray-900 font-medium">{product.specs.storage}</span>
                                </div>

                                {/* Only shown when expanded */}
                                {!isSpecCollapsed && (
                                    <div className="pt-2 border-t border-gray-100">
                                        {sampleDetailedInfo.specs['cấu hình chi tiết'].slice(3).map((spec, idx) => (
                                            <div key={idx} className="flex py-1">
                                                <span className="text-gray-500 w-32">{spec.name}:</span>
                                                <span className="text-gray-900 font-medium">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Technical specs - Desktop only - Moved from right column to left for better layout */}
                        <div className="bg-white rounded-lg p-4 mb-4 hidden lg:block">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-lg">Thông số kỹ thuật</h3>
                                <button
                                    onClick={() => setIsSpecCollapsed(!isSpecCollapsed)}
                                    className="text-blue-500 flex items-center text-sm"
                                >
                                    {isSpecCollapsed ? 'Xem cấu hình chi tiết' : 'Thu gọn'}
                                    <ChevronDown className={`ml-1 transition-transform ${isSpecCollapsed ? '' : 'rotate-180'}`} size={18} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Always visible specs */}
                                {sampleDetailedInfo.specs['cấu hình chi tiết'].slice(0, isSpecCollapsed ? 5 : undefined).map((spec, idx) => (
                                    <div key={idx} className={`flex ${idx % 2 === 0 ? 'bg-gray-50' : ''} py-2 px-3 rounded`}>
                                        <span className="text-gray-500 w-1/3">{spec.name}:</span>
                                        <span className="text-gray-900 font-medium">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column - Product info - Now 4/12 instead of 7/12 */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-lg p-4 mb-4">
                            {/* Price */}
                            <div className="mb-4">
                                <div className="flex items-end">
                                    <h2 className="text-3xl font-bold text-red-600">{formatCurrency(product.price)}</h2>
                                    {product.originalPrice > product.price && (
                                        <div className="flex items-center ml-3">
                                            <p className="text-gray-500 line-through">{formatCurrency(product.originalPrice)}</p>
                                            <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-1.5 py-0.5 rounded">
                                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center mt-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                fill={star <= product.rating ? "#FFC107" : "none"}
                                                color={star <= product.rating ? "#FFC107" : "#E5E7EB"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500 ml-2">{product.reviews} đánh giá</span>
                                </div>
                            </div>

                            {/* Color options */}
                            {product.category === 'smartphone' || product.category === 'laptop' && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-700 mb-2">Màu sắc</h3>
                                    <div className="flex space-x-2">
                                        <button className="border-2 border-blue-500 p-1 rounded-full">
                                            <div className="w-8 h-8 bg-black rounded-full"></div>
                                        </button>
                                        <button className="border-2 border-transparent p-1 rounded-full">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        </button>
                                        <button className="border-2 border-transparent p-1 rounded-full">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Storage options - for applicable products */}
                            {(product.category === 'smartphone' || product.category === 'laptop') && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-700 mb-2">Cấu hình</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="border-2 border-blue-500 py-2 px-3 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium flex flex-col items-center">
                                            <span>{product.specs.storage}</span>
                                            <span className="font-bold">{formatCurrency(product.price)}</span>
                                        </button>
                                        <button className="border-2 border-gray-200 py-2 px-3 rounded-lg text-gray-700 text-sm font-medium flex flex-col items-center">
                                            <span>{product.category === 'smartphone' ? '512 GB' : 'SSD 1 TB'}</span>
                                            <span className="font-bold">
                                                {formatCurrency(Math.round(product.price * 1.2))}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Promotions */}
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-700 mb-2">Khuyến mãi</h3>
                                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                                    <ul className="space-y-3">
                                        {sampleDetailedInfo.promotions.map(promo => (
                                            <li key={promo.id} className="flex">
                                                <span className="flex-shrink-0 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs mr-2 mt-0.5">
                                                    {promo.id}
                                                </span>
                                                <span className="text-sm text-gray-800">
                                                    {promo.description}
                                                    {promo.code && (
                                                        <span className="font-medium text-blue-600 ml-1">{promo.code}</span>
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Call to action */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                <button className="bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                                    <ShoppingBag size={20} className="mr-2" />
                                    MUA NGAY
                                </button>
                                <button className="border-2 border-blue-500 text-blue-600 font-medium py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center">
                                    <ShoppingCart size={20} className="mr-2" />
                                    THÊM VÀO GIỎ HÀNG
                                </button>
                            </div>

                            {/* Extra purchase options */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button className="border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center text-sm">
                                    <Heart size={18} className="mr-1" />
                                    YÊU THÍCH
                                </button>
                                <button className="border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center text-sm">
                                    <Phone size={18} className="mr-1" />
                                    GỌI TƯ VẤN
                                </button>
                            </div>

                            {/* Benefits */}
                            <div className="border border-gray-200 rounded-lg p-3 mb-4">
                                <h3 className="font-medium text-gray-900 mb-3">Ưu đãi thêm</h3>
                                <ul className="space-y-3">
                                    <li className="flex">
                                        <Check className="flex-shrink-0 text-green-500 mr-2" size={18} />
                                        <span className="text-sm">Giảm đến 500.000₫ khi thanh toán qua VNPay, Moca</span>
                                    </li>
                                    <li className="flex">
                                        <Check className="flex-shrink-0 text-green-500 mr-2" size={18} />
                                        <span className="text-sm">Giảm đến 10% cho sinh viên, giáo viên</span>
                                    </li>
                                    <li className="flex">
                                        <Check className="flex-shrink-0 text-green-500 mr-2" size={18} />
                                        <span className="text-sm">Trả góp 0% qua thẻ tín dụng</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Policy information */}
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-start">
                                    <Shield className="flex-shrink-0 text-blue-500 mr-2" size={18} />
                                    <div>
                                        <p className="text-sm font-medium">Bảo hành chính hãng {sampleDetailedInfo.warranty.period}</p>
                                        <p className="text-xs text-gray-500">{sampleDetailedInfo.warranty.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Gift className="flex-shrink-0 text-blue-500 mr-2" size={18} />
                                    <div>
                                        <p className="text-sm font-medium">Quà tặng kèm</p>
                                        <p className="text-xs text-gray-500">Balo, Túi chống sốc, Chuột không dây</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Truck className="flex-shrink-0 text-blue-500 mr-2" size={18} />
                                    <div>
                                        <p className="text-sm font-medium">Giao hàng miễn phí</p>
                                        <p className="text-xs text-gray-500">Giao nhanh trong 2 giờ</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <ShoppingBag className="flex-shrink-0 text-blue-500 mr-2" size={18} />
                                    <div>
                                        <p className="text-sm font-medium">Đổi trả dễ dàng</p>
                                        <p className="text-xs text-gray-500">Trong 15 ngày đầu tiên</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content tabs - Description, Specs, Reviews */}
                <div className="bg-white rounded-lg overflow-hidden mb-6">
                    {/* Tab headers */}
                    <div className="flex border-b">
                        <button
                            className={`px-6 py-3 font-medium text-sm ${activeTab === 'mô tả' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('mô tả')}
                        >
                            Mô tả sản phẩm
                        </button>
                        <button
                            className={`px-6 py-3 font-medium text-sm ${activeTab === 'thông số' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('thông số')}
                        >
                            Thông số kỹ thuật
                        </button>
                        <button
                            className={`px-6 py-3 font-medium text-sm ${activeTab === 'đánh giá' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('đánh giá')}
                        >
                            Đánh giá ({product.reviews})
                        </button>
                    </div>

                    {/* Tab content */}
                    <div className="p-4">
                        {/* Description tab */}
                        {activeTab === 'mô tả' && (
                            <div className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: sampleDetailedInfo.description }} />
                            </div>
                        )}

                        {/* Specs tab */}
                        {activeTab === 'thông số' && (
                            <div>
                                {/* Spec tab navigation */}
                                <div className="border-b border-gray-200 mb-4">
                                    <nav className="flex space-x-8 overflow-x-auto">
                                        {Object.keys(sampleDetailedInfo.specs).map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setActiveSpecTab(category)}
                                                className={`py-2 px-1 text-center border-b-2 font-medium text-sm whitespace-nowrap ${activeSpecTab === category
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Spec list */}
                                <div className="space-y-1">
                                    {sampleDetailedInfo.specs[activeSpecTab].map((spec, idx) => (
                                        <div key={idx} className={`flex ${idx % 2 === 0 ? 'bg-gray-50' : ''} py-3 px-4 rounded`}>
                                            <span className="text-gray-600 w-1/3">{spec.name}:</span>
                                            <span className="text-gray-900 font-medium">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews tab */}
                        {activeTab === 'đánh giá' && (
                            <div>
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Rating overview */}
                                    <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg flex items-center md:flex-col">
                                        <div className="text-center mb-2">
                                            <div className="text-5xl font-bold text-blue-600">
                                                {product.rating.toFixed(1)}
                                                <span className="text-xl text-gray-500">/5</span>
                                            </div>

                                            <div className="flex justify-center mt-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={20}
                                                        fill={star <= product.rating ? "#FFC107" : "none"}
                                                        color={star <= product.rating ? "#FFC107" : "#E5E7EB"}
                                                    />
                                                ))}
                                            </div>

                                            <div className="text-sm text-gray-500 mt-1">
                                                {product.reviews} đánh giá
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            {/* Rating distribution */}
                                            <div className="space-y-2 mt-4">
                                                {[5, 4, 3, 2, 1].map((rating) => {
                                                    // Calculate percentage based on rating
                                                    const percentage = rating === 5 ? 85 :
                                                        rating === 4 ? 12 :
                                                            rating === 3 ? 2 :
                                                                rating === 2 ? 1 : 0;

                                                    return (
                                                        <div key={rating} className="flex items-center">
                                                            <div className="flex items-center w-10">
                                                                <span>{rating}</span>
                                                                <Star size={12} fill="#FFC107" color="#FFC107" className="ml-0.5" />
                                                            </div>
                                                            <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-blue-500 rounded-full"
                                                                    style={{ width: `${percentage}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm text-gray-500 w-8">{percentage}%</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 px-4 w-full mt-4 font-medium">
                                                Viết đánh giá
                                            </button>
                                        </div>
                                    </div>

                                    {/* Review list */}
                                    <div className="md:w-2/3">
                                        <div className="border-b pb-4 mb-4">
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="font-medium">Anh Minh</div>
                                                    <div className="text-gray-500 text-sm">20/04/2025</div>
                                                </div>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={16}
                                                            fill="#FFC107"
                                                            color="#FFC107"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mt-2 text-gray-700">
                                                Sản phẩm rất tốt, hiệu năng mạnh mẽ. Chạy mượt mà các ứng dụng đồ họa và chỉnh sửa video 4K. Pin cũng rất tốt, dùng cả ngày không lo hết pin.
                                            </p>
                                            <div className="mt-1 flex space-x-2">
                                                <img src="https://cdn.tgdd.vn/Products/Images/44/331568/macbook-pro-14-inch-m4-pro-den-1-1.jpg" alt="User review image" className="w-20 h-20 object-cover rounded" />
                                            </div>
                                        </div>

                                        <div className="border-b pb-4 mb-4">
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="font-medium">Chị Hương</div>
                                                    <div className="text-gray-500 text-sm">18/04/2025</div>
                                                </div>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={16}
                                                            fill={star <= 4 ? "#FFC107" : "none"}
                                                            color={star <= 4 ? "#FFC107" : "#E5E7EB"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mt-2 text-gray-700">
                                                Máy đẹp, cấu hình mạnh, màn hình hiển thị sắc nét. Chỉ tiếc là hơi nặng một chút so với mong đợi.
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="font-medium">Anh Tuấn</div>
                                                    <div className="text-gray-500 text-sm">15/04/2025</div>
                                                </div>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={16}
                                                            fill="#FFC107"
                                                            color="#FFC107"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mt-2 text-gray-700">
                                                Tuyệt vời! Đó là từ duy nhất để miêu tả sản phẩm này. Hiệu năng vượt trội, màn hình sắc nét, thời lượng pin ấn tượng. Đúng là đáng đồng tiền bát gạo.
                                            </p>
                                        </div>

                                        <div className="mt-6 flex justify-center">
                                            <button className="border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium rounded-lg px-6 py-2">
                                                Xem thêm đánh giá
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related products */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Sản phẩm tương tự</h2>
                        <Link to={`/category/${product.category}`} className="text-blue-600 text-sm">
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {relatedProducts.map((relatedProduct) => (
                            <Link
                                key={relatedProduct.id}
                                to={`/product/${relatedProduct.id}`}
                                className="bg-white p-3 rounded-lg hover:shadow-md transition-shadow group"
                            >
                                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
                                    <img
                                        src={relatedProduct.image}
                                        alt={relatedProduct.name}
                                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <h3 className="text-sm text-gray-700 font-medium truncate">{relatedProduct.name}</h3>
                                <div className="mt-1 text-sm font-bold text-red-600">{formatCurrency(relatedProduct.price)}</div>

                                {relatedProduct.originalPrice > relatedProduct.price && (
                                    <div className="flex items-center text-xs space-x-1 text-gray-500">
                                        <span className="line-through">{formatCurrency(relatedProduct.originalPrice)}</span>
                                        <span className="text-red-500">
                                            -{Math.round(((relatedProduct.originalPrice - relatedProduct.price) / relatedProduct.originalPrice) * 100)}%
                                        </span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;