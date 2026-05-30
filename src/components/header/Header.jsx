import '../../components/header/Header.css';
import logo from '../../assets/img/BrandCollabTask.png';
import BtnPale from '../button/BtnPale';
import BtnBold from '../button/BtnBold';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="logo" className="logo-img" />
          <p className="logo-text">COLLABTASK</p>
        </div>
        <div className="header-nav">
          <ul className="nav-list">
            <li className="nav-item"><a href="/#home" className="nav-link">Trang chủ</a></li>
            <li className="nav-item"><a href="/#about" className="nav-link">Giới thiệu</a></li>
            <li className="nav-item"><a href="/#services" className="nav-link">Dịch vụ</a></li>
            <li className="nav-item"><a href="/#contact" className="nav-link">Liên hệ</a></li>
          </ul>
        </div>
        <div className="header-right">
          {isAuthenticated ? (
            <div className="header-user-menu" ref={userMenuRef}>
              <button
                className="header-user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                type="button"
              >
                <div className="header-user-avatar">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user?.full_name || 'User avatar'} />
                  ) : (
                    <span>{(user?.full_name || user?.username || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="user-greeting">Xin chào, {user?.full_name || user?.username || 'User'}</span>
                <i className={`fas fa-chevron-down header-user-arrow ${showUserMenu ? 'open' : ''}`}></i>
              </button>

              {showUserMenu && (
                <div className="header-dropdown-menu">
                  {user?.role === 'admin' && (
                    <button
                      className="header-menu-action"
                      onClick={() => {
                        navigate('/admin');
                        setShowUserMenu(false);
                      }}
                      type="button"
                    >
                      <i className="fas fa-table-cells-large"></i>
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  <button
                    className="header-menu-action"
                    onClick={() => {
                      navigate('/workspaces');
                      setShowUserMenu(false);
                    }}
                    type="button"
                  >
                    <i className="fas fa-layer-group"></i>
                    <span>Không gian</span>
                  </button>
                  <button className="header-menu-action logout" onClick={handleLogout} type="button">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <BtnPale
                style={{ width: '125px' }}
                onClick={() => navigate('/login')}
              >
                Đăng Nhập
              </BtnPale>
              <BtnBold
                style={{ width: '125px' }}
                onClick={() => navigate('/register')}
              >
                Đăng Ký
              </BtnBold>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
