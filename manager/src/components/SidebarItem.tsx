import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {

  const location = useLocation();

  const isActive = location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={`flex items-center gap-2 p-2 hover:bg-gray-500 hover:bg-opacity-50 ${
        isActive ? "font-bold bg-blue-800 rounded" : ""
      }`
    }
    >
      <Icon />
      {label}
    </NavLink>
  );
};

export default SidebarItem;
