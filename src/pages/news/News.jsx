import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoImage from '../../assets/img/logo.png';
import './News.css';
import '../workspaces/Workspaces.css'; // Reuse workspace navbar CSS

const News = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const headerLinks = [
    { label: 'TRANG CHỦ', active: false, path: '/' },
    { label: 'DỰ ÁN', active: false, path: '/workspaces' },
    { label: 'SỰ KIỆN', active: false, path: '/events' },
    { label: 'TIN TỨC', active: true, path: '/news' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dummyNews = [
    { id: 1, category: 'Sản Phẩm', title: 'Phát hành CollabTask v2.0', desc: 'Bản cập nhật lớn nhất năm với giao diện hoàn toàn mới và tích hợp AI.', date: '01/06/2026' },
    { id: 2, category: 'Công Nghệ', title: 'Tối ưu hóa hiệu suất Workspace', desc: 'Chúng tôi vừa nâng cấp hạ tầng giúp tốc độ tải trang nhanh hơn 40%.', date: '28/05/2026' },
    { id: 3, category: 'Bảo Mật', title: 'Cập nhật chuẩn bảo mật ISO 27001', desc: 'Dữ liệu của bạn được bảo vệ với tiêu chuẩn bảo mật quốc tế cao nhất.', date: '20/05/2026' }
  ];

  return (
    <div className="news-page">
      {/* FULL-WIDTH HERO OVERLAY & PILL NAVBAR */}
      <div className="workspace-hero-wrapper header-only">
        <div className="workspace-pill-nav">
          <div className="wp-nav-left">
            <img className="wp-brand-logo" src={logoImage} alt="CollabTask" />
          </div>
          <div className="wp-nav-center">
            {headerLinks.map(link => (
              <span 
                key={link.label} 
                className={`wp-nav-link ${link.active ? 'active' : ''}`}
                onClick={() => handleNavClick(link.path)}
              >
                {link.label}
              </span>
            ))}
          </div>
          <div className="wp-nav-right">
            <div className="wp-account-trigger" onClick={() => setShowUserMenu(!showUserMenu)} ref={userMenuRef}>
              <div className="wp-avatar">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="User" />
                ) : (
                  <span>{(user?.username || user?.full_name || 'A').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="wp-account-name">{user?.full_name || user?.username || 'Admin Account'}</span>
              {showUserMenu && (
                <div className="wp-user-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="wp-user-info">
                    <div className="wp-user-name">{user?.username || user?.full_name || 'Admin Account'}</div>
                    <div className="wp-user-email">{user?.email}</div>
                  </div>
                  <div className="wp-dropdown-divider"></div>
                  {user?.role === 'admin' && (
                    <button className="wp-admin-btn" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); navigate('/admin'); }} type="button">
                      <i className="fas fa-shield-alt"></i> Admin Dashboard
                    </button>
                  )}
                  <button className="wp-logout-btn" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); handleLogout(); }} type="button">
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="news-content">
        <div className="news-header">
          <h1>Tin Tức Mới Nhất</h1>
          <p>Cập nhật những tính năng, bản phát hành và câu chuyện công nghệ từ đội ngũ phát triển.</p>
        </div>

        <div className="news-list">
          {dummyNews.map(item => (
            <div key={item.id} className="news-card">
              <div className="news-badge">{item.category}</div>
              <div className="news-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="news-date">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
