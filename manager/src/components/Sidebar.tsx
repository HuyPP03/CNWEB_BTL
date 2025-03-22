import { FaUsers, FaBox, FaUsersCog, FaBuilding, FaListAlt, FaClock, FaClipboard } from "react-icons/fa";
import SidebarItem from "./SidebarItem";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`bg-blue-600 text-white h-full pt-32 p-4 fixed left-0 w-60 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-all duration-500`}
    >
      <nav>
        <ul className="space-y-3">
          <li>
            <SidebarItem to="/qlinhanvien" icon={FaUsers} label="Quản lý nhân viên" />
          </li>
          <li>
            <SidebarItem to="/qlikhachhang" icon={FaUsersCog} label="Quản lý khách hàng" />
          </li>
          <li>
            <SidebarItem to="/qlisanpham" icon={FaBox} label="Quản lý sản phẩm" />
          </li>
          <li>
            <SidebarItem to="/qlinhacungcap" icon={FaBuilding} label="Quản lý nhà cung cấp" />
          </li>
          <li>
            <SidebarItem to="/qlidanhmuc" icon={FaListAlt} label="Quản lí danh mục sản phẩm" />
          </li>
          <li>
            <SidebarItem to="/qlidonhang" icon={FaClipboard} label="Quản lí đơn hàng" />
          </li>
          <li>
            <SidebarItem to="/qlilichsu" icon={FaClock} label="Quản lí truy cập" />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
