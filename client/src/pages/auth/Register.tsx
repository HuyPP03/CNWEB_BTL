import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

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
  const [passwordError, setPasswordError] = useState('');
  const { isAuthenticated, register, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
    if (fullName || phone || email || password) {
      clearError();
    }
  }, [fullName, phone, email, password, clearError]);

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

    const userData = {
      fullName,
      phone,
      email: email || undefined, // If email is empty string, make it undefined
      birthDate,
      password,
      isStudent: studentRole
    };

    const success = await register(userData);
    if (success) {
      navigate('/'); // Redirect to home page after successful registration
    }
  };

  return (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 border border-gray-300 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span className="font-medium text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-300 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <img src="data:image/png;base64,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" alt="Zalo" className="w-5 h-5" />
              <span className="font-medium text-sm">Zalo</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center text-sm mb-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-500">hoặc</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-colors text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email (không bắt buộc)</label>
              <input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:ring-1 focus:ring-[#4F46E5] outline-none transition-colors text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="mt-1 text-xs italic text-gray-500">
                Hóa đơn VAT khi mua hàng sẽ được gửi qua email này
              </p>
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

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-[#1E40AF] hover:to-[#3730A3] text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none mt-4"
            >
              Đăng ký
            </button>
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
  );
};

export default Register;