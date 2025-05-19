import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Check, X, ChevronLeft } from 'lucide-react';
import { paymentService } from '../services/payment.service';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Use the improved payment service to validate the callback
    const result = paymentService.validatePaymentCallback(location.pathname, searchParams);
    setOrderId(result.orderId);
    
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('failure');
      setErrorMessage(result.message);
    }
  }, [location.pathname, searchParams]);

  // Navigate to order details after 5 seconds if successful
  useEffect(() => {
    if (status === 'success' && orderId) {
      const timer = setTimeout(() => {
        navigate(`/orders/${orderId}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status, orderId, navigate]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Đang xác thực thanh toán...</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={32} className="text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công</h2>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
            </p>
            {orderId && (
              <p className="text-gray-600 mb-6">
                Mã đơn hàng: <span className="font-medium">{orderId}</span>
              </p>
            )}
            <p className="text-gray-500 mb-6">
              Bạn sẽ được chuyển đến trang chi tiết đơn hàng sau 5 giây...
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/orders"
                className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Xem đơn hàng của tôi
              </Link>
              <Link
                to="/"
                className="text-blue-600 border border-blue-600 py-2 px-6 rounded-md font-medium hover:bg-blue-50 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </>
        )}

        {status === 'failure' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <X size={32} className="text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Thanh toán thất bại</h2>
            <p className="text-gray-600 mb-6">
              {errorMessage || 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              {orderId && (
                <Link
                  to={`/orders/${orderId}`}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Xem đơn hàng
                </Link>
              )}
              <Link
                to="/cart"
                className="flex items-center justify-center text-blue-600 border border-blue-600 py-2 px-6 rounded-md font-medium hover:bg-blue-50 transition-colors"
              >
                <ChevronLeft size={16} className="mr-1" />
                Quay lại giỏ hàng
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
