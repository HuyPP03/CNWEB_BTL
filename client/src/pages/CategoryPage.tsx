import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductListing from "../components/ProductListing";
import { ChevronRight, ChevronDown, Sliders } from "lucide-react";
import { mockProducts } from "../data/products";

function CategoryPage() {
    const { category } = useParams<{ category: string }>();
    const [activeCategory, setActiveCategory] = useState<string>(category || "");
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryBanner, setCategoryBanner] = useState<string>("");
    
    // Update category details when route param changes
    useEffect(() => {
        if (category) {
            setActiveCategory(category);
            
            // Set category display name
            switch (category) {
                case "smartphone":
                    setCategoryName("Điện thoại");
                    setCategoryBanner("https://cdn.tgdd.vn/2022/10/campaign/31c-1920x380-1.png");
                    break;
                case "laptop":
                    setCategoryName("Laptop");
                    setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/fe/d8/fed87d90446c8b5c42d995581294d987.png");
                    break;
                case "smartwatch":
                    setCategoryName("Đồng hồ thông minh");
                    setCategoryBanner("https://cdn.tgdd.vn/2023/04/banner/smartwatch-1920x450.png");
                    break;
                case "tablet":
                    setCategoryName("Máy tính bảng");
                    setCategoryBanner("https://cdn.tgdd.vn/2023/05/campaign/Tab-S8-1920x450-1.jpg");
                    break;
                case "audio":
                    setCategoryName("Tai nghe");
                    setCategoryBanner("https://cdn.tgdd.vn/2022/10/campaign/tai-nghe-1920x450-1.jpg");
                    break;
                default:
                    setCategoryName("Sản phẩm");
                    setCategoryBanner("https://cdn.tgdd.vn/2023/04/banner/desk-1920x450-3.jpg");
                    break;
            }
        }
    }, [category]);
    
    // Get brands for this category
    const categoryBrands = [...new Set(
        mockProducts
            .filter(p => p.category === activeCategory)
            .map(p => p.brand)
    )];
    
    // Get price ranges for filter
    const priceRanges = [
        { label: "Dưới 5 triệu", value: "under-5" },
        { label: "Từ 5 - 10 triệu", value: "5-10" },
        { label: "Từ 10 - 20 triệu", value: "10-20" },
        { label: "Từ 20 - 30 triệu", value: "20-30" },
        { label: "Trên 30 triệu", value: "over-30" }
    ];
    
    return (
        <div className="bg-gray-100 pb-10">
            {/* Breadcrumb */}
            <div className="bg-white py-2 shadow-sm mb-4">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center text-sm text-gray-500">
                        <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                        <ChevronRight className="mx-1" size={14} />
                        <span className="text-gray-900">{categoryName}</span>
                    </nav>
                </div>
            </div>
            
            <div className="container mx-auto px-4">
                {/* Category banner - Điều chỉnh kích thước và thêm giới hạn chiều cao */}
                {categoryBanner && (
                    <div className="mb-6">
                        <div className="overflow-hidden rounded-lg shadow-sm">
                            <img 
                                src={categoryBanner} 
                                alt={`${categoryName} Banner`} 
                                className="w-full h-auto object-cover max-h-[280px]"
                            />
                        </div>
                    </div>
                )}
                
                {/* Category title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{categoryName}</h1>
                
                {/* Quick filter chips */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {/* Brand filters */}
                        {categoryBrands.map((brand) => (
                            <button 
                                key={brand} 
                                className="px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm hover:border-blue-500 hover:text-blue-600 transition-colors"
                            >
                                {brand}
                            </button>
                        ))}
                        
                        {/* Price range filters */}
                        {priceRanges.map((range) => (
                            <button 
                                key={range.value} 
                                className="px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm hover:border-blue-500 hover:text-blue-600 transition-colors"
                            >
                                {range.label}
                            </button>
                        ))}
                        
                        {/* Feature filters - show based on category */}
                        {(activeCategory === "smartphone" || activeCategory === "tablet") && (
                            <>
                                <button className="px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm hover:border-blue-500 hover:text-blue-600 transition-colors">
                                    Chụp ảnh đẹp
                                </button>
                                <button className="px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm hover:border-blue-500 hover:text-blue-600 transition-colors">
                                    Pin trâu
                                </button>
                                <button className="px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm hover:border-blue-500 hover:text-blue-600 transition-colors">
                                    Sạc không dây
                                </button>
                            </>
                        )}
                        
                        {activeCategory === "laptop" && (
                            <>
                                <button className="px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm hover:border-blue-500 hover:text-blue-600 transition-colors">
                                    Gaming
                                </button>
                                <button className="px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm hover:border-blue-500 hover:text-blue-600 transition-colors">
                                    Mỏng nhẹ
                                </button>
                                <button className="px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm hover:border-blue-500 hover:text-blue-600 transition-colors">
                                    Văn phòng
                                </button>
                            </>
                        )}
                        
                        {/* Advanced filter button */}
                        <button className="px-3 py-1.5 bg-white rounded-full border border-blue-500 text-blue-600 text-sm flex items-center">
                            <Sliders size={14} className="mr-1" />
                            Bộ lọc nâng cao
                        </button>
                    </div>
                </div>
                
                {/* Category navigation - Important for categories with subcategories */}
                {activeCategory === "smartphone" && (
                    <div className="bg-white rounded-lg p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/logo-iphone-220x48.png" 
                                alt="iPhone" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">iPhone</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/samsungnew-220x48-1.png" 
                                alt="Samsung" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">Samsung</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/xiaomi-220x48-5.png" 
                                alt="Xiaomi" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">Xiaomi</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/OPPO42-b_5.jpg" 
                                alt="OPPO" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">OPPO</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/vivo-logo-220-220x48-3.png" 
                                alt="vivo" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">vivo</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/Realme42-b_37.png" 
                                alt="realme" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">realme</span>
                        </a>
                    </div>
                )}
                
                {activeCategory === "laptop" && (
                    <div className="bg-white rounded-lg p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/logo-macbook-149x40.png" 
                                alt="MacBook" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">MacBook</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/logo-asus-149x40.png" 
                                alt="Asus" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">Asus</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/logo-hp-149x40-1.png" 
                                alt="HP" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">HP</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/logo-lenovo-149x40.png" 
                                alt="Lenovo" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">Lenovo</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/logo-acer-149x40.png" 
                                alt="Acer" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">Acer</span>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-center group">
                            <img 
                                src="https://cdn.tgdd.vn/Brand/1/logo-dell-149x40.png" 
                                alt="Dell" 
                                className="h-8 object-contain mb-2"
                            />
                            <span className="text-xs text-center group-hover:text-blue-600">Dell</span>
                        </a>
                    </div>
                )}
                
                {/* Sort and filter bar - visible on all category pages */}
                <div className="bg-white rounded-lg shadow-sm p-3 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Sắp xếp theo: </span>
                            <button className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white">
                                Nổi bật
                            </button>
                            <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">
                                Mới nhất
                            </button>
                            <button className="px-3 py-1 text-sm rounded-md hover:bg-gray-100">
                                Bán chạy
                            </button>
                            <div className="relative">
                                <button className="flex items-center px-3 py-1 text-sm rounded-md hover:bg-gray-100">
                                    <span>Giá</span>
                                    <ChevronDown size={14} className="ml-1" />
                                </button>
                                {/* Price dropdown would go here */}
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <label className="text-sm text-gray-500 mr-2">Xem:</label>
                            <div className="flex border rounded overflow-hidden">
                                <button className="px-3 py-1 bg-blue-50 border-r">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                    </svg>
                                </button>
                                <button className="px-3 py-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                        <line x1="8" y1="6" x2="21" y2="6"></line>
                                        <line x1="8" y1="12" x2="21" y2="12"></line>
                                        <line x1="8" y1="18" x2="21" y2="18"></line>
                                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Active filters */}
                    <div className="flex flex-wrap items-center mt-2">
                        <span className="text-sm text-gray-500 mr-2">Lọc đang chọn:</span>
                        <div className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs">
                            <span>Giảm giá</span>
                            <button className="ml-1">×</button>
                        </div>
                    </div>
                </div>
                
                {/* Product listing component */}
                <ProductListing />
                
                {/* SEO content section */}
                <div className="bg-white rounded-lg p-6 mt-8">
                    <h2 className="text-xl font-bold mb-4">
                        {categoryName} - Chọn mua {categoryName} chính hãng, giá tốt
                    </h2>
                    <div className="prose max-w-none text-gray-700">
                        <p>
                            {activeCategory === "smartphone" && "Thế Giới Di Động là nhà bán lẻ ủy quyền chính thức các thương hiệu điện thoại lớn. Mua điện thoại tại đây, khách hàng sẽ được hưởng giá ưu đãi, chế độ bảo hành chính hãng, trả góp 0%, giao hàng miễn phí tận nơi và nhiều ưu đãi khác."}
                            {activeCategory === "laptop" && "Thế Giới Di Động cung cấp các dòng laptop với đầy đủ thương hiệu lớn như Apple MacBook, Dell, HP, Lenovo, Asus, Acer... với nhiều phân khúc từ giá rẻ đến cao cấp, phục vụ đa dạng nhu cầu cho từng đối tượng khách hàng."}
                            {activeCategory === "tablet" && "Máy tính bảng là thiết bị công nghệ tiện dụng, màn hình lớn thoải mái cho giải trí và làm việc, dễ dàng mang theo khi cần di chuyển. Tại Thế Giới Di Động có đầy đủ các dòng tablet từ iPad cho đến các hãng Android uy tín."}
                            {activeCategory === "smartwatch" && "Đồng hồ thông minh ngày nay không chỉ để xem giờ mà còn hỗ trợ theo dõi sức khỏe, thông báo tin nhắn, cuộc gọi và nhiều tính năng khác. Thế Giới Di Động cung cấp đa dạng các dòng smartwatch từ Apple Watch, Samsung Galaxy Watch, Xiaomi, Amazfit với nhiều mẫu mã và mức giá."}
                            {activeCategory === "audio" && "Tai nghe là phụ kiện không thể thiếu với người dùng công nghệ hiện đại. Thế Giới Di Động cung cấp đa dạng từ tai nghe không dây, tai nghe chống ồn, tai nghe gaming với nhiều thương hiệu nổi tiếng như Apple AirPods, Samsung Galaxy Buds, Sony, JBL..."}
                        </p>
                        <p>
                            Đến với Thế Giới Di Động, khách hàng sẽ được tư vấn chi tiết về sản phẩm, được hỗ trợ kỹ thuật tận tình và có thể trải nghiệm sản phẩm trực tiếp tại các cửa hàng trên toàn quốc.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryPage;
