import { useState, useEffect, ChangeEvent } from "react";
import { FaUserPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";
import api from "../services/api";

const headers = ["ID", "Tên chương trình", "% giảm giá", "Mã giảm"]; // columns: id, name, discountPercent, discountCode
const columns = ["id", "name", "discountPercent", "discountCode"];

interface Promotion {
  id: number;
  name: string;
  discountPercent: string;
  discountCode: string;
  [key: string]: any;
}

interface Filters {
  id: string;
  name: string;
  page: number;
  limit: number;
  [key: string]: string | number;
}

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filters, setFilters] = useState<Filters>({
    id: "",
    name: "",
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const params: { [key: string]: string | number } = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "" && value !== null) params[key] = value;
        });
        // API endpoint: /api/promotions
        const res = await api.get("/promotions", { params });
        // API trả về: { data: { promotion: {...} } } hoặc { data: { promotions: [...] } }
        let data: Promotion[] = [];
        if (Array.isArray(res.data.data?.promotions)) {
          data = res.data.data.promotions;
        } else if (Array.isArray(res.data.data)) {
          data = res.data.data;
        } else if (res.data.data?.promotion) {
          data = [res.data.data.promotion];
        }
        setPromotions(data);
        // Nếu có phân trang, lấy tổng số trang từ res.data.total hoặc res.data.paging
        if (res.data.total) {
          setTotalPages(Math.ceil(res.data.total / filters.limit));
        } else if (res.data.paging && res.data.paging.total) {
          setTotalPages(Math.ceil(res.data.paging.total / filters.limit));
        } else {
          setTotalPages(1);
        }
      } catch (err) {
        setPromotions([]);
        setTotalPages(1);
      }
      setLoading(false);
    };
    fetchPromotions();
  }, [filters]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleDetail = (id: number) => navigate(`/qlkhuyenmai/detail/${id}`);
  const handleAdd = () => navigate("/qlkhuyenmai/add");
  const handleEdit = (id: number) => navigate(`/qlkhuyenmai/edit/${id}`);
  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chương trình này?")) {
      try {
        await api.delete(`/promotions/${id}`);
        setPromotions(promotions.filter(p => p.id !== id));
      } catch (err) {
        console.error("Error deleting promotion:", err);
      }
    }
  };

  const paginate = (pageNumber: number) => setFilters({ ...filters, page: pageNumber });

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, filters.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pages.push(
      <button
        key="prev"
        className={`mx-1 px-3 py-1 border rounded flex items-center ${filters.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-blue-50'}`}
        onClick={() => filters.page > 1 && paginate(Number(filters.page) - 1)}
        disabled={filters.page === 1}
      >
        <FaChevronLeft className="w-3 h-3" />
      </button>
    );

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="mx-1 px-3 py-1 border rounded bg-white text-blue-500 hover:bg-blue-50"
          onClick={() => paginate(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="mx-1 px-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`mx-1 px-3 py-1 border rounded ${filters.page === i ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-50"}`}
          onClick={() => paginate(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="mx-1 px-2">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          className="mx-1 px-3 py-1 border rounded bg-white text-blue-500 hover:bg-blue-50"
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        className={`mx-1 px-3 py-1 border rounded flex items-center ${filters.page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-blue-50'}`}
        onClick={() => filters.page < totalPages && paginate(Number(filters.page) + 1)}
        disabled={filters.page === totalPages}
      >
        <FaChevronRight className="w-3 h-3" />
      </button>
    );

    return pages;
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý chương trình khuyến mại</h1>
      <AddButton onClick={handleAdd} label="Thêm chương trình" icon={FaUserPlus} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="id">ID chương trình</label>
          <input
            type="text"
            name="id"
            id="id"
            placeholder="Nhập ID..."
            value={filters.id}
            onChange={handleFilterChange}
            className="p-2 border rounded-lg w-full shadow-sm focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Tên chương trình</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Nhập tên..."
            value={filters.name}
            onChange={handleFilterChange}
            className="p-2 border rounded-lg w-full shadow-sm focus:border-blue-400"
          />
        </div>
      </div>
      <div className="p-4">
        <ManagementTable
          headers={headers}
          columns={columns}
          data={promotions}
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

export default PromotionManagement;
