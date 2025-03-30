import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import EmployeeManagement from "../pages/EmployeeManagement";
import AddEmployee from "../pages/AddEmployee";
import EditEmployee from "../pages/EditEmployee";
import CustomerManagement from "../pages/CustomerManagement";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/qlnhanvien" element={<EmployeeManagement />} />
      <Route path="/qlkhachhang" element={<CustomerManagement />} />
      <Route path="/qlsanpham" element={<NotFound />} />
      <Route path="/qlnhanvien/add" element={<AddEmployee />} />
      <Route path="/qlnhanvien/edit/:id" element={<EditEmployee />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
