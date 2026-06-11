import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!error) return undefined;
    const timer = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const from = location.state?.from?.pathname || '/workspaces';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(formData);
      const role = res?.data?.user?.role;
      if (role === 'admin') navigate('/admin', { replace: true });
      else navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-super-page">
      {/* Animated Background Orbs */}
      <div className="auth-orb orb-red"></div>
      <div className="auth-orb orb-blue"></div>
      <div className="auth-orb orb-orange"></div>

      {error && (
        <div className="auth-super-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="auth-super-card">
        <div className="auth-super-left">
          <div className="auth-super-brand">
            <h1>COLLABTASK</h1>
            <p>Nền tảng quản trị dự án & đội nhóm thế hệ mới.</p>
          </div>
          <div className="auth-super-quote">
            "Sự lựa chọn hoàn hảo để kết nối mọi thành viên, thúc đẩy tiến độ và làm chủ mọi dự án."
          </div>
        </div>

        <div className="auth-super-right">
          <div className="auth-super-header">
            <h2>Đăng nhập</h2>
            <p>Chào mừng bạn quay trở lại hệ thống</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-super-form">
            <div className="super-input-group">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder=" "
                required
              />
              <label htmlFor="email">Địa chỉ Email</label>
              <i className="far fa-envelope input-icon"></i>
            </div>

            <div className="super-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder=" "
                required
              />
              <label htmlFor="password">Mật khẩu</label>
              <i className="fas fa-lock input-icon"></i>
              <button 
                type="button" 
                className="super-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? 'far fa-eye-slash' : 'far fa-eye'}></i>
              </button>
            </div>

            <div className="super-form-actions">
              <label className="super-checkbox">
                <input type="checkbox" />
                <span>Ghi nhớ tôi</span>
              </label>
              <span className="super-forgot">Quên mật khẩu?</span>
            </div>

            <button type="submit" className="super-submit-btn" disabled={loading}>
              <span>{loading ? 'ĐANG KẾT NỐI...' : 'ĐĂNG NHẬP NGAY'}</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </form>

          <div className="super-social-divider">
            <span>Hoặc tiếp tục với</span>
          </div>

          <div className="super-social-row">
            <button type="button" className="super-social-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
            </button>
            <button type="button" className="super-social-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
            </button>
            <button type="button" className="super-social-btn facebook">
              <i className="fab fa-facebook-f"></i>
            </button>
          </div>

          <p className="super-footer-text">
            Chưa có tài khoản? <Link to="/register">Tạo tài khoản mới</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
