import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Map, Search, ShoppingCart, User, X, Bell, Menu, LogOut, Heart, ShoppingBag } from 'lucide-react';
import AddressSelection from './AddressSelection';
import { useAuth } from '../hooks/useAuth';
import cartService from '../services/cart.service';
import productService from '../services/product.service';
import { accessoriesCategories, mainCategories } from '../data/category';

// suggestions type
interface SuggestionProduct {
  id: number;
  name: string;
  slug: string;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

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
      // Use product service to fetch suggestions
      const fetchSuggestions = async () => {
        try {
          const response = await productService.getProducts({
            name: searchQuery,
            limit: 5
          });

          if (response && response.data) {
            setSuggestedProducts(response.data.map(product => {
              // Use the first variant for price information
              const mainVariant = product.productVariants && product.productVariants.length > 0
                ? product.productVariants[0]
                : null;

              // Get the main product image
              const mainImage = product.productImages && product.productImages.length > 0
                ? product.productImages.find(img => img.isPrimary)?.imageUrl || product.productImages[0].imageUrl
                : '';

              // Calculate price information
              const originalPrice = mainVariant ? parseFloat(mainVariant.price) : 0;
              const currentPrice = mainVariant && mainVariant.discountPrice
                ? originalPrice - parseFloat(mainVariant.discountPrice)
                : originalPrice;

              // Calculate discount percentage
              const discountPercentage = originalPrice > 0 && currentPrice < originalPrice
                ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                : 0;

              return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: mainImage,
                price: currentPrice,
                originalPrice: originalPrice,
                discountPercentage,
                category: product.categoryId ? product.categoryId.toString() : undefined
              };
            }));
          }

          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching product suggestions:', error);
          setSuggestedProducts([]);
        }
      };

      fetchSuggestions();
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Fetch cart items count
  useEffect(() => {
    const fetchCartItemsCount = async () => {
      if (isAuthenticated) {
        try {
          const cartResponse = await cartService.getCart();
          if (cartResponse && cartResponse.cart) {
            // Count the total number of items (not just unique items)
            const totalItems = cartResponse.cart.cartItems.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0
            );
            setCartItemCount(totalItems);
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    fetchCartItemsCount();
  }, [isAuthenticated]);

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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
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
              <form onSubmit={handleSearchSubmit} className="flex items-center rounded-full overflow-hidden shadow-md border border-indigo-100">
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
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={clearSearch}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-[#4F46E5] h-full px-4 text-white flex items-center justify-center hover:bg-[#4338CA] transition-colors"
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Search suggestions dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-xl overflow-hidden mt-2 z-50 border border-gray-100 animate-fadeDown">
                  {/* Suggested text - "Có phải bạn muốn tìm" */}
                  {/* <div className="p-3 text-sm text-gray-500 border-b bg-gray-50">
                    <span className="font-medium">Có phải bạn muốn tìm</span>
                  </div> */}

                  {/* Special link for brand page - shown when searching Samsung */}
                  {/* {searchQuery.toLowerCase().includes('samsung') && (
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
                  )}                   */}
                  {/* Category suggestions */}
                  {/* {suggestedCategories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/search?query=${encodeURIComponent(category)}`}
                      className="block px-4 py-2.5 hover:bg-gray-50 text-blue-600 transition-colors"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <div className="flex items-center">
                        <Search size={14} className="mr-2 text-gray-400" />
                        <span>{category}</span>
                      </div>
                    </Link>
                  ))} */}

                  {/* Suggested products section */}
                  {suggestedProducts.length > 0 && (
                    <div className="border-t">
                      <h3 className="px-4 py-2.5 text-gray-500 text-sm font-medium bg-gray-50">Sản phẩm gợi ý</h3>
                      {suggestedProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.slug}`}
                          className="flex p-3 hover:bg-gray-50 border-b transition-colors"
                          onClick={() => setShowSuggestions(false)}
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
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-50 animate-fadeDown border border-gray-100 overflow-hidden">
                      {/* User header with avatar */}
                      <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-medium shadow-sm">
                            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-3">
                            <p className="font-semibold text-gray-800">{user?.fullName}</p>
                            <p className="text-xs text-gray-500">{user?.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="px-2 py-2">
                        <Link
                          to="/account"
                          className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mr-3 text-blue-600">
                            <User size={15} />
                          </div>
                          <span>Tài khoản của tôi</span>
                        </Link>

                        <Link
                          to="/orders"
                          className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full mr-3 text-amber-600">
                            <ShoppingBag size={15} />
                          </div>
                          <span>Đơn hàng của tôi</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-full mr-3 text-red-600">
                            <Heart size={15} />
                          </div>
                          <span>Sản phẩm yêu thích</span>
                        </Link>

                        <Link
                          to="/notifications"
                          className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full mr-3 text-purple-600">
                            <Bell size={15} />
                          </div>
                          <span>Thông báo</span>
                        </Link>
                      </div>

                      {/* Logout button */}
                      <div className="mt-1 px-2 pt-2 border-t border-gray-100">
                        <button
                          className="flex w-full items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={handleLogout}
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-full mr-3">
                            <LogOut size={15} />
                          </div>
                          <span className="font-medium">Đăng xuất</span>
                        </button>
                      </div>
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

              {/* Cart */}
              <Link to="/cart" className="flex items-center text-white hover:opacity-80 group relative">
                <div className="bg-white/20 rounded-full p-2 mr-1 md:mr-2 group-hover:bg-white/30 transition-all relative">
                  <ShoppingCart size={18} className="text-white" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 border border-white/30 shadow-sm">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
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
                      <div className="w-8 h-8 mb-1 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors">                      {category.icon === 'phone' && <i className="fas fa-mobile-alt text-lg"></i>}
                        {category.icon === 'laptop' && <i className="fas fa-laptop text-lg"></i>}
                        {category.icon === 'accessories' && <i className="fas fa-headphones text-lg"></i>}
                        {category.icon === 'watch' && <i className="fas fa-stopwatch text-lg"></i>}
                        {category.icon === 'clock' && <i className="fas fa-clock text-lg"></i>}
                        {category.icon === 'tablet' && <i className="fas fa-tablet-alt text-lg"></i>}
                        {category.icon === 'monitor' && <i className="fas fa-desktop text-lg"></i>}
                        {category.icon === 'camera' && <i className="fas fa-camera text-lg"></i>}
                        {category.icon === 'cctv' && <i className="fas fa-video text-lg"></i>}
                        {category.icon === 'printer' && <i className="fas fa-print text-lg"></i>}
                      </div>
                      <span className="text-xs font-medium">{category.name}</span>
                      {/* {category.hasDropdown && (
                        <ChevronDown size={12} className="ml-1 transition-transform group-hover:rotate-180" />
                      )} */}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Dropdown menu for Phụ kiện */}
              {activeCategoryDropdown === 'Phụ kiện' && (
                <div
                  className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-b-lg z-50 animate-fadeDown max-h-[65vh] overflow-y-auto modern-scrollbar"
                  onMouseEnter={() => setActiveCategoryDropdown('Phụ kiện')}
                  onMouseLeave={() => setActiveCategoryDropdown(null)}
                >                  <div className="max-w-7xl mx-auto p-4">
                    <div className="grid grid-cols-2 gap-6">                      <div className="space-y-6">
                      {/* Phụ kiện di động */}
                      <div>                        <h3 className="font-medium mb-3 text-gray-800 border-b pb-1.5">Phụ kiện di động</h3>
                        <div className="grid grid-cols-3 gap-3">
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
                      <div>                        <h3 className="font-medium mb-3 text-gray-800 border-b pb-1.5">Thiết bị âm thanh</h3>
                        <div className="grid grid-cols-3 gap-3">
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
                    </div>                      <div className="space-y-6">
                        {/* Camera / Flycam / Gimbal */}
                        <div>                          <h3 className="font-medium mb-3 text-gray-800 border-b pb-1.5">Camera / Flycam / Gimbal</h3>
                          <div className="grid grid-cols-3 gap-3">
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
                        <div>                          <h3 className="font-medium mb-4 text-gray-800 border-b pb-2">Phụ kiện laptop</h3>
                          <div className="grid grid-cols-3 gap-3">
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
                    </div>                    {/* Thương hiệu hàng đầu - Special section */}
                    <div className="mt-5 pt-4 border-t">                      <h3 className="font-medium mb-3 text-gray-800">Thương hiệu hàng đầu</h3>
                      <div className="grid grid-cols-6 gap-3">
                        {accessoriesCategories[4].items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="flex flex-col items-center text-center group"
                          >                            <div className="w-14 h-14 mb-2 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-gray-50 transition-all transform group-hover:scale-105 border border-gray-200">
                              <img src={item.image} alt={item.name} className="w-9 h-9 object-contain" />
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
            </a>            {/* Categories */}
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
                      {category.icon === 'accessories' && <i className="fas fa-headphones text-sm text-blue-600"></i>}
                      {category.icon === 'watch' && <i className="fas fa-stopwatch text-sm text-blue-600"></i>}
                      {category.icon === 'clock' && <i className="fas fa-clock text-sm text-blue-600"></i>}
                      {category.icon === 'tablet' && <i className="fas fa-tablet-alt text-sm text-blue-600"></i>}
                      {category.icon === 'monitor' && <i className="fas fa-desktop text-sm text-blue-600"></i>}
                      {category.icon === 'camera' && <i className="fas fa-camera text-sm text-blue-600"></i>}
                      {category.icon === 'cctv' && <i className="fas fa-video text-sm text-blue-600"></i>}
                      {category.icon === 'printer' && <i className="fas fa-print text-sm text-blue-600"></i>}
                    </div>
                    <span className="text-sm">{category.name}</span>
                    {category.hasDropdown && <ChevronDown size={16} className="ml-auto" />}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom actions */}            <div className="p-4 border-t">
              <Link to="/notifications" className="flex items-center p-3 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                <Bell size={18} className="mr-3 text-blue-600" />
                <span className="text-sm">Thông báo</span>
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
              </Link>

              <Link to="/wishlist" className="flex items-center p-3 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                <Heart size={18} className="mr-3 text-blue-600" />
                <span className="text-sm">Danh sách yêu thích</span>
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
        
        /* Modern scrollbar styling */
        .modern-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .modern-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 241, 241, 0.5);
          border-radius: 10px;
        }
        .modern-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(136, 136, 136, 0.5);
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        .modern-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(85, 85, 85, 0.7);
        }
        .modern-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(136, 136, 136, 0.5) rgba(241, 241, 241, 0.5);
        }
      `}</style>
    </>
  );
};

export default Header;