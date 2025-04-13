import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";

const ProductManagement = () => {
  const [employees] = useState([
    { id: 1, name: "Oppo F8", category: "Điện thoại", quantity: 10 },
    { id: 2, name: "Xiaomi S1", category: "Điện thoại", quantity: 5 },
    { id: 3, name: "Samsung B2", category: "Điện thoại", quantity: 8 },
    { id: 4, name: "Iphone 5S", category: "Điện thoại", quantity: 3 },
    { id: 5, name: "Iphone 6S", category: "Điện thoại", quantity: 2 },
    { id: 6, name: "Samsung S2", category: "Điện thoại", quantity: 7 },
    { id: 7, name: "Apple watch", category: "Đồng hồ", quantity: 4 },
    { id: 8, name: "Airpod abc", category: "Tai nghe", quantity: 6 },
  ]);
  const headers = ["ID", "Tên Sản Phẩm", "Loại Sản Phẩm", "Số lượng", "Hành động"];

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const handleAdd = () => {
    console.log("Thêm sản phẩm");
    navigate("/qlsanpham/add");
  };

  const handleEdit = (id: number) => {
    console.log("Sửa sản phẩm", id);
    navigate(`/qlsanpham/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    console.log("Xóa sản phẩm", id);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý sản phẩm</h1>
      <AddButton onClick={handleAdd} label="Thêm sản phẩm" icon={FaUserPlus} />
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
        <input
          type="text"
          placeholder="Tìm theo thể loại..."
          onChange={(e) => console.log("Từ khóa tìm kiếm:", e.target.value)}
          className="p-2 border rounded w-1/3"
        />
      </div>
      <div className="p-4">
        <ManagementTable
          headers={headers}
          data={currentEmployees}
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

export default ProductManagement;
