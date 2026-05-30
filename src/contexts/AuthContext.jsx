import React, { createContext, useContext, useState, useEffect} from 'react';
import authService from '../services/authService';
import { disconnectSocket } from '../services/socketService';

// Tránh khởi tạo nhiều lần khi component re-render
let authInitialized = false;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Chỉ chạy logic auth một lần duy nhất
    if (authInitialized) {
      setLoading(false);
      return;
    }
    
    let isMounted = true;
    
    // Restore session nếu có token hợp lệ trong sessionStorage
    const initAuth = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          if (process.env.NODE_ENV === 'development') {
            console.log('Initializing auth with token...');
          }
          // Xác minh token vẫn còn hiệu lực bằng cách gọi API
          const response = await authService.getProfile();
          if (response.success && isMounted) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else if (isMounted) {
            // Token đã hết hạn hoặc không hợp lệ
            authService.logout();
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Auth initialization error:', error);
        }
        if (isMounted) {
          authService.logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          authInitialized = true;
        }
      }
    };

    initAuth();
    
    // Cleanup để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error(response.message || 'Đăng nhập thất bại');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error(response.message || 'Đăng ký thất bại');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Xóa token và thông tin user khỏi session
    authService.logout();

    // Đóng kết nối WebSocket để tránh rò rỉ bộ nhớ
    disconnectSocket();

    setUser(null);
    setIsAuthenticated(false);
    authInitialized = false;
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      if (response.success) {
        setUser(response.data.user);
        return response;
      }
      throw new Error(response.message || 'Cập nhật profile thất bại');
    } catch (error) {
      throw error;
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const response = await authService.uploadAvatar(file);
      if (response.success) {
        setUser(response.data.user);
        return response;
      }
      throw new Error(response.message || 'Upload avatar thất bại');
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
