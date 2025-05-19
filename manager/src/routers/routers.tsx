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
import OrderManagement from "../pages/OrderManagement";
import HistoryManagement from "../pages/HistoryManagement";
import PrivateRoute from "../components/PrivateRoute";
import ProductDetail from "../pages/ProductDetail";
import ProductEdit from "../pages/ProductEdit";
import AddProductVariant from "../pages/AddProductVariant";
import EditProductVariant from "../pages/EditProductVariant";
import VariantDetail from "../pages/VariantDetail";
import HistoryDetail from "../pages/HistoryDetail";
import OrderDetail from "../pages/OrderDetail";
import CustomerDetail from "../pages/CustomerDetail";
import FeedbackManagement from "../pages/FeedbackManagement";

export default function AppRoutes() {
  return (
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<Home />} />
      <Route path="/qlnhanvien" element={<EmployeeManagement />} /> 
      <Route path="/qlkhachhang" element={<CustomerManagement />} />
      <Route path="/qlkhachhang/detail/:id" element={<CustomerDetail />} />
      <Route path="/qlsanpham" element={<ProductManagement />} />
      <Route path="/qlnhanvien/add" element={<AddEmployee />} />
      <Route path="/qlnhanvien/edit/:id" element={<EditEmployee />} />
      <Route path="/qlsanpham/add" element={<AddProduct />} />
      <Route path="/qlsanpham/edit/:id" element={<ProductEdit />} />
      <Route path="/qlsanpham/detail/:id" element={<ProductDetail />} />
      <Route path="/qlsanpham/detail/:id/add-variant" element={<AddProductVariant />} />
      <Route path="/qlsanpham/detail/:id/edit-variant/:variantId" element={<EditProductVariant />} />
      <Route path="/qlsanpham/detail/:id/variant/:variantId" element={<VariantDetail />} />
      <Route path="/qldonhang" element={<OrderManagement />} />
      <Route path="/qldonhang/detail/:id" element={<OrderDetail />} />
      <Route path="/qllichsu" element={<HistoryManagement />} />
      <Route path="/qllichsu/detail/:id" element={<HistoryDetail />} />
      <Route path="/qlphanhoi" element={<FeedbackManagement />} />
    </Route>
    <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
