import React, { useState } from 'react';
import { ChevronDown, Map, Search, ShoppingCart, User } from 'lucide-react';
import AddressSelection from './AddressSelection';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Hồ Chí Minh');

  const categories = [
    { name: 'Điện thoại', icon: 'phone' },
    { name: 'Laptop', icon: 'laptop' },
    { name: 'Phụ kiện', icon: 'accessories', hasDropdown: true },
    { name: 'Smartwatch', icon: 'watch' },
    { name: 'Đồng hồ', icon: 'clock' },
    { name: 'Tablet', icon: 'tablet' },
    { name: 'Máy cũ, Thụ cũ', icon: 'refurbished', hasDropdown: true },
    { name: 'Màn hình, Máy in', icon: 'monitor', hasDropdown: true },
    { name: 'Sim, Thẻ cào', icon: 'sim', hasDropdown: true },
    { name: 'Dịch vụ tiện ích', icon: 'services', hasDropdown: true },
  ];

  const handleOpenAddressModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleAddressSelected = (address: { province: string; district: string; ward: string }) => {
    setCurrentLocation(address.province);
    setIsAddressModalOpen(false);
  };

  return (
    <>
      <header className="flex flex-col w-full">
        {/* Top header with logo, search, and account */}
        <div className="bg-yellow-400 py-2 px-4 lg:px-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <a href="/" className="flex-shrink-0 mr-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <circle cx="20" cy="20" r="18" fill="#000" />
                      <path d="M13,15 L27,15 L25,25 L15,25 Z" fill="#ffb700" />
                    </svg>
                  </div>
                  <span className="text-black font-bold text-xl ml-1">thegioididong</span>
                  <span className="text-black text-sm mt-auto">.com</span>
                </div>
              </a>

              {/* Search */}
              <div className="flex-grow max-w-xl relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Bạn tìm gì..."
                    className="w-full py-2 px-4 pr-10 rounded-full border-none outline-none text-sm bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* User controls */}
              <div className="flex items-center ml-4 space-x-6">
                {/* Account */}
                <a href="/account" className="flex items-center text-black hover:text-gray-800">
                  <User size={20} />
                  <span className="ml-1 hidden sm:inline text-sm">A Huy</span>
                </a>

                {/* Cart */}
                <a href="/cart" className="flex items-center text-black hover:text-gray-800">
                  <ShoppingCart size={20} />
                  <span className="ml-1 hidden sm:inline text-sm">Giỏ hàng</span>
                </a>

                {/* Location - Modified to open the modal */}
                <a
                  href="#"
                  className="flex items-center text-black hover:text-gray-800"
                  onClick={handleOpenAddressModal}
                >
                  <Map size={20} />
                  <span className="ml-1 hidden sm:inline text-sm">{currentLocation}</span>
                  <ChevronDown size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Categories navigation */}
        <nav className="bg-yellow-400 border-t border-yellow-500 overflow-x-auto py-2 px-4 lg:px-6 scrollbar-hide">
          <div className="container mx-auto">
            <ul className="flex space-x-2 md:space-x-4 whitespace-nowrap">
              {categories.map((category, index) => (
                <li key={index} className="inline-block">
                  <a
                    href={`/category/${category.name.toLowerCase()}`}
                    className="flex items-center text-black text-sm hover:text-gray-800 px-1"
                  >
                    <span className="hidden md:flex items-center justify-center w-6 h-6 mr-1">
                      {getCategoryIcon(category.icon)}
                    </span>
                    <span>{category.name}</span>
                    {category.hasDropdown && <ChevronDown size={14} className="ml-1" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Address Selection Modal */}
      <AddressSelection
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        onAddressSelected={handleAddressSelected}
      />
    </>
  );
};

// Helper function to render category icons
const getCategoryIcon = (iconName: string) => {
  // In a real implementation, you would use actual icons
  // This is a placeholder that would be replaced with your icons
  const iconMap: Record<string, React.ReactNode> = {
    phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    laptop: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path d="M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 01-.9 1.45H3.62a1 1 0 01-.9-1.45L4 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    accessories: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    watch: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><circle cx="12" cy="12" r="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 9v3l1.5 1.5M16.51 17.35l-.35 3.83a2 2 0 01-2 1.82H9.83a2 2 0 01-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 019.83 1h4.35a2 2 0 012 1.82l.35 3.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    tablet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    refurbished: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9a2 2 0 012-2h2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    monitor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    sim: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 12h.01M8 12h.01M12 12h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    services: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path d="M12 3v18M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  };

  return iconMap[iconName] || <div className="w-5 h-5"></div>;
};


export default Header;