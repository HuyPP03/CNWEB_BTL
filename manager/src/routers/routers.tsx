import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import EmployeeManagement from "../pages/EmployeeManagement";
import AddEmployee from "../pages/AddEmployee";
import EditEmployee from "../pages/EditEmployee";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/qlinhanvien" element={<EmployeeManagement />} />
      <Route path="/qlikhachhang" element={<NotFound />} />
      <Route path="/qlisanpham" element={<NotFound />} />
      <Route path="/qlinhanvien/add" element={<AddEmployee />} />
      <Route path="/qlinhanvien/edit/:id" element={<EditEmployee />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
