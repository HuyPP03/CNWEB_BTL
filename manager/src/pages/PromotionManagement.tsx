import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";

const PromotionManagement = () => {
  const [employees] = useState([
    { id: 1, name: "Khuyen mai Black Friday", dateStart: "2023-11-01", dateEnd: "2023-11-30" },
    { id: 2, name: "Khuyen mai Tet Nguyen Dan", dateStart: "2024-01-01", dateEnd: "2024-01-31" },
    { id: 3, name: "Khuyen mai mua he", dateStart: "2024-06-01", dateEnd: "2024-08-31" },
    { id: 4, name: "Khuyen mai Giang Sinh", dateStart: "2023-12-01", dateEnd: "2023-12-31" },
  ]);
  const headers = ["ID", "Tên chương trình" , "Ngày bắt đầu", "Ngày kết thúc" , "Hành động"];

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const handleDetail = (id: number) => {
    console.log("Chi tiết chương trình", id);
    navigate(`/qlkhuyenmai/detail/${id}`);
  };

  const handleAdd = () => {
    console.log("Thêm chương trình");
    navigate("/qlkhuyenmai/add");
  };

  const handleEdit = (id: number) => {
    console.log("Sửa chương trình", id);
    navigate(`/qlkhuyenmai/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    console.log("Xóa chương trình", id);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý chương trình khuyến mại</h1>
      <AddButton onClick={handleAdd} label="Thêm chương trình" icon={FaUserPlus} />
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

export default PromotionManagement;
