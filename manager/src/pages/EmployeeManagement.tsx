import { useState } from "react";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";

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

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const handleAdd = () => {
    console.log("Thêm nhân viên");
    navigate("/qlinhanvien/add");
  };

  const handleEdit = (id: number) => {
    console.log("Sửa nhân viên", id);
    navigate(`/qlinhanvien/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    console.log("Xóa nhân viên", id);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Quản lý nhân viên</h1>
      {/* <button 
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 mb-4 cursor-pointer" 
        onClick={handleAdd}
      >
        <FaUserPlus /> Thêm nhân viên
      </button> */}
      <AddButton onClick={handleAdd} label="Thêm nhân viên" icon={FaUserPlus} />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Chức vụ</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
            <tr key={employee.id} className="text-center">
              <td className="border p-2">{employee.id}</td>
              <td className="border p-2">{employee.name}</td>
              <td className="border p-2">{employee.position}</td>
              <td className="border p-2">
                <div className="flex justify-center gap-2">
                <button 
                    className="bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-1 cursor-pointer" 
                    onClick={() => handleEdit(employee.id)}
                >
                    <FaEdit /> Sửa
                </button>
                <button 
                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 cursor-pointer" 
                    onClick={() => handleDelete(employee.id)}
                >
                    <FaTrash /> Xóa
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
