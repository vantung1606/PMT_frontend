import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Tự động ẩn thông báo lỗi sau 5 giây (tương tự Register)
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  // Lấy URL redirect từ state, mặc định là /workspaces (cho user thường)
  const from = location.state?.from?.pathname || '/workspaces';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(formData);
      
      // Nếu là admin (global) -> chuyển thẳng vào admin panel
      const role = res?.data?.user?.role;
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        // User thường -> vào trang chọn workspace (hoặc trang đã yêu cầu trước đó)
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Xử lý đăng nhập Google
    console.log('Google login');
  };

  const handleFacebookLogin = () => {
    // Xử lý đăng nhập Facebook
    console.log('Facebook login');
  };

  const handleForgotPassword = () => {
    // Xử lý quên mật khẩu
    console.log('Forgot password');
  };

  return (
    <div className="login-container">
      {/* Error notification */}
      {error && (
        <div className="error-notification">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button className="error-close" onClick={() => setError('')}>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="login-card">
        <div className="login-header">
          <h2>Đăng Nhập</h2>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Tài khoản</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <button
              type="button"
              className="forgot-password-link"
              onClick={handleForgotPassword}
            >
              Quên mật khẩu?
            </button>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="divider">
          <span>Hoặc đăng nhập bằng</span>
        </div>

        <div className="social-login">
          <button
            type="button"
            className="social-button google-button"
            onClick={handleGoogleLogin}
          >
            <svg className="social-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            className="social-button facebook-button"
            onClick={handleFacebookLogin}
          >
            <svg className="social-icon" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="login-footer">
          <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
