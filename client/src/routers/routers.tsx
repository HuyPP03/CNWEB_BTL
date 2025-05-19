import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import CategoryPage from "../pages/CategoryPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import GoogleCallback from "../pages/auth/GoogleCallback";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import PrivateRoute from "./PrivateRoute";
import AccountPage from "../pages/AccountPage";
import WishlistPage from "../pages/WishlistPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ShoppingCart from "../pages/ShoppingCart";
import SearchResults from "../pages/SearchResults";
import PaymentCallback from "../pages/PaymentCallback";
import FeedbackPage from "../pages/FeedbackPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Auth routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/login/success" element={<GoogleCallback />} />

      {/* Protected routes - require authentication */}      <Route element={<PrivateRoute />}>
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/payment-success" element={<PaymentCallback />} />
        <Route path="/payment-failed" element={<PaymentCallback />} />
        <Route path="/notifications" element={<div className="container mx-auto p-8">Thông báo của tôi</div>} />
      </Route>

      {/* Search results */}
      <Route path="/search" element={<SearchResults />} />

      {/* Public routes - Category routes */}
      {/* Danh mục chính */}
      <Route path="/smartphone" element={<CategoryPage />} />
      <Route path="/laptop" element={<CategoryPage />} />
      <Route path="/tablet" element={<CategoryPage />} />
      <Route path="/phu-kien" element={<CategoryPage />} />
      <Route path="/smartwatch" element={<CategoryPage />} />
      <Route path="/dong-ho" element={<CategoryPage />} />
      <Route path="/man-hinh-may-in" element={<CategoryPage />} />
      <Route path="/may-in" element={<CategoryPage />} />
      <Route path="/camera" element={<CategoryPage />} />
      <Route path="/thiet-bi-giam-sat" element={<CategoryPage />} />
      <Route path="/tai-nghe" element={<CategoryPage />} />

      {/* Phụ kiện di động */}
      <Route path="/sac-du-phong" element={<CategoryPage />} />
      <Route path="/sac-cap" element={<CategoryPage />} />
      <Route path="/op-lung-dien-thoai" element={<CategoryPage />} />
      <Route path="/op-lung-may-tinh-bang" element={<CategoryPage />} />
      <Route path="/mieng-dan-man-hinh" element={<CategoryPage />} />
      <Route path="/mieng-dan-camera" element={<CategoryPage />} />
      <Route path="/tui-dung-airpods" element={<CategoryPage />} />
      <Route path="/airtag-vo-bao-ve" element={<CategoryPage />} />
      <Route path="/but-tablet" element={<CategoryPage />} />
      <Route path="/day-dong-ho" element={<CategoryPage />} />

      {/* Thiết bị âm thanh */}
      <Route path="/tai-nghe-bluetooth" element={<CategoryPage />} />
      <Route path="/tai-nghe-day" element={<CategoryPage />} />
      <Route path="/tai-nghe-chup-tai" element={<CategoryPage />} />
      <Route path="/tai-nghe-the-thao" element={<CategoryPage />} />
      <Route path="/loa" element={<CategoryPage />} />
      <Route path="/micro" element={<CategoryPage />} />

      {/* Camera / Flycam / Gimbal */}
      <Route path="/camera-trong-nha" element={<CategoryPage />} />
      <Route path="/camera-ngoai-troi" element={<CategoryPage />} />
      <Route path="/flycam" element={<CategoryPage />} />
      <Route path="/camera-hanh-trinh" element={<CategoryPage />} />
      <Route path="/gimbal" element={<CategoryPage />} />
      <Route path="/may-chieu" element={<CategoryPage />} />

      {/* Phụ kiện laptop */}
      <Route path="/hub-cap-chuyen-doi" element={<CategoryPage />} />
      <Route path="/chuot-may-tinh" element={<CategoryPage />} />
      <Route path="/ban-phim" element={<CategoryPage />} />
      <Route path="/router-thiet-bi-mang" element={<CategoryPage />} />
      <Route path="/balo-tui-chong-soc" element={<CategoryPage />} />      <Route path="/phan-mem" element={<CategoryPage />} />

      {/* Trang phản hồi */}
      <Route path="/feedback" element={<FeedbackPage />} />

      {/* PC và Màn hình */}
      <Route path="/pc-man-hinh" element={<CategoryPage />} />
      <Route path="/may-in-muc-in" element={<CategoryPage />} />
      <Route path="/may-tinh-de-ban" element={<CategoryPage />} />
      <Route path="/man-hinh-may-tinh" element={<CategoryPage />} />
      <Route path="/may-choi-game" element={<CategoryPage />} />
      <Route path="/:categoryId" element={<CategoryPage />} />

      {/* Định tuyến cho chi tiết sản phẩm */}
      <Route path="/:category/:slug" element={<ProductDetailPage />} />

      {/* Trang 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
