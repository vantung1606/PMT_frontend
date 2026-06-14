import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getLastName } from '../../utils/nameHelper';
import './AdminLayout.css';
import LogoDash from '../../assets/img/BrandCollabTask.png';

const AdminLayout = ({ children, currentView, setCurrentView }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleMenuClick = (view) => {
        setCurrentView(view);
        setSidebarOpen(false);
    };

    const handleBackToMain = () => {
        navigate('/workspaces');
    };

    const menuItems = [
        {
            label: 'Tổng quan',
            icon: 'fa-chart-line',
            view: 'dashboard',
            permission: true
        },
        {
            label: 'Quản lý người dùng',
            icon: 'fa-users',
            view: 'users',
            permission: true
        },
        {
            label: 'Workspaces',
            icon: 'fa-building',
            view: 'workspaces',
            permission: true
        },
        {
            label: 'Activity Logs',
            icon: 'fa-list-ul',
            view: 'logs',
            permission: true
        },
        {
            label: 'Quản lý website',
            icon: 'fa-globe',
            view: 'website',
            permission: true
        },
        {
            label: 'Cài đặt hệ thống',
            icon: 'fa-cog',
            view: 'settings',
            permission: true
        }
    ];

    return (
        <div className="admin-layout">
            <div className="admin-ambient-bg">
                <div className="admin-orb admin-orb-red"></div>
                <div className="admin-orb admin-orb-blue"></div>
                <div className="admin-orb admin-orb-orange"></div>
            </div>
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-brand">
                    <img src={LogoDash} alt="logo" className="admin-brand-logo" />
                    <div>
                        <h2>COLLABTASK</h2>
                    </div>
                </div>

                <div className="admin-user-box">
                    <div className="admin-avatar" style={{ cursor: 'default' }}>
                        {(user?.avatar_url || user?.avatar) ? (
                            <img src={user.avatar_url || user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                            (user?.username || 'A').slice(0, 1).toUpperCase()
                        )}
                    </div>
                    <div className="admin-user-info" style={{ cursor: 'default' }}>
                        <div className="admin-user-name">
                            {getLastName(user?.username) || 'Admin'}
                        </div>
                        <div className="admin-user-role">
                            <i className="fa-solid fa-shield-halved"></i>
                            Administrator
                        </div>
                    </div>
                    <button
                        className="admin-logout-btn"
                        onClick={logout}
                        title="Đăng xuất"
                    >
                        <i className="fa-solid fa-sign-out-alt"></i>
                    </button>
                </div>

                <nav className="admin-menu">
                    <div className="admin-menu-label">Navigation</div>
                    {menuItems.map((item) => (
                        item.permission && (
                            <button
                                key={item.view}
                                className={`admin-menu-item ${
                                    currentView === item.view ? 'active' : ''
                                }`}
                                onClick={() => handleMenuClick(item.view)}
                            >
                                <i className={`fa-solid ${item.icon}`}></i>
                                {item.label}
                            </button>
                        )
                    ))}

                    <div className="admin-menu-label">Actions</div>
                    <button
                        className="admin-menu-item"
                        onClick={handleBackToMain}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Quay lại ứng dụng
                    </button>
                </nav>
            </aside>

            <div 
                className={`admin-sidebar-backdrop ${sidebarOpen ? 'show' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <main className="admin-main">
                <div className="admin-mobile-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)}>
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={LogoDash} alt="logo" className="admin-brand-logo" style={{ width: '32px', height: '32px', padding: '4px' }} />
                            <h2 style={{ fontSize: '18px', color: '#1e293b', margin: 0, fontWeight: 800 }}>CollabTask</h2>
                        </div>
                    </div>
                    
                    <div 
                        className="admin-avatar" 
                        style={{ width: '38px', height: '38px', fontSize: '15px', cursor: 'default' }}
                    >
                        {(user?.avatar_url || user?.avatar) ? (
                            <img src={user.avatar_url || user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                            (user?.username || 'A').slice(0, 1).toUpperCase()
                        )}
                    </div>
                </div>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
