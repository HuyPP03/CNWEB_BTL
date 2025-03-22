import { FaBars, FaUserCircle } from 'react-icons/fa';

const Header = ({ toggleSidebar }: {toggleSidebar : () => void}) => {
  return (
    <header className="bg-yellow-500 h-16 p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-white text-xl relative transition-all duration-300 hover:bg-gray-500 hover:bg-opacity-50 p-1 rounded-full cursor-pointer"><FaBars /></button>
        <h1 className="text-white text-xl font-bold">Quản lý hệ thống</h1>
      </div>
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-white text-2xl" />
        <span className="text-white">Người quản lý</span>
      </div>
    </header>
  );
};

export default Header;
