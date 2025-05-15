import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import EmployeeManagement from "../pages/EmployeeManagement";
import AddEmployee from "../pages/AddEmployee";
import EditEmployee from "../pages/EditEmployee";
import CustomerManagement from "../pages/CustomerManagement";
import Login from "../pages/Login";
import ProductManagement from "../pages/ProductManagement";
import AddProduct from "../pages/AddProduct";
import AddBrand from "../pages/AddBrand";
import BrandDetail from "../pages/BrandDetail";
import BrandManagement from "../pages/BrandManagement";
import AddCategory from "../pages/AddCategory";
import CategoryManagement from "../pages/CategoryManagement";
import OrderManagement from "../pages/OrderManagement";
import HistoryManagement from "../pages/HistoryManagement";
import PromotionManagement from "../pages/PromotionManagement";
import AddPromotion from "../pages/AddPromotion";
import PrivateRoute from "../components/PrivateRoute";
import ProductDetail from "../pages/ProductDetail";
import ProductEdit from "../pages/ProductEdit";
import AddProductVariant from "../pages/AddProductVariant";
export default function AppRoutes() {
  return (
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<Home />} />
      <Route path="/qlnhanvien" element={<EmployeeManagement />} /> 
      <Route path="/qlkhachhang" element={<CustomerManagement />} />
      <Route path="/qlsanpham" element={<ProductManagement />} />
      <Route path="/qlnhanvien/add" element={<AddEmployee />} />
      <Route path="/qlnhanvien/edit/:id" element={<EditEmployee />} />
      <Route path="/qlsanpham/add" element={<AddProduct />} />
      <Route path="/qlsanpham/edit/:id" element={<ProductEdit />} />
      <Route path="/qlsanpham/detail/:id" element={<ProductDetail />} />
      <Route path="/qlsanpham/detail/:id/add-variant" element={<AddProductVariant />} />
      <Route path="/qlnhacungcap" element={<BrandManagement />} />
      <Route path="/qlnhacungcap/add" element={<AddBrand />} />
      <Route path="/qlnhacungcap/detail/:id" element={<BrandDetail />} />
      <Route path="/qlnhacungcap/edit/:id" element={<NotFound />} />
      <Route path="/qldanhmuc" element={<CategoryManagement />} />
      <Route path="/qldanhmuc/add" element={<AddCategory />} />
      <Route path="/qldanhmuc/edit/:id" element={<NotFound />} />
      <Route path="/qldonhang" element={<OrderManagement />} />
      <Route path="/qldonhang/add" element={<NotFound />} />
      <Route path="/qldonhang/edit/:id" element={<NotFound />} />
      <Route path="/qllichsu" element={<HistoryManagement />} />
      <Route path="/qllichsu/detail/:id" element={<NotFound />} />
      <Route path="/qlkhuyenmai" element={<PromotionManagement />} />
      <Route path="/qlkhuyenmai/add" element={<AddPromotion />} />
      <Route path="/qlkhuyenmai/edit/:id" element={<NotFound />} />
    </Route>
    <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
