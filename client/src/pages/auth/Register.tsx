import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Info, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/Logo';

// Adding custom animation styles
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out forwards;
  }
`;

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [studentRole, setStudentRole] = useState(false);
  const [passwordError, setPasswordError] = useState(''); const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register, error, clearError, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (password) {
      if (password.length < 6) {
        setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      } else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        setPasswordError('Mật khẩu phải chứa ít nhất 1 chữ và 1 số');
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordError('');
    }
  }, [password]);

  // Clear error when inputs change
  useEffect(() => {
    if (error) {
      // Create a timer to clear the error after a delay when the user makes changes
      // to the field that caused the error
      const timer = setTimeout(() => {
        if (
          (error.toLowerCase().includes('email') && email) ||
          (error.toLowerCase().includes('điện thoại') && phone) ||
          (fullName || password) // For general errors
        ) {
          clearError();
        }
      }, 3000);

      // Clean up timer if component unmounts or inputs change again
      return () => {
        clearTimeout(timer);
      };
    }
  }, [email, phone, fullName, password, error, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Validate password complexity
    if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return;
    }

    // Include required fields and optional fields if available
    const userData = {
      fullName,
      phone,
      email, // Email is required for verification
      password,
      ...(birthDate && { birthDate }), // Include birthDate if it exists
      ...(studentRole !== undefined && { isStudent: studentRole }) // Include isStudent if defined
    }; setIsSubmitting(true);

    try {
      // Don't clear errors here to ensure errors from the backend are displayed
      const success = await register(userData);
      if (success) {
        setRegistrationSuccess(true);
      } else if (error) {
        // If registration failed and there's an error, scroll to the error message
        setTimeout(() => {
          const errorElement = document.getElementById('error-message');
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setRegistrationSuccess(false);
      // Error is already handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md w-full">
          <div className="bg-white py-8 px-4 sm:px-8 shadow-lg rounded-xl sm:rounded-2xl">
            <div className="text-center mb-6">
              {/* Logo */}
              <Logo />
              <h2 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h2>
              <p className="mt-1 text-sm text-gray-600">Tạo tài khoản để mua sắm dễ dàng hơn</p>
            </div>

            {/* Social login buttons */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span className="font-medium text-sm">Google</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center text-sm mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-500">hoặc</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>            {error && (
              <div id="error-message" className="p-4 mb-6 rounded-md bg-red-50 border border-red-300 shadow-md animate-fade-in transform transition-all">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-bold text-red-800">Đăng ký thất bại</h3>
                    <div className="mt-1 text-sm text-red-700 font-medium">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-colors text-sm"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className={`w-full px-4 py-3 rounded-lg border ${error && error.toLowerCase().includes('điện thoại') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } focus:border-[#2563EB] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-colors text-sm`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />                {error && error.toLowerCase().includes('điện thoại') && (
                  <div className="mt-1 flex items-center">
                    <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-red-500 font-medium">{error}</p>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  className={`w-full px-4 py-3 rounded-lg border ${error && error.includes('email') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } focus:border-[#2563EB] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-colors text-sm`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="mt-1 text-xs italic text-gray-500">
                  Email này sẽ được sử dụng để xác nhận tài khoản và gửi hóa đơn khi mua hàng
                </p>                {error && error.toLowerCase().includes('email') && (
                  <div className="mt-1 flex items-center">
                    <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-red-500 font-medium">{error}</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <input
                  id="birthDate"
                  type="date"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-colors text-sm"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-colors text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-[calc(50%+3px)] transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <p className="mt-1 text-xs italic text-gray-500">
                  (*) Mật khẩu tối thiểu 6 ký tự, có ít nhất 1 chữ và 1 số. (VD: 12345a)
                </p>
                {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-colors text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-[calc(50%+12px)] transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-start mt-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-[#2563EB]"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                  />
                </div>
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với các <a href="#" className="text-[#2563EB] hover:text-[#4F46E5] transition-colors">điều khoản sử dụng</a> và <a href="#" className="text-[#2563EB] hover:text-[#4F46E5] transition-colors">chính sách bảo mật</a>.
                </label>
              </div>

              <div className="flex items-start mt-2">
                <div className="flex items-center h-5">
                  <input
                    id="student"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-[#2563EB]"
                    checked={studentRole}
                    onChange={(e) => setStudentRole(e.target.checked)}
                  />
                </div>
                <div className="ml-2">
                  <label htmlFor="student" className="text-sm text-gray-600 flex items-center">
                    Tôi là Học sinh - sinh viên / Giáo viên - giảng viên
                    <span
                      className="ml-1 cursor-help group relative"
                      title="Ưu đãi dành cho học sinh, sinh viên và giáo viên"
                    >
                      <Info size={14} className="text-[#2563EB]" />
                      <span className="invisible group-hover:visible absolute left-0 bottom-full w-48 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Vui lòng chuẩn bị thẻ học sinh/sinh viên hoặc thẻ giảng viên khi nhận hàng để được hưởng ưu đãi
                      </span>
                    </span>
                  </label>
                  <p className="text-xs text-gray-500">(nhận thêm ưu đãi tới 500k/ sản phẩm)</p>
                </div>
              </div>

              {registrationSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-sm font-medium text-green-800">Đăng ký thành công!</h3>
                  </div>
                  <div className="mt-2 flex items-start">
                    <Mail className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-700">
                        Email xác nhận đã được gửi đến <span className="font-semibold">{email}</span>
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Vui lòng kiểm tra hộp thư (cả thư rác) và nhấn vào liên kết xác nhận để hoàn tất đăng ký.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link to="/auth/login" className="text-sm font-medium text-green-700 hover:text-green-900 underline">
                      Quay lại trang đăng nhập
                    </Link>
                  </div>
                </div>
              )}

              {!registrationSuccess && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-[#1E40AF] hover:to-[#3730A3] text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
              )}
            </form>

            <div className="mt-6 text-sm text-center">
              <span className="text-gray-600">Bạn đã có tài khoản? </span>
              <Link to="/auth/login" className="text-[#2563EB] font-medium hover:text-[#4F46E5] transition-colors">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;