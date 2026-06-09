import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import useToast from '../../hooks/useToast';
import { formatDistanceToNow } from '../../utils/dateHelper';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await adminService.getDashboardStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            showToast(error.message || 'Không thể tải dữ liệu dashboard', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <i className="fa-solid fa-spinner fa-spin"></i>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="admin-empty">
                <i className="fa-solid fa-exclamation-circle"></i>
                <h3>Không thể tải dữ liệu</h3>
            </div>
        );
    }

    const roleColors = {
        admin: '#dc2626',
        pm: '#2563eb',
        tl: '#059669',
        mb: '#64748b',
        user: '#64748b'
    };

    const statusColors = {
        'Not Started': '#64748b',
        'In Progress': '#3b82f6',
        'Completed': '#10b981',
        'Pending': '#f59e0b',
        'Cancelled': '#ef4444'
    };

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="admin-header">
                <div>
                    <h1 className="admin-header-title">Dashboard</h1>
                    <p className="admin-header-subtitle">
                        Tổng quan hệ thống CollabTask
                    </p>
                </div>
                <div className="admin-header-actions">
                    <button 
                        className="admin-btn admin-btn-secondary"
                        onClick={loadDashboardStats}
                    >
                        <i className="fa-solid fa-refresh"></i>
                        Làm mới
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon blue">
                        <i className="fa-solid fa-users"></i>
                    </div>
                    <div className="admin-stat-info">
                        <div className="admin-stat-label">Tổng người dùng</div>
                        <div className="admin-stat-value">
                            {stats.totals.users.toLocaleString()}
                        </div>
                        {stats.userGrowth.length > 0 && (
                            <div className="admin-stat-change positive">
                                <i className="fa-solid fa-arrow-up"></i>
                                Tháng này
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon green">
                        <i className="fa-solid fa-building"></i>
                    </div>
                    <div className="admin-stat-info">
                        <div className="admin-stat-label">Workspaces</div>
                        <div className="admin-stat-value">
                            {stats.totals.workspaces.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon purple">
                        <i className="fa-solid fa-folder"></i>
                    </div>
                    <div className="admin-stat-info">
                        <div className="admin-stat-label">Dự án</div>
                        <div className="admin-stat-value">
                            {stats.totals.projects.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon orange">
                        <i className="fa-solid fa-tasks"></i>
                    </div>
                    <div className="admin-stat-info">
                        <div className="admin-stat-label">Công việc</div>
                        <div className="admin-stat-value">
                            {stats.totals.tasks.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="admin-chart-grid">
                {/* User Growth Chart */}
                <div className="admin-chart-card">
                    <div className="admin-chart-header">
                        <h3 className="admin-chart-title">
                            <i className="fa-solid fa-chart-line"></i> Tăng trưởng người dùng
                        </h3>
                    </div>
                    <div className="admin-chart-content">
                        {stats.userGrowth && stats.userGrowth.length > 0 ? (
                            <div className="admin-list-card">
                                {stats.userGrowth.map((item, index) => (
                                    <div key={index} className="admin-list-item">
                                        <span className="admin-list-label">{item.month}</span>
                                        <span className="admin-list-value">+{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="admin-empty">
                                <p>Chưa có dữ liệu</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Active Users */}
                <div className="admin-chart-card">
                    <div className="admin-chart-header">
                        <h3 className="admin-chart-title">
                            <i className="fa-solid fa-star"></i> Top người dùng hoạt động
                        </h3>
                    </div>
                    <div className="admin-chart-content">
                        {stats.topUsers && stats.topUsers.length > 0 ? (
                            <div className="admin-list-card">
                                {stats.topUsers.map((user, index) => (
                                    <div key={user.id} className="admin-list-item">
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>
                                                #{index + 1} {user.username}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                {user.email}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#3b82f6' }}>
                                                {user.assigned_tasks}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                                                tasks
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="admin-empty">
                                <p>Chưa có dữ liệu</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Distribution Lists */}
            <div className="admin-list-grid">
                {/* Users by Role */}
                <div className="admin-list-card">
                    <h3 className="admin-chart-title" style={{ marginBottom: '20px' }}>
                        <i className="fa-solid fa-user-tag"></i> Người dùng theo vai trò
                    </h3>
                    {stats.usersByRole.map((item) => (
                        <div key={item.role} className="admin-list-item">
                            <span className="admin-list-label">
                                <span 
                                    className="admin-badge" 
                                    style={{ 
                                        background: `${roleColors[item.role] || '#64748b'}20`,
                                        color: roleColors[item.role] || '#64748b'
                                    }}
                                >
                                    {item.role.toUpperCase()}
                                </span>
                            </span>
                            <span className="admin-list-value">{item.count}</span>
                        </div>
                    ))}
                </div>

                {/* Projects by Status */}
                <div className="admin-list-card">
                    <h3 className="admin-chart-title" style={{ marginBottom: '20px' }}>
                        <i className="fa-solid fa-chart-pie"></i> Dự án theo trạng thái
                    </h3>
                    {stats.projectsByStatus.map((item) => (
                        <div key={item.status} className="admin-list-item">
                            <span className="admin-list-label">
                                <span 
                                    style={{
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: statusColors[item.status] || '#64748b',
                                        marginRight: '8px'
                                    }}
                                ></span>
                                {item.status}
                            </span>
                            <span className="admin-list-value">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activities */}
            <div className="admin-activities">
                <h3 className="admin-chart-title" style={{ marginBottom: '20px' }}>
                    <i className="fa-solid fa-clock"></i> Hoạt động gần đây
                </h3>
                {stats.recentActivities && stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity) => (
                        <div key={activity.id} className="admin-activity-item">
                            <div className="admin-activity-icon">
                                <i className="fa-solid fa-circle-notch"></i>
                            </div>
                            <div className="admin-activity-info">
                                <div className="admin-activity-text">
                                    <span className="admin-activity-user">
                                        {activity.username || 'System'}
                                    </span>
                                    {' '}{activity.action} {activity.target_table && `in ${activity.target_table}`}
                                    {activity.description && `: ${activity.description}`}
                                </div>
                                <div className="admin-activity-time">
                                    {formatDistanceToNow(activity.created_at)}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="admin-empty">
                        <p>Chưa có hoạt động nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

