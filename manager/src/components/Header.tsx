import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from './Loading';

const Header = ({ toggleSidebar }: {toggleSidebar : () => void}) => {
  const { currentUser, logout, loading } = useAuth();

  // Redirect if not logged in
  if (!loading && !currentUser) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <LoadingSpinner message="Đang tải dữ liệu..." />
      </div>
    );
  }
  return (
    <header className="bg-yellow-500 h-16 p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-white text-xl relative hover:bg-gray-300 active:bg-gray-700 hover:bg-opacity-50 p-1 rounded-full cursor-pointer transition-all duration-300"><FaBars /></button>
        <h1 className="text-white text-xl font-bold">Quản lý hệ thống</h1>
      </div>
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-white text-2xl" />
        <span className="text-white">Người quản lý</span>
        <button 
          className="text-white bg-red-500 hover:bg-red-600 active:bg-red-700 px-4 py-2 rounded transition-all duration-300"
          onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default Header;
