import Header from "./components/Header";
import AppRoutes from "./routers/routers";
import Sidebar from "./components/Sidebar";
import { useState } from 'react';
import { useLocation } from "react-router-dom";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    // Nếu đang ở trang login → chỉ render Main
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-auto p-4">
          <AppRoutes />
        </div>
      </div>
    );
  }

  // Các trang khác → render Header + Sidebar + Main
  return (
    <div className="flex flex-col h-screen">

      {/* Header */}
      <div className="flex-none">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className={`transition-all duration-500 ${isSidebarOpen ? 'w-60' : 'w-0'} overflow-hidden`}>
          <Sidebar isOpen={isSidebarOpen} />
        </div>

        {/* Main */}
        <div className="flex-1 p-4 pt-20 overflow-auto">
          <AppRoutes />
        </div>

      </div>

    </div>
  );
}

export default App;
