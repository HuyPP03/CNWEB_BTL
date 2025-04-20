import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";

const CategoryManagement = () => {
  const [employees] = useState([
    { id: 1, name: "Điện thoại" },
    { id: 2, name: "Máy tính" },
    { id: 3, name: "Đồng hồ" },
  ]);
  const headers = ["ID", "Tên danh mục", "Hành động"];

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const handleDetail = (id: number) => {
    console.log("Chi tiết danh mục", id);
    navigate(`/qldanhmuc/detail/${id}`);
  };

  const handleAdd = () => {
    console.log("Thêm danh mục");
    navigate("/qldanhmuc/add");
  };

  const handleEdit = (id: number) => {
    console.log("Sửa danh mục", id);
    navigate(`/qldanhmuc/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    console.log("Xóa danh mục", id);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý danh mục</h1>
      <AddButton onClick={handleAdd} label="Thêm danh mục" icon={FaUserPlus} />
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Tìm theo ID..."
          onChange={(e) => console.log("Từ khóa tìm kiếm:", e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Tìm theo tên..."
          onChange={(e) => console.log("Từ khóa tìm kiếm:", e.target.value)}
          className="p-2 border rounded w-1/3"
        />
      </div>
      <div className="p-4">
        <ManagementTable
          headers={headers}
          data={currentEmployees}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(employees.length / employeesPerPage) }, (_, index) => (
          <button
            key={index + 1}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
