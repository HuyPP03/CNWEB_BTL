import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";
import api from "../services/api";

const headers = ["ID", "Tên danh mục"];
const columns = ["id", "name"];

interface Category {
  id: number;
  name: string;
  [key: string]: any;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get("/public/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        setCategories([]);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const handleDetail = (id: number) => {
    navigate(`/qldanhmuc/detail/${id}`);
  };

  const handleAdd = () => {
    navigate("/qldanhmuc/add");
  };

  const handleEdit = (id: number) => {
    navigate(`/qldanhmuc/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    // Xử lý xóa danh mục nếu cần
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý danh mục</h1>
      <AddButton onClick={handleAdd} label="Thêm danh mục" icon={FaUserPlus} />
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Tìm theo ID..."
          onChange={(e) => {}}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Tìm theo tên..."
          onChange={(e) => {}}
          className="p-2 border rounded w-1/3"
        />
      </div>
      <div className="p-4">
        <ManagementTable
          headers={headers}
          columns={columns}
          data={currentCategories}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {loading && <div>Đang tải dữ liệu...</div>}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(categories.length / itemsPerPage) }, (_, index) => (
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
