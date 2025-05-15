import { useState, useEffect } from "react";
import { FaUserPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";
import api from "../services/api";

interface Brand {
  id: number;
  name: string;
}

const BrandManagement = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const headers = ["ID", "Tên nhà cung cấp"];
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const numberPerPage = 10;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get("/public/brands");
        setBrands(res.data.data);
        setFilteredBrands(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhà cung cấp:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const filtered = brands.filter(brand => {
      const matchId = searchId === "" || brand.id.toString().includes(searchId);
      const matchName = searchName === "" || brand.name.toLowerCase().includes(searchName.toLowerCase());
      return matchId && matchName;
    });
    setFilteredBrands(filtered);
    setCurrentPage(1);
  }, [searchId, searchName, brands]);

  const handleDetail = (id: number) => {
    navigate(`/qlnhacungcap/detail/${id}`);
  };

  const handleAdd = () => {
    navigate("/qlnhacungcap/add");
  };

  const handleEdit = (id: number) => {
    navigate(`/qlnhacungcap/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        await api.delete(`/brands/${id}`);
        setBrands(brands.filter(brand => brand.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa nhà cung cấp:", error);
      }
    }
  };

  const indexOfLast = currentPage * numberPerPage;
  const indexOfFirst = indexOfLast - numberPerPage;
  const current = filteredBrands.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = Math.ceil(filteredBrands.length / numberPerPage);
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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

    // Add first page
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

    // Add middle pages
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

    // Add last page
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
        className={`mx-1 px-3 py-1 border rounded flex items-center ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-500 hover:bg-blue-50'}`}
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight className="w-3 h-3" />
      </button>
    );

    return pages;
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý nhà cung cấp</h1>
      <AddButton onClick={handleAdd} label="Thêm nhà cung cấp" icon={FaUserPlus} />
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Tìm theo ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
      </div>
      <div className="p-4">
        <ManagementTable
          headers={headers}
          columns={['id', 'name']}
          data={current}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <div className="flex justify-center mt-4">
        {renderPagination()}
      </div>
    </div>
  );
};

export default BrandManagement;
