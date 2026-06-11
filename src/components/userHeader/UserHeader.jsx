import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import usePermissions from '../../hooks/usePermissions';
import notificationService from '../../services/notificationService';
import { getLastName } from '../../utils/nameHelper';
import logo from '../../assets/img/BrandCollabTask.png';
import './UserHeader.css';

const UserHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const permissions = usePermissions();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef(null);

  // Đóng menu khi click bên ngoài
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

  // Load unread notification count
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        if (res.success) {
          setUnreadCount(res.data.count || 0);
        }
      } catch (err) {
        // Silent fail
      }
    };

    loadUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = () => {
    navigate('/workspaces');
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  const workspaceRole = currentWorkspace?.role || null;
  const menuItems = [
    { path: '/projects', label: 'Dự án', icon: 'fa-folder', scope: 'workspace', roles: ['pm', 'tl', 'mb', 'clt'] },
    { path: '/tasks', label: 'Tasks', icon: 'fa-tasks', scope: 'workspace', roles: ['pm', 'tl'] },
    { path: '/my-tasks', label: 'Công việc của tôi', icon: 'fa-list-check', scope: 'workspace', roles: ['tl', 'mb'] },
    { path: '/team', label: 'Thành viên', icon: 'fa-users', scope: 'workspace', roles: ['pm', 'tl'] },
    { path: '/reports', label: 'Báo cáo', icon: 'fa-chart-bar', scope: 'workspace', roles: ['pm', 'tl'] },
    { path: '/chat', label: 'Chat', icon: 'fa-comments', scope: 'workspace', roles: ['pm', 'tl', 'mb', 'clt'] },
    // Ẩn AI Chat với role 'mb' trong workspace, chỉ cho PM, TL, CLT
    { path: '/ai-chat', label: 'AI Chat', icon: 'fa-robot', scope: 'workspace', roles: ['pm'] },
  ];

  const visibleMenuItems = menuItems.filter(item => {
    if (item.scope === 'workspace') {
      if (!currentWorkspace) return false;
      if (item.roles.includes('any')) return true;
      // Ưu tiên workspace role, fallback về global role
      const role = workspaceRole || user?.role || null;
      return role ? item.roles.includes(role) : false;
    }
    if (item.roles.includes('any')) return true;
    // Ưu tiên workspace role, fallback về global role
    const role = workspaceRole || user?.role || null;
    return role ? item.roles.includes(role) : false;
  });

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const userDisplayName = getLastName(user?.username) || user?.username || 'Người dùng';
  const userInitial = (user?.username || 'U').slice(0, 1).toUpperCase();

  return (
    <header className="user-header">
      <div className="user-header-container">
        {/* Logo */}
        <div className="user-header-logo" onClick={handleLogoClick}>
          <img src={logo} alt="logo" className="user-logo-img" style={{ filter: 'brightness(0) invert(1)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="user-logo-text">COLLABTASK</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.8)', marginTop: '-4px' }}>Project Hub</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="user-header-nav">
          {/* Nút quay lại Workspace */}
          <button
            className="user-nav-item back-to-workspace"
            onClick={() => navigate('/workspaces')}
            style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}
          >
            <i className="fas fa-arrow-left"></i>
            <span>Trở về Workspaces</span>
          </button>
          {visibleMenuItems.map((item) => (
            <button
              key={item.path}
              className={`user-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="user-header-right">
          {/* Notification Icon */}
          <button
            className="user-header-icon-btn notification-btn"
            onClick={handleNotificationClick}
            title="Thông báo"
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {/* User Menu */}
          <div className="user-menu-wrapper" ref={userMenuRef}>
            <button
              className="user-menu-trigger"
              onClick={handleUserMenuClick}
            >
              <div className="user-avatar">
                {userInitial}
              </div>
              <span className="user-name">{userDisplayName}</span>
              <i className={`fas fa-chevron-down ${showUserMenu ? 'open' : ''}`}></i>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <div className="user-menu-avatar">{userInitial}</div>
                  <div className="user-menu-info">
                    <div className="user-menu-name">{user?.username || 'Người dùng'}</div>
                    <div className="user-menu-role" style={{ color: permissions.getRoleColor() }}>
                      {permissions.getRoleDisplayName()}
                    </div>
                  </div>
                </div>
                <div className="user-menu-divider"></div>
                <button
                  className="user-menu-item"
                  onClick={handleProfileClick}
                >
                  <i className="fas fa-user"></i>
                  <span>Thông tin cá nhân</span>
                </button>
                <button
                  className="user-menu-item logout"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;

