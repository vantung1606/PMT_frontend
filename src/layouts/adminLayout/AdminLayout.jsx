import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getLastName } from '../../utils/nameHelper';
import './AdminLayout.css';
import LogoDash from '../../assets/img/BrandCogniSync.png';

const AdminLayout = ({ children, currentView, setCurrentView }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleProfileClick = () => {
        navigate('/profile');
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
            label: 'Cài đặt hệ thống',
            icon: 'fa-cog',
            view: 'settings',
            permission: true
        }
    ];

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-brand">
                    <img src={LogoDash} alt="logo" className="admin-brand-logo" />
                    <div>
                        <h2>COGNISYNC</h2>
                    </div>
                </div>

                <div className="admin-user-box">
                    <div className="admin-avatar" onClick={handleProfileClick}>
                        {(user?.username || 'A').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="admin-user-info" onClick={handleProfileClick}>
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
                                onClick={() => setCurrentView(item.view)}
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

            <main className="admin-main">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
