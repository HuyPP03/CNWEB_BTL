import { useState, useEffect, ChangeEvent } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";
import api from "../services/api";

const headers = ["ID", "Tên sản phẩm", "Loại sản phẩm", "Nhà cung cấp"];
const columns = ["id", "name", "categoryId", "brandId"];

interface Product {
  id: number;
  name: string;
  categoryId: number;
  brandId: number;
  [key: string]: any;
}

interface Filters {
  id: string;
  name: string;
  categoryId: string;
  brandId: string;
  min: string;
  max: string;
  page: number;
  limit: number;
  [key: string]: string | number;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({
    id: "",
    name: "",
    categoryId: "",
    brandId: "",
    min: "",
    max: "",
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: { [key: string]: string | number } = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "" && value !== null) params[key] = value;
        });
        const res = await api.get("/products", { params });
        setProducts(res.data.data || []);
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleDetail = (id: number) => navigate(`/qlsanpham/detail/${id}`);
  const handleAdd = () => navigate("/qlsanpham/add");
  const handleEdit = (id: number) => navigate(`/qlsanpham/edit/${id}`);
  const handleDelete = (id: number) => { /* Xử lý xóa */ };

  const paginate = (pageNumber: number) => setFilters({ ...filters, page: pageNumber });

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý sản phẩm</h1>
      <AddButton onClick={handleAdd} label="Thêm sản phẩm" icon={FaUserPlus} />
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          name="id"
          placeholder="Tìm theo ID..."
          value={filters.id}
          onChange={handleFilterChange}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          name="name"
          placeholder="Tìm theo tên..."
          value={filters.name}
          onChange={handleFilterChange}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          name="categoryId"
          placeholder="Tìm theo thể loại..."
          value={filters.categoryId}
          onChange={handleFilterChange}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          name="brandId"
          placeholder="Tìm theo nhà cung cấp..."
          value={filters.brandId}
          onChange={handleFilterChange}
          className="p-2 border rounded w-1/3"
        />
      </div>
      <div className="p-4">
        <ManagementTable
          headers={headers}
          columns={columns}
          data={products}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {loading && <div>Đang tải dữ liệu...</div>}
      </div>
      <div className="flex justify-center mt-4">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`mx-1 px-3 py-1 border rounded ${filters.page === page ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
            onClick={() => paginate(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
