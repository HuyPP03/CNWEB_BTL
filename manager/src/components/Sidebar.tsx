import { FaUsers, FaBox, FaUsersCog, FaClock, FaClipboard, FaHome, FaComment } from "react-icons/fa";
import SidebarItem from "./SidebarItem";
import { useAuth } from "./AuthContext";


const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const { currentUser } = useAuth();
  // Function to check if menu item should be visible based on role
  const isMenuItemVisible = (allowedRoles: string[]) => {
    if (!currentUser?.role) return false;
    return allowedRoles.includes(currentUser.role);
  };
  return (
    <div
      className={`bg-blue-600 text-white h-full pt-20 p-4 fixed left-0 w-60 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-all duration-500`}
    >
      <nav>
        <ul className="space-y-3">
          <li>
            <SidebarItem to="/" icon={FaHome} label="Trang chủ" />
          </li>
          {isMenuItemVisible(['super_admin']) && (
            <li>
              <SidebarItem to="/qlnhanvien" icon={FaUsers} label="Quản lý nhân viên" />
            </li>
          )}
          {isMenuItemVisible(['super_admin', 'manager']) && (
            <li>
              <SidebarItem to="/qlkhachhang" icon={FaUsersCog} label="Quản lý khách hàng" />
            </li>
          )}
          {isMenuItemVisible(['super_admin', 'manager', 'staff']) && (
            <li>
              <SidebarItem to="/qlsanpham" icon={FaBox} label="Quản lý sản phẩm" />
            </li>
          )}
          {isMenuItemVisible(['super_admin', 'manager', 'staff']) && (
            <li>
              <SidebarItem to="/qldonhang" icon={FaClipboard} label="Quản lí đơn hàng" />
            </li>
          )}
          {isMenuItemVisible(['super_admin', 'manager', 'staff']) && (
            <li>
              <SidebarItem to="/qlphanhoi" icon={FaComment} label="Quản lí phản hồi" />
            </li>
          )}
          {isMenuItemVisible(['super_admin']) && (
            <li>
              <SidebarItem to="/qllichsu" icon={FaClock} label="Quản lí truy cập" />
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
