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
import BrandManagement from "../pages/BrandManagement";
import AddCategory from "../pages/AddCategory";
import CategoryManagement from "../pages/CategoryManagement";
import OrderManagement from "../pages/OrderManagement";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/qlnhanvien" element={<EmployeeManagement />} />
      <Route path="/qlkhachhang" element={<CustomerManagement />} />
      <Route path="/qlsanpham" element={<ProductManagement />} />
      <Route path="/qlnhanvien/add" element={<AddEmployee />} />
      <Route path="/qlnhanvien/edit/:id" element={<EditEmployee />} />
      <Route path="/qlsanpham/add" element={<AddProduct />} />
      <Route path="/qlsanpham/edit/:id" element={<NotFound />} />
      <Route path="/qlnhacungcap" element={<BrandManagement />} />
      <Route path="/qlnhacungcap/add" element={<AddBrand />} />
      <Route path="/qlnhacungcap/edit/:id" element={<NotFound />} />
      <Route path="/qldanhmuc" element={<CategoryManagement />} />
      <Route path="/qldanhmuc/add" element={<AddCategory />} />
      <Route path="/qldanhmuc/edit/:id" element={<NotFound />} />
      <Route path="/qldonhang" element={<OrderManagement />} />
      <Route path="/qldonhang/add" element={<NotFound />} />
      <Route path="/qldonhang/edit/:id" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
