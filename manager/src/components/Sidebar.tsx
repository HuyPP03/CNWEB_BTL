import { FaUsers, FaBox, FaUsersCog, FaBuilding, FaListAlt, FaClock, FaClipboard, FaTags, FaHome } from "react-icons/fa";
import SidebarItem from "./SidebarItem";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`bg-blue-600 text-white h-full pt-20 p-4 fixed left-0 w-60 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-all duration-500`}
    >
      <nav>
        <ul className="space-y-3">
          <li>
            <SidebarItem to="/" icon ={FaHome} label="Trang chủ" />
          </li>
          <li>
            <SidebarItem to="/qlnhanvien" icon={FaUsers} label="Quản lý nhân viên" />
          </li>
          <li>
            <SidebarItem to="/qlkhachhang" icon={FaUsersCog} label="Quản lý khách hàng" />
          </li>
          <li>
            <SidebarItem to="/qlsanpham" icon={FaBox} label="Quản lý sản phẩm" />
          </li>
          <li>
            <SidebarItem to="/qlnhacungcap" icon={FaBuilding} label="Quản lý nhà cung cấp" />
          </li>
          <li>
            <SidebarItem to="/qldanhmuc" icon={FaListAlt} label="Quản lí danh mục sản phẩm" />
          </li>
          <li>
            <SidebarItem to="/qldonhang" icon={FaClipboard} label="Quản lí đơn hàng" />
          </li>
          <li>
            <SidebarItem to="/qlkhuyenmai" icon={FaTags} label="Quản lí chương trình khuyến mại" />
          </li>
          <li>
            <SidebarItem to="/qllichsu" icon={FaClock} label="Quản lí truy cập" />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
