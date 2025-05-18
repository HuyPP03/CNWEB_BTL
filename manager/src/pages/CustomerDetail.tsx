import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton";

interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address?: string | null;
  isActive: boolean;
  isBlock: boolean;
  googleId?: string | null;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [blockSuccess, setBlockSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/account/customers/?id=${id}`);
        setCustomer(res.data.data[0]);
      } catch (err: any) {
        setError("Không tìm thấy khách hàng hoặc có lỗi xảy ra.");
      }
      setLoading(false);
    };
    fetchCustomer();
  }, [id]);

  useEffect(() => {
    if (blockSuccess) {
      const timer = setTimeout(() => setBlockSuccess(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [blockSuccess]);

  const handleBack = () => {
    navigate("/qlkhachhang");
  };

  const handleBlockToggle = async () => {
    if (!customer) return;
    setBlockLoading(true);
    setBlockError(null);
    setBlockSuccess(null);
    try {
      await api.put(`/account/customers/${customer.id}`, { isBlock: !customer.isBlock });
      setBlockSuccess(customer.isBlock ? "Đã bỏ chặn khách hàng!" : "Đã chặn khách hàng!");
      setCustomer({ ...customer, isBlock: !customer.isBlock });
    } catch (err: any) {
      setBlockError("Có lỗi khi cập nhật trạng thái khóa.");
    }
    setBlockLoading(false);
  };

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!customer) return null;

  return (
    <div className="p-8 w-full min-h-screen bg-white">
      <BackButton onClick={handleBack} label="Quay lại" />
      <h1 className="text-2xl font-bold mb-8 text-center">Chi tiết khách hàng</h1>
      <div className="bg-white shadow-lg rounded-xl p-10 space-y-8 max-w-2xl mx-auto">
        <div className="space-y-4 text-lg">
          <div>
            <span className="font-semibold">ID: </span>
            {customer.id}
          </div>
          <div>
            <span className="font-semibold">Tên khách hàng: </span>
            {customer.fullName}
          </div>
          <div>
            <span className="font-semibold">Email: </span>
            {customer.email}
          </div>
          <div>
            <span className="font-semibold">Số điện thoại: </span>
            {customer.phone}
          </div>
          <div>
            <span className="font-semibold">Trạng thái tài khoản: </span>
            {customer.isActive ? <span className="text-green-600">Đã xác nhận</span> : <span className="text-gray-500">Chưa xác nhận</span>}
          </div>
          <div>
            <span className="font-semibold">Trạng thái khóa: </span>
            {customer.isBlock ? <span className="text-red-600">Bị khóa</span> : <span className="text-green-600">Bình thường</span>}
            <button
              className={`ml-4 px-4 py-2 rounded font-semibold ${customer.isBlock ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white`}
              onClick={handleBlockToggle}
              disabled={blockLoading}
            >
              {blockLoading
                ? "Đang xử lý..."
                : customer.isBlock
                  ? "Bỏ chặn"
                  : "Chặn"}
            </button>
          </div>
          {blockError && <div className="text-red-500 mt-2">{blockError}</div>}
          {blockSuccess && <div className="text-green-600 mt-2">{blockSuccess}</div>}
          <div>
            <span className="font-semibold">Địa chỉ: </span>
            {customer.address}
          </div>
          <div>
            <span className="font-semibold">Ngày tạo: </span>
            {formatDate(customer.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail; 