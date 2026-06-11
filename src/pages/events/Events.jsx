import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoImage from '../../assets/img/logo.png';
import './Events.css';
import '../workspaces/Workspaces.css'; // Reuse workspace navbar CSS

const Events = () => {
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
    { label: 'SỰ KIỆN', active: true, path: '/events' },
    { label: 'TIN TỨC', active: false, path: '/news' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dummyEvents = [
    { id: 1, date: '15 THÁNG 6', title: 'Hội thảo: Quản trị dự án Agile 2026', desc: 'Khám phá các phương pháp mới nhất để tăng tốc độ phát triển dự án.' },
    { id: 2, date: '22 THÁNG 6', title: 'Ra mắt tính năng AI Copilot', desc: 'Tham gia sự kiện trực tuyến để xem demo trực tiếp các tính năng AI mới.' },
    { id: 3, date: '10 THÁNG 7', title: 'Networking: Kết nối Leader', desc: 'Sự kiện giao lưu offline dành riêng cho các Project Manager và Team Leader.' }
  ];

  return (
    <div className="events-page">
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

      <div className="events-content">
        <div className="events-header">
          <h1>Sự Kiện Nổi Bật</h1>
          <p>Cập nhật những hoạt động, hội thảo và buổi giao lưu mới nhất từ cộng đồng CollabTask.</p>
        </div>

        <div className="events-grid">
          {dummyEvents.map(ev => (
            <div key={ev.id} className="event-card">
              <div className="event-date">{ev.date}</div>
              <h3>{ev.title}</h3>
              <p>{ev.desc}</p>
              <button className="event-btn">Đăng Ký Tham Gia</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
