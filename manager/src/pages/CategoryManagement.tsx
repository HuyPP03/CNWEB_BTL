import { useState, useEffect } from "react";
import { FaUserPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(Math.ceil(categories.length / itemsPerPage), startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pages.push(
      <button
        key="prev"
        className={`mx-1 px-3 py-1 border rounded flex items-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-blue-50'}`}
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft className="w-3 h-3" />
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`mx-1 px-3 py-1 border rounded ${currentPage === i ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-50"}`}
          onClick={() => paginate(i)}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        className={`mx-1 px-3 py-1 border rounded flex items-center ${currentPage === Math.ceil(categories.length / itemsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-blue-50'}`}
        onClick={() => currentPage < Math.ceil(categories.length / itemsPerPage) && paginate(currentPage + 1)}
        disabled={currentPage === Math.ceil(categories.length / itemsPerPage)}
      >
        <FaChevronRight className="w-3 h-3" />
      </button>
    );

    return pages;
  };

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
        {renderPagination()}
      </div>
    </div>
  );
};

export default CategoryManagement;
