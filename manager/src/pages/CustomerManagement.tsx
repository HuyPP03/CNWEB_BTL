import { useState } from "react";
import ManagementTable from "../components/ManagementTable";
import { useNavigate } from "react-router-dom";

const CustomerManagement = () => {
    const [customers] = useState([
        { id: 1, name: "Nguyễn Văn A", email: "a@example.com", phone: "0123456789" },
        { id: 2, name: "Trần Thị B", email: "b@example.com", phone: "0987654321" },
        { id: 3, name: "Lê Văn C", email: "c@example.com", phone: "0912345678" },
        { id: 4, name: "Phạm Thị D", email: "d@example.com", phone: "0934567890" },
        { id: 5, name: "Hoàng Văn E", email: "e@example.com", phone: "0945678901" }
    ]);

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 10;

    const handleDetail = (id: number) => {
        console.log("Chi tiết khách hàng", id);
        navigate(`/qlkhachhang/detail/${id}`);
    };

    const handleEdit = (id: number) => {
        console.log("Sửa khách hàng", id);
        navigate(`/qlkhachhang/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        console.log("Xóa khách hàng", id);
    };

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-2">
            <h1 className="text-xl font-bold mb-4">Quản lý khách hàng</h1>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Tìm theo id..."
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
                    placeholder="Tìm theo email..."
                    onChange={(e) => console.log("Từ khóa tìm kiếm:", e.target.value)}
                    className="p-2 border rounded w-1/3"
                />
                <input
                    type="text"
                    placeholder="Tìm theo số điện thoại..."
                    onChange={(e) => console.log("Từ khóa tìm kiếm:", e.target.value)}
                    className="p-2 border rounded w-1/3"
                />
            </div>
            <div className="p-4">
                <ManagementTable
                    data={currentCustomers}
                    headers={["ID", "Tên khách hàng", "Email", "Số điện thoại", "Hành động"]}
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

export default CustomerManagement;
