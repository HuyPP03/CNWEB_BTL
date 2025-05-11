import { useState } from "react";
import ManagementTable from "../components/ManagementTable";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
    const [customers] = useState([
        { id: 1, name: "Nguyễn Văn A", createAt: "01 - 02 - 2025" },
        { id: 2, name: "Trần Thị B", createAt: "01 - 02 - 2025" },
        { id: 3, name: "Lê Văn C", createAt: "01 - 02 - 2025" },
        { id: 4, name: "Phạm Thị D", createAt: "01 - 02 - 2025" },
        { id: 5, name: "Hoàng Văn E", createAt: "01 - 02 - 2025" }
    ]);

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 10;

    const handleDetail = (id: number) => {
        console.log("Chi tiết đơn hàng", id);
        navigate(`/qldonhang/detail/${id}`);
    };

    const handleEdit = (id: number) => {
        console.log("Sửa đơn hàng", id);
        navigate(`/qldonhang/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        console.log("Xóa đơn hàng", id);
    };

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-2">
            <h1 className="text-xl font-bold mb-4">Quản lý đơn hàng</h1>
            <div className="flex gap-2">
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
                    placeholder="Tìm theo ngày tạo..."
                    onChange={(e) => console.log("Từ khóa tìm kiếm:", e.target.value)}
                    className="p-2 border rounded w-1/3"
                />
            </div>
            <div className="p-4">
                <ManagementTable
                    data={currentCustomers}
                    headers={["ID", "Tên khách hàng", "Ngày tạo"]}
                    columns={['id', 'name', 'createAt']}
                    onDetail={handleDetail}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(customers.length / customersPerPage) }, (_, index) => (
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
