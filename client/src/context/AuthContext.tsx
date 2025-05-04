import React, { createContext, useState, useContext, useEffect } from 'react';

// Định nghĩa các kiểu dữ liệu
export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: 'user' | 'admin' | 'student';
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

export interface RegisterData {
  fullName: string;
  phone: string;
  email?: string;
  birthDate: string;
  password: string;
  isStudent: boolean;
}

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => { },
  error: null,
  clearError: () => { },
});

// Hook để sử dụng context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra trạng thái đăng nhập khi tải trang
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Mock API calls - Trong thực tế, sẽ gọi đến backend API
  const login = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mô phỏng gọi API (thay thế bằng API thực tế khi có)
      // Trong môi trường thực tế, sẽ gọi đến endpoint đăng nhập của backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mô phỏng độ trễ mạng

      // Kiểm tra đăng nhập (mô phỏng)
      if (phone === '0123456789' && password === 'password123') {
        const mockUser: User = {
          id: '1',
          fullName: 'Nguyễn Văn A',
          phone: phone,
          email: 'example@gmail.com',
          role: 'user',
          createdAt: new Date(),
        };

        // Lưu thông tin người dùng vào localStorage để duy trì trạng thái đăng nhập
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      } else {
        setError('Số điện thoại hoặc mật khẩu không đúng');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mô phỏng gọi API (thay thế bằng API thực tế khi có)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mô phỏng độ trễ mạng

      // Kiểm tra đăng ký (mô phỏng)
      // Trong thực tế, kiểm tra này sẽ được thực hiện ở phía server
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9), // Random ID
        fullName: userData.fullName,
        phone: userData.phone,
        email: userData.email,
        role: userData.isStudent ? 'student' : 'user',
        createdAt: new Date(),
      };

      // Lưu thông tin người dùng vào localStorage để duy trì trạng thái đăng nhập
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;