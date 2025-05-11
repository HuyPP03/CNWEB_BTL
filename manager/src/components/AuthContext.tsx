import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
// Định nghĩa kiểu user
interface User {
  id: string;
  email: string;
  fullName?: string;
}

// Định nghĩa kiểu decoded token
interface DecodedToken {
  sub: string;
  email: string;
  exp: number;
  [key: string]: any;
}

// Định nghĩa context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Tạo context mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook để dùng
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm kiểm tra token
  const checkToken = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        handleLogout();
        return;
      }

      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      // Nếu token đã hết hạn hoặc còn hạn dưới 5 phút, thử refresh
      if (decodedToken.exp <= currentTime || decodedToken.exp - currentTime < 300) {
        try {
          const response = await api.post("/auth/refresh-token");
          const { accessToken } = response.data.data;
          localStorage.setItem("accessToken", accessToken);
          
          const newDecodedToken = jwtDecode<DecodedToken>(accessToken);
          setCurrentUser({
            id: newDecodedToken.sub,
            email: newDecodedToken.email,
          });
        } catch (err) {
          console.error("Error refreshing token:", err);
          handleLogout();
        }
      } else {
        setCurrentUser({
          id: decodedToken.sub,
          email: decodedToken.email,
        });
      }
    } catch (err) {
      console.error("Error checking token:", err);
      handleLogout();
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await checkToken();
      } catch (err) {
        console.error("Error checking auth status:", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();

    // Thiết lập interval để kiểm tra token mỗi phút
    const tokenCheckInterval = setInterval(checkToken, 60000);

    // Cleanup interval khi component unmount
    return () => clearInterval(tokenCheckInterval);
  }, []);

  // Hàm login dùng axios
  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post("/auth/managers/login", { email, password });
      const { accessToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);

      const decodedToken = jwtDecode<DecodedToken>(accessToken);
      setCurrentUser({
        id: decodedToken.sub,
        email: decodedToken.email,
      });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hàm logout 
  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      setCurrentUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
