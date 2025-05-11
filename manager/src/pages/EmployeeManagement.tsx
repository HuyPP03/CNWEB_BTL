import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";

const EmployeeManagement = () => {
  const [employees] = useState([
    { id: 1, name: "Nguyễn Văn A", position: "Nhân viên" },
    { id: 2, name: "Trần Thị B", position: "Quản lý" },
    { id: 3, name: "Lê Văn C", position: "Nhân viên" },
    { id: 4, name: "Phạm Thị D", position: "Nhân viên" },
    { id: 5, name: "Hoàng Văn E", position: "Quản lý" },
    { id: 6, name: "Đặng Thị F", position: "Nhân viên" },
    { id: 7, name: "Ngô Văn G", position: "Nhân viên" },
    { id: 8, name: "Bùi Thị H", position: "Nhân viên" },
  ]);
  const headers = ["ID", "Tên nhân viên", "Chức vụ"];

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const handleDetail = (id: number) => {
    console.log("Chi tiết nhân viên", id);
    navigate(`/qlnhanvien/${id}`);
  };

  const handleAdd = () => {
    console.log("Thêm nhân viên");
    navigate("/qlnhanvien/add");
  };

  const handleEdit = (id: number) => {
    console.log("Sửa nhân viên", id);
    navigate(`/qlnhanvien/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    console.log("Xóa nhân viên", id);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý nhân viên</h1>
      <AddButton onClick={handleAdd} label="Thêm nhân viên" icon={FaUserPlus} />
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
          placeholder="Tìm theo chức vụ..."
          onChange={(e) => console.log("Từ khóa tìm kiếm:", e.target.value)}
          className="p-2 border rounded w-1/3"
        />
      </div>
      <div className="p-4">
        <ManagementTable
          headers={headers}
          columns={['id', 'name', 'position']}
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

export default EmployeeManagement;
