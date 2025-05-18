import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ChevronLeft, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import AddressSelection from '../components/AddressSelection';
import { CartItemV2, RecommendedProduct } from '../types/cart';
import cartService, { UpdateCartItemParams } from '../services/cart.service';
import productService from '../services/product.service';
import orderService, { CreateOrderParams, ConfirmOrderParams } from '../services/order.service';

const ShoppingCart: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItemV2[]>([]);
    const [step, setStep] = useState<1 | 2>(1);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addedRecommendedProducts, setAddedRecommendedProducts] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recommendedProductsMap, setRecommendedProductsMap] = useState<Record<string, RecommendedProduct[]>>({});

    // Customer information
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        province: 'Hà Nội',
        district: '',
        ward: ''
    });

    // Delivery method
    const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'delivery'>('store');

    // Hàm để lấy thông tin chi tiết của các biến thể sản phẩm
    const enrichCartItems = async (cartItems: CartItemV2[]) => {
        if (!cartItems || cartItems.length === 0) {
            return [];
        }

        // Lấy danh sách variantIds từ cart items
        const variantIds = cartItems
            .filter(item => item.productVariant?.id)
            .map(item => item.productVariant!.id);

        // Nếu không có variant ids thì trả về items gốc
        if (variantIds.length === 0) {
            return cartItems;
        }

        try {
            // Lấy từng variant một do API không hỗ trợ truy vấn nhiều ID
            const variantPromises = variantIds.map(id =>
                productService.getProductVariants({ id })
            );
            const variantResponses = await Promise.all(variantPromises);

            // Tạo map để truy cập nhanh variant theo id
            const variantMap = new Map();

            // Duyệt qua từng response để lấy variants
            variantResponses.forEach(response => {
                if (response.data && response.data.length > 0) {
                    response.data.forEach(variant => {
                        variantMap.set(variant.id, variant);
                    });
                }
            });

            // Cập nhật thông tin chi tiết cho mỗi cart item
            return cartItems.map(item => {
                if (item.productVariant?.id && variantMap.has(item.productVariant.id)) {
                    // Kết hợp thông tin hiện tại với thông tin chi tiết mới
                    return {
                        ...item,
                        productVariant: {
                            ...item.productVariant,
                            ...variantMap.get(item.productVariant.id)
                        }
                    };
                }
                return item;
            });
        } catch (error) {
            console.error('Error enriching cart items:', error);
            return cartItems;
        }
    };

    // Hàm để lấy sản phẩm đề xuất dựa trên category
    const fetchRecommendedProducts = async (items: CartItemV2[]) => {
        if (!items || items.length === 0) {
            setRecommendedProductsMap({});
            return;
        }

        try {
            // Thu thập các categoryId từ sản phẩm trong giỏ hàng
            const categoryIds: number[] = [];
            const productIds: string[] = []; // Để loại trừ các sản phẩm đã có trong giỏ hàng

            items.forEach(item => {
                if (item.productVariant?.product) {
                    // Thêm ID sản phẩm vào danh sách để loại trừ
                    if (item.productVariant.product.id) {
                        productIds.push(item.productVariant.product.id.toString());
                    }

                    // Thêm categoryId vào danh sách để tìm kiếm
                    if (item.productVariant.product.categoryId &&
                        !categoryIds.includes(item.productVariant.product.categoryId)) {
                        categoryIds.push(item.productVariant.product.categoryId);
                    }
                }
            });

            if (categoryIds.length === 0) {
                setRecommendedProductsMap({});
                return;
            }

            // Tạo các promise để lấy sản phẩm theo từng categoryId
            const productPromises = categoryIds.map(categoryId =>
                productService.getProducts({ categoryId, limit: 6 }) // Lấy nhiều sản phẩm hơn để có thể lọc
            );

            // Thực hiện tất cả các promise đồng thời
            const responses = await Promise.all(productPromises);

            // Map để lưu các sản phẩm được đề xuất cho mỗi sản phẩm trong giỏ hàng
            const newRecommendedMap: Record<string, RecommendedProduct[]> = {};
            // Xử lý dữ liệu cho mỗi sản phẩm trong giỏ hàng
            items.forEach(item => {
                if (item.productVariant?.product) {
                    const productId = item.productVariant.product.id.toString();
                    const categoryId = item.productVariant.product.categoryId;

                    if (categoryId) {
                        // Tìm các sản phẩm có cùng categoryId
                        const recommendedList: RecommendedProduct[] = [];

                        // Duyệt qua từng phản hồi API
                        responses.forEach(response => {
                            if (response.data && response.data.length > 0) {
                                // Lọc sản phẩm có cùng categoryId nhưng không có trong giỏ hàng
                                const matchingProducts = response.data
                                    .filter(p =>
                                        p.categoryId === categoryId &&
                                        !productIds.includes(p.id.toString()) &&
                                        p.id.toString() !== productId && // Không đề xuất chính sản phẩm đó
                                        p.productVariants &&
                                        p.productVariants.length > 0
                                    )
                                    .slice(0, 3); // Chỉ lấy tối đa 3 sản phẩm

                                // Chuyển đổi thành định dạng RecommendedProduct
                                matchingProducts.forEach(p => {
                                    const variant = p.productVariants[0];
                                    const imageUrl = variant.productImages && variant.productImages.length > 0
                                        ? variant.productImages[0].imageUrl
                                        : p.productImages && p.productImages.length > 0 && p.productImages[0].imageUrl;

                                    // Kiểm tra trùng lặp trước khi thêm vào danh sách
                                    if (!recommendedList.some(r => r.id === variant.id.toString())) {
                                        recommendedList.push({
                                            id: variant.id.toString(),
                                            name: p.name,
                                            image: imageUrl || '',
                                            price: parseFloat(variant.price),
                                            originalPrice: parseFloat(variant.price),
                                            discount: variant.discountPrice
                                                ? Math.round(((parseFloat(variant.price) - parseFloat(variant.discountPrice)) / parseFloat(variant.price)) * 100)
                                                : 0
                                        });
                                    }
                                });
                            }
                        });

                        // Nếu có sản phẩm đề xuất, lưu vào map
                        if (recommendedList.length > 0) {
                            newRecommendedMap[productId] = recommendedList;
                        }
                    }
                }
            });

            // Cập nhật state với map mới
            setRecommendedProductsMap(newRecommendedMap);
        } catch (error) {
            console.error('Error fetching recommended products:', error);
        }
    };

    // Fetch cart items on component mount
    useEffect(() => {
        const fetchCart = async () => {
            console.log('Fetching cart items...');
            try {
                setLoading(true);
                const response = await cartService.getCart();

                if (response && response.cart) {
                    const enrichedItems = await enrichCartItems(response.cart.cartItems);
                    setCartItems(enrichedItems);
                    await fetchRecommendedProducts(enrichedItems);
                } else {
                    setCartItems([]);
                }
            } catch (err) {
                console.error('Error fetching cart:', err);
                setError('Có lỗi xảy ra khi tải giỏ hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Handle quantity change
    const handleQuantityChange = async (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            // Tìm item trong giỏ hàng để kiểm tra stock
            const item = cartItems.find(item => item.id === id);
            if (item && item.productVariant && newQuantity > item.productVariant.stock) {
                // Không cho phép đặt số lượng vượt quá stock
                return;
            }

            // Cập nhật số lượng trên UI trước để người dùng thấy phản hồi ngay lập tức
            setCartItems(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );

            // Gửi yêu cầu cập nhật lên server
            const params: UpdateCartItemParams = { quantity: newQuantity };
            await cartService.updateCartItem(id, params);

            // Tải lại giỏ hàng từ server để đảm bảo dữ liệu đồng bộ
            const updatedCart = await cartService.getCart();
            if (updatedCart && updatedCart.cart) {
                const enrichedItems = await enrichCartItems(updatedCart.cart.cartItems);
                setCartItems(enrichedItems);
                await fetchRecommendedProducts(enrichedItems);
            }
        } catch (err) {
            console.error('Error updating cart item:', err);
            // Reload cart to restore original state
            const updatedCart = await cartService.getCart();
            if (updatedCart && updatedCart.cart) {
                const enrichedItems = await enrichCartItems(updatedCart.cart.cartItems);
                setCartItems(enrichedItems);
                await fetchRecommendedProducts(enrichedItems);
            }
        }
    };

    // Handle remove item
    const handleRemoveItem = async (id: number) => {
        try {
            await cartService.removeCartItem(id);

            // Update local state immediately for better UX
            setCartItems(prev => prev.filter(item => item.id !== id));

            // But also fetch from server to ensure consistency
            const updatedCart = await cartService.getCart();
            if (updatedCart && updatedCart.cart) {
                const enrichedItems = await enrichCartItems(updatedCart.cart.cartItems);
                setCartItems(enrichedItems);
                await fetchRecommendedProducts(enrichedItems);
            }
        } catch (err) {
            console.error('Error removing cart item:', err);
            // Reload cart to ensure consistency
            const updatedCart = await cartService.getCart();
            if (updatedCart && updatedCart.cart) {
                const enrichedItems = await enrichCartItems(updatedCart.cart.cartItems);
                setCartItems(enrichedItems);
                await fetchRecommendedProducts(enrichedItems);
            }
        }
    };

    // Handle adding recommended product to cart
    const handleAddRecommendedProduct = async (product: RecommendedProduct) => {
        try {
            // Mark the product as added immediately for better UX
            setAddedRecommendedProducts(prev => ({
                ...prev,
                [product.id]: true
            }));


            // Add to cart
            console.log('Adding recommended product to cart:', product.id, product.name);
            await cartService.addToCart({
                variantId: parseInt(product.id, 10),
                quantity: 1
            });

            // Reload cart with enriched data
            const updatedCart = await cartService.getCart();
            if (updatedCart && updatedCart.cart) {
                const enrichedItems = await enrichCartItems(updatedCart.cart.cartItems);
                setCartItems(enrichedItems);
                await fetchRecommendedProducts(enrichedItems);
            }

            // Show feedback with timeout to reset button state
            setTimeout(() => {
                setAddedRecommendedProducts(prev => ({
                    ...prev,
                    [product.id]: false
                }));
            }, 2000);
        } catch (err) {
            console.error('Error adding product to cart:', err);
            // Reset button state on error
            setAddedRecommendedProducts(prev => ({
                ...prev,
                [product.id]: false
            }));
        }
    };

    // Calculate totals using the cartService utility
    const calculateTotals = () => {
        if (!cartItems.length) return { subtotal: 0, discount: 0, total: 0 };

        // Create a Cart object to pass to cartService.calculateTotal
        const cart = {
            id: 0, // These values don't matter for calculation
            customerId: 0,
            sessionId: null,
            createdAt: '',
            updatedAt: '',
            cartItems: cartItems
        };

        return cartService.calculateTotal(cart);
    };

    const { subtotal, discount, total } = calculateTotals();
    const shipping = 0; // Could be calculated based on delivery method and address

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
        setIsAddressModalOpen(false);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        if (!customerInfo.name.trim()) {
            alert('Vui lòng nhập họ tên');
            return;
        }

        if (!customerInfo.phone.trim()) {
            alert('Vui lòng nhập số điện thoại');
            return;
        }

        // Validate address if delivery method is not store pickup
        if (deliveryMethod === 'delivery') {
            if (!customerInfo.province || !customerInfo.district || !customerInfo.ward) {
                alert('Vui lòng chọn đầy đủ địa chỉ (tỉnh/thành phố, quận/huyện, phường/xã)');
                return;
            }

            if (!customerInfo.address.trim()) {
                alert('Vui lòng nhập địa chỉ cụ thể');
                return;
            }
        }

        try {
            setLoading(true);

            // 1. Get the cart item IDs to create the order
            const itemIds = cartItems.map(item => item.id);

            // 2. Create a new order with the cart items
            const createOrderParams: CreateOrderParams = {
                itemIds: itemIds
            };

            const orderResponse = await orderService.createOrder(createOrderParams);
            const orderId = orderResponse.data.id;

            // 3. Prepare shipping information
            let shippingAddress = '';
            if (deliveryMethod === 'store') {
                shippingAddress = 'Nhận tại cửa hàng';
            } else {
                // Combine address components
                shippingAddress = `${customerInfo.address}, ${customerInfo.ward}, ${customerInfo.district}, ${customerInfo.province}`;
            }

            // 4. Create params for order confirmation
            const confirmOrderParams: ConfirmOrderParams = {
                name: customerInfo.name,
                email: customerInfo.email,
                phone: customerInfo.phone,
                shippingAddress: shippingAddress,
                paymentMethod: 'COD' // Default to Cash on Delivery for now
            };

            // 5. Confirm the order with shipping and payment details
            await orderService.confirmOrder(orderId, confirmOrderParams);

            // 6. Navigate to the order details page
            navigate(`/orders/${orderId}`);

        } catch (error) {
            console.error('Error during order submission:', error);
            setError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
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
    };    // Show loading state
    if (loading && cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-lg text-gray-600">Đang tải thông tin giỏ hàng...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        );
    }

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
                                            {item.productVariant?.productImages && item.productVariant.productImages.length > 0 ? (
                                                <img
                                                    src={item.productVariant.productImages[0].imageUrl}
                                                    alt={item.productVariant.product?.name || "Product image"}
                                                    className="w-24 h-24 object-contain mx-auto"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center mx-auto">
                                                    <span className="text-gray-500 text-sm">No image</span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Product details */}
                                        <div className="w-full md:w-3/5 md:px-4">
                                            <Link
                                                to={`/product/${item.productVariant?.product?.slug || ''}`}
                                                className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                                            >
                                                {item.productVariant?.product?.name || 'Sản phẩm không xác định'}
                                            </Link>
                                            {/* <div className="text-sm text-gray-500 mt-1">
                                                {item.productVariant?.variantAttributes?.map(attr =>
                                                    `${attr.name}: ${attr.attributeValue.value}`
                                                ).join(', ')}
                                            </div> */}

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
                                                        disabled={!item.productVariant || item.quantity >= item.productVariant.stock}
                                                        className={`px-3 py-1 ${!item.productVariant || item.quantity >= item.productVariant.stock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-blue-600'}`}
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
                                            <div className="text-lg font-bold text-red-600">
                                                {formatCurrency(item.productVariant ?
                                                    parseFloat(item.productVariant.discountPrice || item.productVariant.price) * item.quantity
                                                    : 0
                                                )}
                                            </div>
                                            {item.productVariant && item.productVariant.discountPrice && (
                                                <div className="text-sm text-gray-500 line-through">
                                                    {formatCurrency(parseFloat(item.productVariant.price) * item.quantity)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Recommended products */}
                                {item.productVariant && item.productVariant.product && recommendedProductsMap[item.productVariant.product.id] && recommendedProductsMap[item.productVariant.product.id].length > 0 && (
                                    <div className="bg-gray-50 p-4 border-t border-gray-100">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Sản phẩm thường được mua cùng</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {recommendedProductsMap[item.productVariant.product.id].map((product: RecommendedProduct) => (
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
                                        {/* <label className="block text-gray-700 mb-1 font-medium">Chọn địa chỉ cửa hàng</label>
                                        <button
                                            onClick={() => setIsAddressModalOpen(true)}
                                            className="w-full px-4 py-2 bg-gray-100 text-left rounded-md border border-gray-300 hover:bg-gray-200 transition-colors"
                                        >
                                            Chọn địa chỉ cửa hàng
                                        </button> */}
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
                        </div>                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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

                            {/* Error message */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between mb-6">
                            <button
                                onClick={backToCart}
                                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <ChevronLeft size={20} />
                                <span>Quay lại giỏ hàng</span>
                            </button>                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
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
                                            {item.productVariant?.productImages && item.productVariant.productImages.length > 0 ? (
                                                <img
                                                    src={item.productVariant.productImages[0].imageUrl}
                                                    alt={item.productVariant.product?.name || "Product image"}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs">No image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3 flex-grow">
                                            <div className="text-sm text-gray-800 line-clamp-2">
                                                {item.productVariant?.product?.name || 'Sản phẩm không xác định'}
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-sm text-gray-500">SL: {item.quantity}</span>
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(item.productVariant ?
                                                        parseFloat(item.productVariant.discountPrice || item.productVariant.price) * item.quantity
                                                        : 0
                                                    )}
                                                </span>
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
