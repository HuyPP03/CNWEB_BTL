import { useEffect, useState } from "react";
import ManagementTable from "../components/ManagementTable";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoadingSpinner from "../components/Loading";

const OrderManagement = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        id: "",
        customerId: "",
        status: "",
        minTotalAmount: "",
        maxTotalAmount: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const res = await api.get(`/orders?${params.toString()}`);
            setOrders(res.data.data || []);
        } catch (err: any) {
            setError("Không thể tải danh sách đơn hàng");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const handleDetail = (id: number) => {
        navigate(`/qldonhang/detail/${id}`);
    };
    const handleEdit = (id: number) => {
        navigate(`/qldonhang/edit/${id}`);
    };
    const handleDelete = (id: number) => {
        // Xử lý xóa đơn hàng
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-2">
            <h1 className="text-xl font-bold mb-4">Quản lý đơn hàng</h1>
            <div className="flex gap-2 mt-4">
                <input
                    type="text"
                    placeholder="Tìm theo ID..."
                    value={filters.id}
                    onChange={e => setFilters(f => ({ ...f, id: e.target.value }))}
                    className="p-2 border rounded w-1/5"
                />
                <input
                    type="text"
                    placeholder="Tìm theo customerId..."
                    value={filters.customerId}
                    onChange={e => setFilters(f => ({ ...f, customerId: e.target.value }))}
                    className="p-2 border rounded w-1/5"
                />
                <input
                    type="text"
                    placeholder="Tìm theo trạng thái..."
                    value={filters.status}
                    onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                    className="p-2 border rounded w-1/5"
                />
                <input
                    type="number"
                    placeholder="Tổng tiền từ..."
                    value={filters.minTotalAmount}
                    onChange={e => setFilters(f => ({ ...f, minTotalAmount: e.target.value }))}
                    className="p-2 border rounded w-1/5"
                />
                <input
                    type="number"
                    placeholder="Tổng tiền đến..."
                    value={filters.maxTotalAmount}
                    onChange={e => setFilters(f => ({ ...f, maxTotalAmount: e.target.value }))}
                    className="p-2 border rounded w-1/5"
                />
            </div>
            <div className="p-4">
                {loading ? (
                    <LoadingSpinner message="Đang tải đơn hàng..." />
                ) : error ? (
                    <div className="text-red-500 font-semibold">{error}</div>
                ) : (
                    <ManagementTable
                        headers={["ID", "Khách hàng", "Tổng tiền", "Trạng thái", "Ngày tạo"]}
                        columns={["id", "customerId", "totalAmount", "status", "createdAt"]}
                        data={currentOrders}
                        onDetail={handleDetail}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
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

export default OrderManagement;
