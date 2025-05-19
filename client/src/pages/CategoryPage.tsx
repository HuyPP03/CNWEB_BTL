import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductListing from "../components/ProductListing";
import { ChevronRight } from "lucide-react";
import { getIdFromSlug } from "../data/categoryMapping";

function CategoryPage() {
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryBanner, setCategoryBanner] = useState<string>("");    // Get the current path without leading slash (this will be the slug)
    const currentPath = location.pathname.substring(1);

    // Get category ID from slug (for API calls)
    const categoryId = getIdFromSlug(currentPath);
    console.log('Category ID:', categoryId);

    // activeCategory is used for UI/filtering and is set to the slug

    useEffect(() => {
        console.log('Current path:', currentPath);
        console.log('Category ID:', categoryId);

        // Set active category from current path
        setActiveCategory(currentPath);

        // Ideally, you would fetch category details from API using categoryId
        // Example: fetchCategoryDetails(categoryId);

        // For now, set category details manually based on path
        switch (currentPath) {
            case "smartphone":
                setCategoryName("Điện thoại");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ef/26/ef26095bb2f667a92ae28f4ea2f05244.png");
                break;
            case "laptop":
                setCategoryName("Laptop");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/e7/23/e723791399df8fb882b0ff603ce6c734.png");
                break;
            case "smartwatch":
                setCategoryName("Đồng hồ thông minh");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/0f/36/0f363cf32a355eceff50b2ed9ce661d1.png");
                break;
            case "tablet":
                setCategoryName("Máy tính bảng");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/70/62/70621259928acda4b1d28dbef4583067.png");
                break;
            case "dong-ho":
                setCategoryName("Đồng hồ");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/54/0d/540dd1da664f05410995eeffdf49b114.png");
                break;
            case "man-hinh-may-in":
                setCategoryName("Màn hình, Máy in");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/c6/9f/c69f929fbf1a935a44f3edf4ff95740b.png");
                break;
            case "camera":
                setCategoryName("Camera");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/fb/10/fb1095c2473e7d2a69c682473897e4cc.png");
                break;
            case "thiet-bi-giam-sat":
                setCategoryName("Thiết bị giám sát");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/fb/10/fb1095c2473e7d2a69c682473897e4cc.png");
                break;
            case "may-in":
                setCategoryName("Máy in");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/45/cd/45cdaa1bdd37b664daefba6fee660f1c.png");
                break;
            case "tai-nghe":
                setCategoryName("Tai nghe");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/ac/0a/ac0a07b4479a85d6b2e2a958da411462.png");
                break;
            case "phu-kien":
                setCategoryName("Phụ kiện");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/49/59/49592398f38e8bbfbd72fa8df1f3c10f.png");
                break;
            // Phụ kiện di động
            case "sac-du-phong":
                setCategoryName("Sạc dự phòng");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/bc/34/bc348570c656592fb9e57ab6824c51af.png");
                break;
            case "sac-cap":
                setCategoryName("Sạc, cáp");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/f0/74/f0745c96ee61b81105e6cc731417eb42.jpg");
                break;
            case "op-lung-dien-thoai":
                setCategoryName("Ốp lưng điện thoại");
                setCategoryBanner("https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/64/89/6489d2b94074b8bebaad5eed93cae314.png");
                break;
            // Thiết bị âm thanh
            case "loa":
                setCategoryName("Loa");
                setCategoryBanner("https://cdn.tgdd.vn/2022/10/campaign/loa-1920x450-1.jpg");
                break;
            case "tai-nghe-bluetooth":
                setCategoryName("Tai nghe Bluetooth");
                setCategoryBanner("https://cdn.tgdd.vn/2022/10/campaign/tai-nghe-1920x450-1.jpg");
                break;
            default:
                setCategoryName("Sản phẩm");
                setCategoryBanner("https://cdn.tgdd.vn/2023/04/banner/desk-1920x450-3.jpg");
                break;
        }
    }, [currentPath, categoryId]);    // Remove brand and price range filtering as it's handled in ProductListing component

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
                )}                {/* Category title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{categoryName}</h1>

                {/* Product listing component */}
                <ProductListing categoryId={categoryId} />

                {/* SEO content section */}
                <div className="bg-white rounded-lg p-6 mt-8">
                    <h2 className="text-xl font-bold mb-4">
                        {categoryName} - Chọn mua {categoryName} chính hãng, giá tốt
                    </h2>
                    <div className="prose max-w-none text-gray-700">
                        <p>
                            {activeCategory === "smartphone" && "TechTrove là nhà bán lẻ ủy quyền chính thức các thương hiệu điện thoại lớn. Mua điện thoại tại đây, khách hàng sẽ được hưởng giá ưu đãi, chế độ bảo hành chính hãng, trả góp 0%, giao hàng miễn phí tận nơi và nhiều ưu đãi khác."}
                            {activeCategory === "laptop" && "TechTrove cung cấp các dòng laptop với đầy đủ thương hiệu lớn như Apple MacBook, Dell, HP, Lenovo, Asus, Acer... với nhiều phân khúc từ giá rẻ đến cao cấp, phục vụ đa dạng nhu cầu cho từng đối tượng khách hàng."}
                            {activeCategory === "tablet" && "Máy tính bảng là thiết bị công nghệ tiện dụng, màn hình lớn thoải mái cho giải trí và làm việc, dễ dàng mang theo khi cần di chuyển. Tại TechTrove có đầy đủ các dòng tablet từ iPad cho đến các hãng Android uy tín."}
                            {activeCategory === "smartwatch" && "Đồng hồ thông minh ngày nay không chỉ để xem giờ mà còn hỗ trợ theo dõi sức khỏe, thông báo tin nhắn, cuộc gọi và nhiều tính năng khác. TechTrove cung cấp đa dạng các dòng smartwatch từ Apple Watch, Samsung Galaxy Watch, Xiaomi, Amazfit với nhiều mẫu mã và mức giá."}
                            {activeCategory === "audio" && "Tai nghe là phụ kiện không thể thiếu với người dùng công nghệ hiện đại. TechTrove cung cấp đa dạng từ tai nghe không dây, tai nghe chống ồn, tai nghe gaming với nhiều thương hiệu nổi tiếng như Apple AirPods, Samsung Galaxy Buds, Sony, JBL..."}
                        </p>
                        <p>
                            Đến với TechTrove, khách hàng sẽ được tư vấn chi tiết về sản phẩm, được hỗ trợ kỹ thuật tận tình và có thể trải nghiệm sản phẩm trực tiếp tại các cửa hàng trên toàn quốc.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryPage;
