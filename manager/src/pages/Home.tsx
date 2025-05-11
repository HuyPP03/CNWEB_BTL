// src/pages/Home.tsx
import { FC } from "react";
import { FaUsers, FaBox, FaShoppingCart, FaUserTie } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { icon: <FaUserTie size={28} />, label: "Nhân viên", value: 12 },
  { icon: <FaUsers size={28} />, label: "Khách hàng", value: 128 },
  { icon: <FaBox size={28} />, label: "Sản phẩm", value: 320 },
  { icon: <FaShoppingCart size={28} />, label: "Đơn hàng", value: 84 },
];
const revenueData = [
  { name: "T1", doanhThu: 400 },
  { name: "T2", doanhThu: 800 },
  { name: "T3", doanhThu: 1200 },
  { name: "T4", doanhThu: 1000 },
];

const Home: FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Chào mừng đến với hệ thống quản lý
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition"
          >
            <div className="text-blue-600">{item.icon}</div>
            <div>
              <p className="text-lg font-bold text-gray-800">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-2xl shadow border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Doanh thu theo tháng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="doanhThu" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Home;
