import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";
import axios from "axios";


const BrandManagement = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const headers = ["ID", "Tên nhà cung cấp", "Hành động"];

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const numberPerPage = 10;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get("/api/api/public/brands");
        setBrands(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhà cung cấp:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleDetail = (id: number) => {
    console.log("Chi tiết nhà cung cấp", id);
    navigate(`/qlnhacungcap/detail/${id}`);
  };

  const handleAdd = () => {
    console.log("Thêm nhà cung cấp");
    navigate("/qlnhacungcap/add");
  };

  const handleEdit = (id: number) => {
    console.log("Sửa nhà cung cấp", id);
    navigate(`/qlnhacungcap/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    console.log("Xóa nhà cung cấp", id);
  };

  const indexOfLast = currentPage * numberPerPage;
  const indexOfFirst = indexOfLast - numberPerPage;
  const current = brands.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý nhà cung cấp</h1>
      <AddButton onClick={handleAdd} label="Thêm nhà cung cấp" icon={FaUserPlus} />
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
          data={current.map((brand: any) => ({
            id: brand.id,
            name: brand.name,
          }))}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(brands.length / numberPerPage) }, (_, index) => (
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

export default BrandManagement;
