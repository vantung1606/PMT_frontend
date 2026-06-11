import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'mb',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/', { replace: true });
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra khi đăng ký');
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
            <h2>Đăng Ký</h2>
            <p>Tạo tài khoản để bắt đầu hành trình của bạn.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-super-form">
            <div className="super-input-row">
              <div className="super-input-group">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="username">Tên của bạn</label>
                <i className="far fa-user input-icon"></i>
              </div>

              <div className="super-input-group">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder=" "
                />
                <label htmlFor="phone">Điện thoại</label>
                <i className="fas fa-phone-alt input-icon"></i>
              </div>
            </div>

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

            <div className="super-input-row">
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

              <div className="super-input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="confirmPassword">Xác nhận</label>
                <i className="fas fa-check-circle input-icon"></i>
                <button 
                  type="button" 
                  className="super-pwd-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={showConfirmPassword ? 'far fa-eye-slash' : 'far fa-eye'}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="super-submit-btn" disabled={loading}>
              <span>{loading ? 'ĐANG ĐĂNG KÝ...' : 'TẠO TÀI KHOẢN NGAY'}</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </form>

          <div className="super-social-divider">
            <span>Hoặc đăng ký bằng</span>
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
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
