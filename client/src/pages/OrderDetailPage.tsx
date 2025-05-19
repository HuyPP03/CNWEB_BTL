import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, AlertCircle, RefreshCw, X, Check, Truck, Package, CreditCard } from 'lucide-react';
import { Order, OrderStatus } from '../types/order';
import { useAuth } from '../hooks/useAuth';
import orderService from '../services/order.service';
import { EnhancedOrderItem, fetchProductDetailsForOrderItems } from '../utils/orderEnhancer';

// Enhanced order interface with enhanced order items
interface EnhancedOrder extends Omit<Order, 'orderItems'> {
    orderItems: EnhancedOrderItem[];
}

// Format currency
const formatCurrency = (amount: string): string => {
    return new Intl.NumberFormat('vi-VN').format(parseFloat(amount)) + '₫';
};

// Format date
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Status badge component
const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'processing':
                return 'Đã xác nhận';
            case 'shipped':
                return 'Đang vận chuyển';
            case 'delivered':
                return 'Đã giao hàng';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return <AlertCircle size={16} className="mr-1" />;
            case 'processing':
                return <RefreshCw size={16} className="mr-1" />;
            case 'shipped':
                return <Truck size={16} className="mr-1" />;
            case 'delivered':
                return <Check size={16} className="mr-1" />;
            case 'cancelled':
                return <X size={16} className="mr-1" />;
            default:
                return null;
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            {getStatusText(status)}
        </span>
    );
};

const OrderDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState<EnhancedOrder | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);
    // Fetch order details
    const fetchOrderDetails = useCallback(async () => {
        if (!id || !user) return;
        setIsLoading(true);
        setError(null);

        try {
            // Get all orders and find the one matching the ID
            const response = await orderService.getOrders({ id: parseInt(id) });

            if (response && response.length > 0) {
                const orderData = response[0];

                // Enhance order items with full product details
                const enhancedItems = await fetchProductDetailsForOrderItems(orderData.orderItems);

                // Set the enhanced order
                setOrder({
                    ...orderData,
                    orderItems: enhancedItems
                });
            } else {
                setError('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại.');
            }
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    }, [id, user]);

    // Cancel order
    const handleCancelOrder = async () => {
        if (!id || !order) return;
        setIsCancelling(true);

        try {
            const cancelledOrder = await orderService.cancelOrder(parseInt(id));
            // Update local order state with the cancelled order data
            setOrder({
                ...order,
                status: cancelledOrder.status,
            });
            setShowCancelConfirm(false);
        } catch (err) {
            console.error('Error cancelling order:', err);
            setError('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setIsCancelling(false);
        }
    };

    // Can the order be cancelled?
    const canCancel = () => {
        if (!order) return false;
        // Only allow cancellation for orders in draft or pending state
        return ['draft', 'pending'].includes(order.status);
    };
    // Fetch order on component mount
    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen p-6 flex flex-col items-center justify-center">
                <RefreshCw size={36} className="text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white min-h-screen p-6 flex flex-col items-center justify-center">
                <AlertCircle size={36} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-700 mb-2">Đã xảy ra lỗi</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex gap-4">
                    <button
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        onClick={() => navigate('/orders')}
                    >
                        Quay lại danh sách đơn hàng
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={fetchOrderDetails}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-white min-h-screen p-6 flex flex-col items-center justify-center">
                <AlertCircle size={36} className="text-yellow-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy đơn hàng</h2>
                <p className="text-gray-600 mb-6">Đơn hàng không tồn tại hoặc bạn không có quyền xem đơn hàng này.</p>
                <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => navigate('/orders')}
                >
                    Quay lại danh sách đơn hàng
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <div className="container mx-auto px-4 py-6">
                {/* Navigation back to orders */}
                <div className="mb-6">
                    <Link
                        to="/orders"
                        className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span>Quay lại danh sách đơn hàng</span>
                    </Link>
                </div>

                {/* Order header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
                                <StatusBadge status={order.status} />
                            </div>
                            <p className="text-gray-600">Ngày đặt: {formatDate(order.createdAt)}</p>
                            {order.status === 'cancelled' && (
                                <p className="text-red-600 mt-2">Đơn hàng này đã bị hủy.</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {canCancel() && (
                                <button
                                    className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                    onClick={() => setShowCancelConfirm(true)}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? (
                                        <>
                                            <RefreshCw size={16} className="inline mr-2 animate-spin" />
                                            Đang hủy...
                                        </>
                                    ) : (
                                        <>Hủy đơn hàng</>
                                    )}
                                </button>
                            )}
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={fetchOrderDetails}
                            >
                                Làm mới
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order details and items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order items */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="font-semibold text-gray-800">Sản phẩm trong đơn hàng</h2>
                            </div>
                            <div className="p-4">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex items-start py-4 first:pt-0 last:pb-0 border-b last:border-0 border-gray-100">
                                        <div className="w-20 h-20 rounded-md border border-gray-200 overflow-hidden flex-shrink-0 mr-4">
                                            {item.productVariant && (
                                                <img
                                                    src={
                                                        // Use product image if available, otherwise use slug-based image
                                                        item.fullProduct && item.fullProduct.productImages && item.fullProduct.productImages.length > 0
                                                            ? item.fullProduct.productImages[0].imageUrl
                                                            : `https://cnweb-btl.onrender.com/images/products/${item.productVariant.slug}.jpg`
                                                    }
                                                    alt={item.productVariant.name || item.productVariant.slug}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "https://cdn.tgdd.vn/Products/Images/42/299033/iphone-15-pro-max-blue-titanium-600x600.jpg";
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-gray-900">{item.productVariant?.name || item.productVariant?.slug}</h3>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-blue-600 font-medium">{formatCurrency(item.priceAtTime)}</p>
                                                <p className="text-gray-500 text-sm">SL: {item.quantity}</p>
                                            </div>
                                            <div className="mt-2">
                                                {item.fullProduct && (
                                                    <Link to={`/product/${item.fullProduct.slug}`} className="text-sm text-blue-500 hover:underline inline-block">
                                                        Xem sản phẩm
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 p-4 flex justify-between items-center">
                                <p className="text-gray-600">Tổng ({order.orderItems.length} sản phẩm):</p>
                                <p className="text-xl font-bold text-blue-600">{formatCurrency(order.totalAmount)}</p>
                            </div>
                        </div>

                        {/* Order status timeline */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="font-semibold text-gray-800 mb-4">Trạng thái đơn hàng</h2>
                            <div className="relative border-l-2 border-gray-200 pl-6 pb-2">
                                <div className="mb-6 relative">
                                    <div className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center 
                    ${order.status !== 'cancelled' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                        <Check size={14} />
                                    </div>
                                    <h3 className="font-medium">Đặt hàng</h3>
                                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                    <p className="text-sm text-gray-600 mt-1">Đơn hàng đã được tạo thành công.</p>
                                </div>

                                {order.status === 'cancelled' ? (
                                    <div className="mb-6 relative">
                                        <div className="absolute -left-[25px] w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                                            <X size={14} />
                                        </div>
                                        <h3 className="font-medium">Đã hủy</h3>
                                        <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                                        <p className="text-sm text-gray-600 mt-1">Đơn hàng đã bị hủy.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6 relative">
                                            <div className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center 
                        ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                                <Check size={14} />
                                            </div>
                                            <h3 className="font-medium">Xác nhận</h3>
                                            {['processing', 'shipped', 'delivered'].includes(order.status) ? (
                                                <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                                            ) : (
                                                <p className="text-sm text-gray-400">Đang chờ xác nhận</p>
                                            )}
                                        </div>

                                        <div className="mb-6 relative">
                                            <div className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center 
                        ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                                <Truck size={14} />
                                            </div>
                                            <h3 className="font-medium">Vận chuyển</h3>
                                            {['shipped', 'delivered'].includes(order.status) ? (
                                                <div>
                                                    <p className="text-sm text-gray-500">{order.shipping?.shippedAt ? formatDate(order.shipping.shippedAt) : formatDate(order.updatedAt)}</p>
                                                    {order.shipping?.trackingNumber && (
                                                        <p className="text-sm text-gray-600 mt-1">Mã vận đơn: {order.shipping.trackingNumber}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400">Đang chờ vận chuyển</p>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <div className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center 
                        ${order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                                <Package size={14} />
                                            </div>
                                            <h3 className="font-medium">Giao hàng</h3>
                                            {order.status === 'delivered' ? (
                                                <p className="text-sm text-gray-500">{order.shipping?.deliveredAt ? formatDate(order.shipping.deliveredAt) : formatDate(order.updatedAt)}</p>
                                            ) : (
                                                <p className="text-sm text-gray-400">Chưa giao hàng</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer info and payment */}
                    <div className="space-y-6">
                        {/* Customer info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="font-semibold text-gray-800 mb-4">Thông tin khách hàng</h2>
                            <div className="space-y-3">
                                <p className="text-gray-600">
                                    <span className="font-medium block text-gray-700">Người mua:</span>
                                    {user?.fullName || 'Chưa cập nhật'}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium block text-gray-700">Email:</span>
                                    {user?.email || 'Chưa cập nhật'}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium block text-gray-700">Số điện thoại:</span>
                                    {user?.phone || 'Chưa cập nhật'}
                                </p>
                            </div>
                        </div>

                        {/* Shipping info */}
                        {order.shipping && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="font-semibold text-gray-800 mb-4">Thông tin giao hàng</h2>
                                <div className="space-y-3">
                                    <p className="text-gray-600">
                                        <span className="font-medium block text-gray-700">Người nhận:</span>
                                        {order.shipping.name}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium block text-gray-700">Email:</span>
                                        {order.shipping.email}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium block text-gray-700">Số điện thoại:</span>
                                        {order.shipping.phone}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium block text-gray-700">Địa chỉ giao hàng:</span>
                                        {order.shipping.shippingAddress}
                                    </p>
                                    {order.shipping.shippingProvider && (
                                        <p className="text-gray-600">
                                            <span className="font-medium block text-gray-700">Đơn vị vận chuyển:</span>
                                            {order.shipping.shippingProvider}
                                        </p>
                                    )}
                                    {order.shipping.trackingNumber && (
                                        <p className="text-gray-600">
                                            <span className="font-medium block text-gray-700">Mã vận đơn:</span>
                                            {order.shipping.trackingNumber}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Payment info */}
                        {order.payments && order.payments.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="font-semibold text-gray-800 mb-4">Thông tin thanh toán</h2>
                                <div className="space-y-3">
                                    <p className="text-gray-600">
                                        <span className="font-medium block text-gray-700">Phương thức:</span>
                                        <span className="flex items-center mt-1">
                                            <CreditCard size={16} className="mr-2 text-blue-500" />
                                            {order.payments[0].paymentMethod}
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium block text-gray-700">Trạng thái:</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block mt-1 
                      ${order.payments[0].status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {order.payments[0].status === 'success' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium block text-gray-700">Số tiền:</span>
                                        <span className="text-blue-600 font-medium">{formatCurrency(order.payments[0].amount)}</span>
                                    </p>
                                    {order.payments[0].transactionId && (
                                        <p className="text-gray-600">
                                            <span className="font-medium block text-gray-700">Mã giao dịch:</span>
                                            {order.payments[0].transactionId}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>            {/* Cancel confirmation modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Xác nhận hủy đơn hàng</h3>
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600 mb-4">Bạn có chắc chắn muốn hủy đơn hàng #{order.id}?</p>
                            <p className="text-gray-600">Hành động này không thể hoàn tác.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                disabled={isCancelling}
                            >
                                Không hủy
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                disabled={isCancelling}
                            >
                                {isCancelling ? (
                                    <>
                                        <RefreshCw size={16} className="mr-2 animate-spin" />
                                        Đang hủy...
                                    </>
                                ) : (
                                    <>Xác nhận hủy</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}            <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default OrderDetailPage;
