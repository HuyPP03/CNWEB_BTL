import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Map, Search, ShoppingCart, User, X, Bell, Menu, LogOut } from 'lucide-react';
import AddressSelection from './AddressSelection';
import { mockProducts } from '../data/products';
import { useAuth } from '../context/AuthContext';

// Mock suggestions type
interface SuggestionProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category?: string;
  brandLogo?: string;
  promo?: string;
}

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Hồ Chí Minh');
  const [activeCategoryDropdown, setActiveCategoryDropdown] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestionProduct[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const mainCategories = [
    { name: 'Điện thoại', path: '/smartphone', icon: 'phone' },
    { name: 'Laptop', path: '/laptop', icon: 'laptop' },
    { name: 'Phụ kiện', path: '/phu-kien', icon: 'accessories', hasDropdown: true },
    { name: 'Smartwatch', path: '/smartwatch', icon: 'watch' },
    { name: 'Đồng hồ', path: '/dong-ho', icon: 'clock' },
    { name: 'Tablet', path: '/tablet', icon: 'tablet' },
    { name: 'Máy cũ, Thu cũ', path: '/may-cu', icon: 'refurbished', hasDropdown: true },
    { name: 'Màn hình, Máy in', path: '/man-hinh-may-in', icon: 'monitor', hasDropdown: true },
    { name: 'Sim, Thẻ cào', path: '/sim-the-cao', icon: 'sim', hasDropdown: true },
    { name: 'Dịch vụ tiện ích', path: '/dich-vu-tien-ich', icon: 'services', hasDropdown: true },
  ];

  const accessoriesCategories = [
    {
      title: 'Phụ kiện di động',
      items: [
        { name: 'Sạc dự phòng', path: '/phu-kien/sac-du-phong', image: '/sac-du-phong.png' },
        { name: 'Sạc, cáp', path: '/phu-kien/sac-cap', image: '/sac-cap.png' },
        { name: 'Ốp lưng điện thoại', path: '/phu-kien/op-lung-dien-thoai', image: '/op-lung.png' },
        { name: 'Ốp lưng máy tính bảng', path: '/phu-kien/op-lung-may-tinh-bang', image: '/op-lung-tablet.png' },
        { name: 'Miếng dán điện thoại', path: '/phu-kien/mieng-dan-dien-thoai', image: '/mieng-dan.png' },
        { name: 'Miếng dán Camera', path: '/phu-kien/mieng-dan-camera', image: '/mieng-dan-camera.png' },
      ]
    },
    {
      title: 'Thiết bị âm thanh',
      items: [
        { name: 'Tai nghe Bluetooth', path: '/phu-kien/tai-nghe-bluetooth', image: '/tai-nghe-bluetooth.png' },
        { name: 'Tai nghe dây', path: '/phu-kien/tai-nghe-day', image: '/tai-nghe-day.png' },
        { name: 'Tai nghe chụp tai', path: '/phu-kien/tai-nghe-chup-tai', image: '/tai-nghe-chup-tai.png' },
        { name: 'Tai nghe thể thao', path: '/phu-kien/tai-nghe-the-thao', image: '/tai-nghe-the-thao.png' },
        { name: 'Loa', path: '/phu-kien/loa', image: '/loa.png' },
        { name: 'Micro', path: '/phu-kien/micro', image: '/micro.png' },
      ]
    },
    {
      title: 'Camera / Flycam / Gimbal',
      items: [
        { name: 'Camera trong nhà', path: '/phu-kien/camera-trong-nha', image: '/camera-trong-nha.png' },
        { name: 'Camera ngoài trời', path: '/phu-kien/camera-ngoai-troi', image: '/camera-ngoai-troi.png' },
        { name: 'Flycam', path: '/phu-kien/flycam', image: '/flycam.png' },
        { name: 'Camera hành trình', path: '/phu-kien/camera-hanh-trinh', image: '/camera-hanh-trinh.png' },
        { name: 'Gimbal', path: '/phu-kien/gimbal', image: '/gimbal.png' },
        { name: 'Máy chiếu', path: '/phu-kien/may-chieu', image: '/may-chieu.png' },
      ]
    },
    {
      title: 'Phụ kiện laptop',
      items: [
        { name: 'Hub, cáp chuyển đổi', path: '/phu-kien/hub-cap-chuyen-doi', image: '/hub-cap.png' },
        { name: 'Chuột máy tính', path: '/phu-kien/chuot-may-tinh', image: '/chuot.png' },
        { name: 'Bàn phím', path: '/phu-kien/ban-phim', image: '/ban-phim.png' },
        { name: 'Router - Thiết bị mạng', path: '/phu-kien/router', image: '/router.png' },
        { name: 'Balo, túi chống sốc', path: '/phu-kien/balo-tui', image: '/balo.png' },
        { name: 'Phần mềm', path: '/phu-kien/phan-mem', image: '/phan-mem.png' },
      ]
    },
    {
      title: 'Thương hiệu hàng đầu',
      items: [
        { name: 'Apple', path: '/thuong-hieu/apple', image: '/apple.png' },
        { name: 'Samsung', path: '/thuong-hieu/samsung', image: '/samsung.png' },
        { name: 'Imou', path: '/thuong-hieu/imou', image: '/imou.png' },
        { name: 'Baseus', path: '/thuong-hieu/baseus', image: '/baseus.png' },
        { name: 'JBL', path: '/thuong-hieu/jbl', image: '/jbl.png' },
        { name: 'Anker', path: '/thuong-hieu/anker', image: '/anker.png' },
      ]
    },
  ];

  useEffect(() => {
    // Handle scroll for header shadow
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 10) {
          headerRef.current.classList.add('header-shadow');
        } else {
          headerRef.current.classList.remove('header-shadow');
        }
      }
    };

    // Handle click outside to close suggestions
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Close user dropdown when clicking outside
    function handleClickOutsideUserDropdown(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutsideUserDropdown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideUserDropdown);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      // Filter products based on search query
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Get suggested products (limit to 5)
      setSuggestedProducts(filtered.slice(0, 5).map(product => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercentage: product.originalPrice ?
          Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : undefined,
        category: product.category
      })));

      // Get suggested categories based on query
      const categories = ["Samsung", "Laptop Samsung", "Máy tính bảng Samsung", "Điện thoại Samsung", "Ốp lưng Samsung"];
      const filteredCategories = categories.filter(cat =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestedCategories(filteredCategories);

      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchInputFocus = () => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

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

  const handleCategoryMouseEnter = (category: string) => {
    if (category === 'Phụ kiện') {
      setActiveCategoryDropdown(category);
    } else {
      setActiveCategoryDropdown(null);
    }
  };

  const handleCategoryMouseLeave = () => {
    setActiveCategoryDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserDropdown(false);
  };

  return (
    <>
      <header ref={headerRef} className="flex flex-col w-full sticky top-0 z-50 transition-all duration-300">
        {/* Top header with logo, search, and user actions */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] py-3 px-4 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden flex items-center justify-center p-2 rounded-full hover:bg-white/20 transition-all duration-300"
              onClick={toggleMobileMenu}
            >
              <Menu size={22} className="text-white" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center">
                <div className="bg-white rounded-lg p-1.5 mr-1 shadow-md">
                  <div className="text-[#2563EB] font-bold text-lg leading-none">TT</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-extrabold text-xl tracking-tight">Tech<span className="text-[#10B981] font-black">Trove</span></span>
                  <span className="text-white/70 text-[10px] -mt-1 tracking-wider font-medium">ELECTRONICS STORE</span>
                </div>
              </div>
            </Link>

            {/* Search - Updated with suggestions */}
            <div className="flex-grow max-w-xl relative" ref={searchContainerRef}>
              <div className="flex items-center rounded-full overflow-hidden shadow-md border border-indigo-100">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Bạn tìm gì..."
                    className="w-full py-2.5 px-5 pr-10 border-none outline-none text-sm bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchInputFocus}
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={clearSearch}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button className="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] h-full p-2.5 px-4 hover:opacity-90 transition-opacity">
                  <Search className="text-white" size={20} />
                </button>
              </div>

              {/* Search suggestions dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-xl overflow-hidden mt-2 z-50 border border-gray-100 animate-fadeDown">
                  {/* Suggested text - "Có phải bạn muốn tìm" */}
                  <div className="p-3 text-sm text-gray-500 border-b bg-gray-50">
                    <span className="font-medium">Có phải bạn muốn tìm</span>
                  </div>

                  {/* Special link for brand page - shown when searching Samsung */}
                  {searchQuery.toLowerCase().includes('samsung') && (
                    <Link
                      to="/thuong-hieu/samsung"
                      className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 p-3 hover:opacity-95 transition-opacity"
                    >
                      <div className="bg-white rounded-full p-2 mr-2 shadow-sm">
                        <span className="text-xs font-bold">SAMSUNG</span>
                      </div>
                      <span className="text-white">Chuyên trang Samsung</span>
                      <span className="ml-auto bg-white/20 rounded-full px-2 py-0.5 text-xs text-white">Xem ngay</span>
                    </Link>
                  )}

                  {/* Category suggestions */}
                  {suggestedCategories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/search?q=${encodeURIComponent(category)}`}
                      className="block px-4 py-2.5 hover:bg-gray-50 text-blue-600 transition-colors"
                    >
                      <div className="flex items-center">
                        <Search size={14} className="mr-2 text-gray-400" />
                        <span>{category}</span>
                      </div>
                    </Link>
                  ))}

                  {/* Suggested products section */}
                  {suggestedProducts.length > 0 && (
                    <div className="border-t">
                      <h3 className="px-4 py-2.5 text-gray-500 text-sm font-medium bg-gray-50">Sản phẩm gợi ý</h3>
                      {suggestedProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/${product.category}/${product.id}`}
                          className="flex p-3 hover:bg-gray-50 border-b transition-colors"
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-100 p-1 rounded-md overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm line-clamp-1 text-gray-800">{product.name}</p>
                            <div className="flex items-center mt-0.5">
                              <span className="text-blue-600 font-medium text-sm">
                                {formatCurrency(product.price)}
                              </span>
                              {product.originalPrice && product.discountPercentage && (
                                <div className="flex items-center ml-2">
                                  <span className="text-gray-500 text-xs line-through">
                                    {formatCurrency(product.originalPrice)}
                                  </span>
                                  <span className="text-xs text-white ml-1 bg-blue-500 rounded px-1">
                                    -{product.discountPercentage}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User actions */}
            <div className="flex items-center space-x-6">
              {/* Account */}
              {isAuthenticated ? (
                <div className="hidden md:block relative" ref={userDropdownRef}>
                  <button 
                    className="flex items-center text-white hover:opacity-80 group"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <div className="bg-white/20 rounded-full p-2 mr-2 group-hover:bg-white/30 transition-all">
                      <User size={18} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-white/80">Tài khoản</span>
                      <span className="text-sm font-medium">{user?.fullName?.split(' ').pop() || 'Người dùng'}</span>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`ml-1 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {/* User dropdown menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 animate-fadeDown">
                      <div className="px-4 py-2 border-b">
                        <p className="font-medium text-gray-800">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">{user?.phone}</p>
                      </div>
                      <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserDropdown(false)}>
                        Tài khoản của tôi
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserDropdown(false)}>
                        Đơn hàng của tôi
                      </Link>
                      <Link to="/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserDropdown(false)}>
                        Thông báo
                      </Link>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t"
                        onClick={handleLogout}
                      >
                        <div className="flex items-center">
                          <LogOut size={14} className="mr-2" />
                          Đăng xuất
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth/login" className="hidden md:flex items-center text-white hover:opacity-80 group">
                  <div className="bg-white/20 rounded-full p-2 mr-2 group-hover:bg-white/30 transition-all">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/80">Đăng nhập</span>
                    <span className="text-sm font-medium">Tài khoản</span>
                  </div>
                </Link>
              )}

              {/* Notification */}
              <Link to="/notifications" className="hidden md:flex relative hover:opacity-80">
                <div className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition-all">
                  <Bell size={18} className="text-white" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">2</span>
                </div>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-center text-white hover:opacity-80 group relative">
                <div className="bg-white/20 rounded-full p-2 mr-1 md:mr-2 group-hover:bg-white/30 transition-all">
                  <ShoppingCart size={18} className="text-white" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">3</span>
                </div>
                <span className="hidden md:inline text-sm">Giỏ hàng</span>
              </Link>

              {/* Location */}
              <a href="#" className="hidden md:flex items-center text-white hover:opacity-80 group" onClick={handleOpenAddressModal}>
                <div className="bg-white/20 rounded-full p-2 mr-2 group-hover:bg-white/30 transition-all">
                  <Map size={18} className="text-white" />
                </div>
                <span className="text-sm">{currentLocation}</span>
                <ChevronDown size={16} className="ml-1 transition-transform group-hover:rotate-180" />
              </a>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="bg-[#1E40AF] shadow-sm py-1">
          <div className="max-w-7xl mx-auto">
            <nav className="relative">
              <ul className="flex items-center justify-center overflow-x-auto whitespace-nowrap scrollbar-hide">
                {mainCategories.map((category) => (
                  <li key={category.name} className="relative px-1">
                    <Link
                      to={category.path}
                      className="flex flex-col items-center text-center text-white hover:opacity-80 px-3 py-1.5 transition-all hover:scale-105"
                      onMouseEnter={() => handleCategoryMouseEnter(category.name)}
                      onMouseLeave={handleCategoryMouseLeave}
                    >
                      <div className="w-8 h-8 mb-1 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        {category.icon === 'phone' && <i className="fas fa-mobile-alt text-lg"></i>}
                        {category.icon === 'laptop' && <i className="fas fa-laptop text-lg"></i>}
                        {category.icon === 'accessories' && <i className="fas fa-headphones text-lg"></i>}
                        {category.icon === 'watch' && <i className="fas fa-stopwatch text-lg"></i>}
                        {category.icon === 'clock' && <i className="fas fa-clock text-lg"></i>}
                        {category.icon === 'tablet' && <i className="fas fa-tablet-alt text-lg"></i>}
                        {category.icon === 'refurbished' && <i className="fas fa-exchange-alt text-lg"></i>}
                        {category.icon === 'monitor' && <i className="fas fa-desktop text-lg"></i>}
                        {category.icon === 'sim' && <i className="fas fa-sim-card text-lg"></i>}
                        {category.icon === 'services' && <i className="fas fa-concierge-bell text-lg"></i>}
                      </div>
                      <span className="text-xs font-medium">{category.name}</span>
                      {category.hasDropdown && (
                        <ChevronDown size={12} className="ml-1 transition-transform group-hover:rotate-180" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Dropdown menu for Phụ kiện */}
              {activeCategoryDropdown === 'Phụ kiện' && (
                <div
                  className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-b-lg z-50 animate-fadeDown"
                  onMouseEnter={() => setActiveCategoryDropdown('Phụ kiện')}
                  onMouseLeave={() => setActiveCategoryDropdown(null)}
                >
                  <div className="max-w-7xl mx-auto p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-8">
                        {/* Phụ kiện di động */}
                        <div>
                          <h3 className="font-medium mb-4 text-gray-800 border-b pb-2">Phụ kiện di động</h3>
                          <div className="grid grid-cols-3 gap-5">
                            {accessoriesCategories[0].items.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                className="flex flex-col items-center text-center group"
                              >
                                <div className="w-14 h-14 mb-2 bg-gray-100 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-gray-50 transition-all transform group-hover:scale-105">
                                  <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                                </div>
                                <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors">{item.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Thiết bị âm thanh */}
                        <div>
                          <h3 className="font-medium mb-4 text-gray-800 border-b pb-2">Thiết bị âm thanh</h3>
                          <div className="grid grid-cols-3 gap-5">
                            {accessoriesCategories[1].items.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                className="flex flex-col items-center text-center group"
                              >
                                <div className="w-14 h-14 mb-2 bg-gray-100 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-gray-50 transition-all transform group-hover:scale-105">
                                  <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                                </div>
                                <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors">{item.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* Camera / Flycam / Gimbal */}
                        <div>
                          <h3 className="font-medium mb-4 text-gray-800 border-b pb-2">Camera / Flycam / Gimbal</h3>
                          <div className="grid grid-cols-3 gap-5">
                            {accessoriesCategories[2].items.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                className="flex flex-col items-center text-center group"
                              >
                                <div className="w-14 h-14 mb-2 bg-gray-100 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-gray-50 transition-all transform group-hover:scale-105">
                                  <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                                </div>
                                <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors">{item.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Phụ kiện laptop */}
                        <div>
                          <h3 className="font-medium mb-4 text-gray-800 border-b pb-2">Phụ kiện laptop</h3>
                          <div className="grid grid-cols-3 gap-5">
                            {accessoriesCategories[3].items.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                className="flex flex-col items-center text-center group"
                              >
                                <div className="w-14 h-14 mb-2 bg-gray-100 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-gray-50 transition-all transform group-hover:scale-105">
                                  <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                                </div>
                                <span className="text-xs text-gray-700 group-hover:text-blue-600 transition-colors">{item.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thương hiệu hàng đầu - Special section */}
                    <div className="mt-8 pt-6 border-t">
                      <h3 className="font-medium mb-4 text-gray-800">Thương hiệu hàng đầu</h3>
                      <div className="grid grid-cols-6 gap-6">
                        {accessoriesCategories[4].items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="flex flex-col items-center text-center group"
                          >
                            <div className="w-16 h-16 mb-2 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-gray-50 transition-all transform group-hover:scale-105 border border-gray-200">
                              <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                            </div>
                            <span className="text-xs font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>

        <div className={`absolute top-0 left-0 w-4/5 h-full bg-white shadow-xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Mobile Menu Content */}
          <div className="flex flex-col h-full">
            {/* User info section */}
            <div className="bg-gradient-to-r from-[#2563EB] to-[#4F46E5] p-4">
              <div className="flex items-center">
                {/* Logo for mobile menu */}
                <div className="flex items-center mb-4">
                  <div className="bg-white rounded-lg p-1.5 mr-1 shadow-md">
                    <div className="text-[#2563EB] font-bold text-lg leading-none">TT</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-extrabold text-xl tracking-tight">Tech<span className="text-[#10B981] font-black">Trove</span></span>
                    <span className="text-white/70 text-[10px] -mt-1 tracking-wider font-medium">ELECTRONICS STORE</span>
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <>
                  <div className="flex items-center mt-4">
                    <div className="bg-white rounded-full p-3 mr-3">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div className="flex flex-col text-white">
                      <span className="text-sm font-medium">{user?.fullName?.split(' ').pop() || 'Người dùng'}</span>
                      <span className="text-xs text-white/80">{user?.phone}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex space-x-4">
                    <Link to="/account" className="flex-1 bg-white/20 rounded py-1.5 text-center text-white text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                      Tài khoản
                    </Link>
                    <Link to="/orders" className="flex-1 bg-white/20 rounded py-1.5 text-center text-white text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                      Đơn hàng
                    </Link>
                  </div>
                </>
              ) : (
                <div className="mt-4 flex space-x-4">
                  <Link 
                    to="/auth/login"
                    className="flex-1 bg-white rounded py-2 text-center text-blue-600 text-sm font-medium" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    to="/auth/register" 
                    className="flex-1 bg-white/20 rounded py-2 text-center text-white text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>

            {/* Location selector */}
            <a href="#" className="flex items-center p-4 border-b" onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              setIsAddressModalOpen(true);
            }}>
              <Map size={18} className="mr-3 text-blue-600" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Xem giá tại</span>
                <span className="text-sm font-medium">{currentLocation}</span>
              </div>
              <ChevronDown size={16} className="ml-auto" />
            </a>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {mainCategories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                      {category.icon === 'phone' && <i className="fas fa-mobile-alt text-sm text-blue-600"></i>}
                      {category.icon === 'laptop' && <i className="fas fa-laptop text-sm text-blue-600"></i>}
                      {/* ...rest of icons... */}
                    </div>
                    <span className="text-sm">{category.name}</span>
                    {category.hasDropdown && <ChevronDown size={16} className="ml-auto" />}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="p-4 border-t">
              <Link to="/notifications" className="flex items-center p-3 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                <Bell size={18} className="mr-3 text-blue-600" />
                <span className="text-sm">Thông báo</span>
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
              </Link>

              {isAuthenticated && (
                <button
                  className="flex items-center w-full p-3 hover:bg-gray-100 rounded-lg text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-3" />
                  <span className="text-sm">Đăng xuất</span>
                </button>
              )}

              <button
                className="w-full mt-3 bg-blue-600 py-2.5 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đóng menu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      <AddressSelection
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        onAddressSelected={handleAddressSelected}
      />

      {/* Add these styles to your global CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .header-shadow {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeDown {
          animation: fadeDown 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Header;