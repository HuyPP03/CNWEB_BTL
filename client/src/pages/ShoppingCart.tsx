import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ChevronLeft, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import AddressSelection from '../components/AddressSelection';
import { CartItem, RecommendedProduct } from '../types';
import { initialCartItems, recommendedProducts } from '../data';


const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [step, setStep] = useState<1 | 2>(1);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addedRecommendedProducts, setAddedRecommendedProducts] = useState<Record<string, boolean>>({});

  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    province: 'Hồ Chí Minh',
    district: '',
    ward: ''
  });

  // Delivery method
  const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'delivery'>('store');

  // Handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.min(newQuantity, item.stock) } : item
      )
    );
  };

  // Handle remove item
  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Handle adding recommended product to cart
  const handleAddRecommendedProduct = (product: RecommendedProduct) => {
    // Check if the product is already in the cart
    const existingProduct = cartItems.find(item => item.id === product.id);

    if (existingProduct) {
      // If product exists, increase quantity
      handleQuantityChange(existingProduct.id, existingProduct.quantity + 1);
    } else {
      // Add new product to cart
      const newCartItem: CartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: 1,
        stock: 10, // Assuming default stock is 10
        specifications: ''
      };

      setCartItems(prev => [...prev, newCartItem]);
    }

    // Mark the product as added
    setAddedRecommendedProducts(prev => ({
      ...prev,
      [product.id]: true
    }));

    // Show feedback (you could add a toast notification here if you want)
    setTimeout(() => {
      setAddedRecommendedProducts(prev => ({
        ...prev,
        [product.id]: false
      }));
    }, 2000);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0; // Could be calculated based on promotions
  const shipping = 0; // Could be calculated based on delivery method and address
  const total = subtotal - discount + shipping;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle address selection
  const handleAddressSelected = (address: { province: string; district: string; ward: string }) => {
    setCustomerInfo(prev => ({
      ...prev,
      province: address.province,
      district: address.district,
      ward: address.ward
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process order submission
    console.log('Order submitted', { cartItems, customerInfo, total });
    // Redirect to confirmation or payment page
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cartItems.length > 0) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  // Back to cart
  const backToCart = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  // Empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-16">
          <div className="mb-6 flex justify-center">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className={`flex items-center ${step === 1 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
            <span>Thông tin</span>
          </div>
          <div className="h-1 w-16 mx-3 bg-gray-200"></div>
          <div className={`flex items-center ${step === 2 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
            <span>Thanh toán</span>
          </div>
        </div>
      </div>

      {step === 1 ? (
        /* Step 1: Cart Items */
        <div>
          {/* Cart header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
            <span className="text-gray-500">{cartItems.length} sản phẩm</span>
          </div>

          {/* Cart items */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                {/* Product item */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row">
                    {/* Product image */}
                    <div className="w-full md:w-1/5 mb-4 md:mb-0 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mx-auto" />
                    </div>

                    {/* Product details */}
                    <div className="w-full md:w-3/5 md:px-4">
                      <Link to={`/product/${item.productId}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">{item.specifications}</div>

                      <div className="mt-4 flex items-center space-x-4">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`px-3 py-1 ${item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-blue-600'}`}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 border-x text-center w-12">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className={`px-3 py-1 ${item.quantity >= item.stock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-blue-600'}`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition-colors flex items-center"
                        >
                          <Trash2 size={16} className="mr-1" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="w-full md:w-1/5 mt-4 md:mt-0 text-right">
                      <div className="text-lg font-bold text-red-600">{formatCurrency(item.price)}</div>
                      {item.originalPrice > item.price && (
                        <div className="text-sm text-gray-500 line-through">{formatCurrency(item.originalPrice)}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommended products */}
                {recommendedProducts[item.productId] && recommendedProducts[item.productId].length > 0 && (
                  <div className="bg-gray-50 p-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Sản phẩm thường được mua cùng</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendedProducts[item.productId].map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm p-3 flex items-center">
                          <div className="w-16 h-16 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="ml-3 flex-grow">
                            <div className="text-sm font-medium text-gray-800 line-clamp-2">{product.name}</div>
                            <div className="flex items-center justify-between mt-1">
                              <div>
                                <span className="text-sm font-bold text-red-600">{formatCurrency(product.price)}</span>
                                <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(product.originalPrice)}</span>
                              </div>
                              <button
                                onClick={() => handleAddRecommendedProduct(product)}
                                className={`text-sm font-medium flex items-center transition-all duration-150 ${addedRecommendedProducts[product.id]
                                  ? 'text-green-600'
                                  : 'text-blue-600 hover:text-blue-700'
                                  }`}
                              >
                                {addedRecommendedProducts[product.id] ? (
                                  <>
                                    <Check size={16} className="mr-1" />
                                    <span>Đã thêm</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus size={16} className="mr-1" />
                                    <span>Thêm</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 p-6">
            <h2 className="text-lg font-bold mb-4">Tổng tiền tạm tính</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <span className="text-lg font-bold">Tổng tiền</span>
              <span className="text-xl font-bold text-red-600">{formatCurrency(total)}</span>
            </div>
            <div className="mt-6">
              <button
                onClick={proceedToCheckout}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Tiến hành đặt hàng
              </button>
              <Link
                to="/"
                className="w-full block text-center text-blue-600 mt-4 py-2 hover:underline"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Step 2: Payment Information */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer information form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Thông tin khách hàng</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-1 font-medium">Họ và tên</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Nhập email"
                    />
                    <p className="text-xs text-gray-500 mt-1">Hóa đơn VAT sẽ được gửi qua email này</p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-1 font-medium">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Thông tin nhận hàng</h2>

              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={deliveryMethod === 'store'}
                      onChange={() => setDeliveryMethod('store')}
                      className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Nhận tại cửa hàng</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={deliveryMethod === 'delivery'}
                      onChange={() => setDeliveryMethod('delivery')}
                      className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Giao hàng tận nơi</span>
                  </label>
                </div>

                {deliveryMethod === 'store' ? (
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Chọn địa chỉ cửa hàng</label>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="w-full px-4 py-2 bg-gray-100 text-left rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"
                    >
                      Chọn địa chỉ cửa hàng
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="province" className="block text-gray-700 mb-1 font-medium">Tỉnh/Thành phố</label>
                        <button
                          onClick={() => setIsAddressModalOpen(true)}
                          className="w-full px-4 py-2 bg-gray-100 text-left rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"
                        >
                          {customerInfo.province || 'Chọn tỉnh/thành phố'}
                        </button>
                      </div>
                      <div>
                        <label htmlFor="district" className="block text-gray-700 mb-1 font-medium">Quận/Huyện</label>
                        <button
                          onClick={() => setIsAddressModalOpen(true)}
                          className="w-full px-4 py-2 bg-gray-100 text-left rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"
                          disabled={!customerInfo.province}
                        >
                          {customerInfo.district || 'Chọn quận/huyện'}
                        </button>
                      </div>
                      <div>
                        <label htmlFor="ward" className="block text-gray-700 mb-1 font-medium">Phường/Xã</label>
                        <button
                          onClick={() => setIsAddressModalOpen(true)}
                          className="w-full px-4 py-2 bg-gray-100 text-left rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"
                          disabled={!customerInfo.district}
                        >
                          {customerInfo.ward || 'Chọn phường/xã'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-gray-700 mb-1 font-medium">Địa chỉ cụ thể</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nhập địa chỉ cụ thể (số nhà, tên đường)"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium">Chuyển khoản ngân hàng</div>
                    <div className="text-sm text-gray-500">Thanh toán trực tiếp vào tài khoản ngân hàng</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium">Thẻ ATM/Internet Banking</div>
                    <div className="text-sm text-gray-500">Hỗ trợ nhiều ngân hàng trong nước</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <button
                onClick={backToCart}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ChevronLeft size={20} />
                <span>Quay lại giỏ hàng</span>
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Đặt hàng
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                <span>Đơn hàng của bạn</span>
                <span className="text-gray-500 text-sm font-normal">{cartItems.length} sản phẩm</span>
              </h2>

              <div className="max-h-64 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex py-3 border-b border-gray-100 last:border-b-0">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="text-sm text-gray-800 line-clamp-2">{item.name}</div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">SL: {item.quantity}</span>
                        <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Tạm tính</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Giảm giá</span>
                    <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
                  </div>
                )}
                {deliveryMethod === 'delivery' && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Phí vận chuyển</span>
                    <span className="font-medium">{formatCurrency(shipping)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Tổng cộng</span>
                  <span className="text-xl font-bold text-red-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address selection modal */}
      <AddressSelection
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onAddressSelected={handleAddressSelected}
      />
    </div>
  );
};

export default ShoppingCart;