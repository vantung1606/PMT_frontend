import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import useToast from '../../hooks/useToast';
import { ToastContainer } from '../../components/toast/Toast';
import { formatDistanceToNow } from '../../utils/dateHelper';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [stats, setStats] = useState(null);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 50,
        user_id: '',
        action: '',
        target_table: '',
        start_date: '',
        end_date: ''
    });
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        loadLogs();
        loadStats();
    }, [filters]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const response = await adminService.getActivityLogs(filters);
            if (response.success) {
                setLogs(response.data.logs);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            showToast(error.message || 'Không thể tải activity logs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await adminService.getActivityStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            // Silent fail for stats
            console.error('Failed to load stats:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    const handleClearFilters = () => {
        setFilters({
            page: 1,
            limit: 50,
            user_id: '',
            action: '',
            target_table: '',
            start_date: '',
            end_date: ''
        });
    };

    const getActionIcon = (action) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('create') || lowerAction.includes('add')) return 'fa-plus-circle';
        if (lowerAction.includes('update') || lowerAction.includes('edit')) return 'fa-edit';
        if (lowerAction.includes('delete') || lowerAction.includes('remove')) return 'fa-trash';
        if (lowerAction.includes('login')) return 'fa-sign-in-alt';
        if (lowerAction.includes('logout')) return 'fa-sign-out-alt';
        if (lowerAction.includes('view') || lowerAction.includes('search')) return 'fa-eye';
        if (lowerAction.includes('member')) return 'fa-users';
        if (lowerAction.includes('workspace')) return 'fa-building';
        if (lowerAction.includes('project')) return 'fa-folder';
        if (lowerAction.includes('task')) return 'fa-tasks';
        return 'fa-circle';
    };

    const getActionColor = (action) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('create') || lowerAction.includes('add')) return '#10b981';
        if (lowerAction.includes('update') || lowerAction.includes('edit')) return '#3b82f6';
        if (lowerAction.includes('delete') || lowerAction.includes('remove')) return '#ef4444';
        if (lowerAction.includes('login')) return '#8b5cf6';
        if (lowerAction.includes('view') || lowerAction.includes('search')) return '#6366f1';
        return '#64748b';
    };

    if (loading && logs.length === 0) {
        return (
            <div className="admin-loading">
                <i className="fa-solid fa-spinner fa-spin"></i>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="admin-header">
                <div>
                    <h1 className="admin-header-title">Activity Logs</h1>
                    <p className="admin-header-subtitle">
                        Theo dõi tất cả hoạt động trong hệ thống
                    </p>
                </div>
                <div className="admin-header-actions">
                    <button 
                        className="admin-btn admin-btn-secondary"
                        onClick={handleClearFilters}
                    >
                        <i className="fa-solid fa-filter-circle-xmark"></i>
                        Xóa bộ lọc
                    </button>
                    <button 
                        className="admin-btn admin-btn-primary"
                        onClick={loadLogs}
                    >
                        <i className="fa-solid fa-refresh"></i>
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {/* Quick Stats */}
                {stats && stats.actionsByType && stats.actionsByType.length > 0 && (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '16px', 
                        marginBottom: '20px' 
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '20px',
                            borderRadius: '12px',
                            color: 'white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>
                                <i className="fa-solid fa-chart-line"></i> Tổng hoạt động
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                                {stats.actionsByType.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            padding: '20px',
                            borderRadius: '12px',
                            color: 'white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>
                                <i className="fa-solid fa-bolt"></i> Loại hành động
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                                {stats.actionsByType.length}
                            </div>
                        </div>

                        {stats.topActiveUsers && stats.topActiveUsers.length > 0 && (
                            <div style={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                padding: '20px',
                                borderRadius: '12px',
                                color: 'white',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>
                                    <i className="fa-solid fa-user-check"></i> User hoạt động nhất
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    {stats.topActiveUsers[0].username}
                                </div>
                                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                    {stats.topActiveUsers[0].activity_count} hoạt động
                                </div>
                            </div>
                        )}

                        {stats.activitiesByTable && stats.activitiesByTable.length > 0 && (
                            <div style={{
                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                padding: '20px',
                                borderRadius: '12px',
                                color: 'white',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>
                                    <i className="fa-solid fa-table"></i> Bảng nhiều hoạt động nhất
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    {stats.activitiesByTable[0].target_table || 'N/A'}
                                </div>
                                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                    {stats.activitiesByTable[0].count} hoạt động
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Filters */}
                <div className="admin-filters">
                    <input
                        type="text"
                        className="admin-search-input"
                        placeholder="🔍 Tìm action..."
                        value={filters.action}
                        onChange={(e) => handleFilterChange('action', e.target.value)}
                        style={{ flex: '1' }}
                    />
                    <select
                        className="admin-select"
                        value={filters.target_table}
                        onChange={(e) => handleFilterChange('target_table', e.target.value)}
                    >
                        <option value="">Tất cả bảng</option>
                        <option value="users">Users</option>
                        <option value="workspaces">Workspaces</option>
                        <option value="workspace_members">Workspace Members</option>
                        <option value="members">Members</option>
                        <option value="prj">Projects</option>
                        <option value="tasks">Tasks</option>
                        <option value="prj_mb">Project Members</option>
                        <option value="tsk_asg">Task Assignments</option>
                        <option value="tsk_cmt">Task Comments</option>
                        <option value="prj_cmt">Project Comments</option>
                    </select>
                    <input
                        type="date"
                        className="admin-select"
                        value={filters.start_date}
                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        placeholder="Từ ngày"
                    />
                    <input
                        type="date"
                        className="admin-select"
                        value={filters.end_date}
                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        placeholder="Đến ngày"
                    />
                </div>

                {/* Logs Timeline */}
                <div style={{ marginTop: '20px' }}>
                    {logs.length > 0 && (
                        <div style={{ 
                            marginBottom: '16px', 
                            padding: '12px 16px', 
                            background: '#f1f5f9', 
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>
                                <i className="fa-solid fa-list-check"></i> Tổng số: {pagination.total || logs.length} logs
                            </span>
                            {pagination.totalPages > 1 && (
                                <span style={{ fontSize: '13px', color: '#64748b' }}>
                                    Hiển thị {((pagination.page - 1) * filters.limit) + 1} - {Math.min(pagination.page * filters.limit, pagination.total)} trong số {pagination.total}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {logs.map((log) => (
                        <div key={log.id} className="admin-log-card">
                            {/* Icon */}
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    background: `${getActionColor(log.action)}15`,
                                    color: getActionColor(log.action),
                                    fontSize: '18px'
                                }}
                            >
                                <i className={`fa-solid ${getActionIcon(log.action)}`}></i>
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="admin-log-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <strong style={{ 
                                            color: '#1e293b', 
                                            fontSize: '15px',
                                            fontWeight: '600' 
                                        }}>
                                            {log.action}
                                        </strong>
                                        {log.target_table && (
                                            <span style={{ 
                                                fontSize: '12px', 
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: '#e0e7ff',
                                                color: '#4f46e5',
                                                fontWeight: '500'
                                            }}>
                                                {log.target_table}
                                            </span>
                                        )}
                                        {log.target_id && (
                                            <span style={{ 
                                                fontSize: '11px', 
                                                color: '#94a3b8',
                                                fontFamily: 'monospace'
                                            }}>
                                                #ID:{log.target_id}
                                            </span>
                                        )}
                                    </div>
                                    <span className="admin-log-time" style={{ 
                                        fontSize: '12px', 
                                        color: '#64748b', 
                                        whiteSpace: 'nowrap',
                                        marginLeft: '12px'
                                    }}>
                                        <i className="fa-solid fa-clock" style={{ marginRight: '4px' }}></i>
                                        {formatDistanceToNow(log.created_at)}
                                    </span>
                                </div>

                                {log.description && (
                                    <div style={{ 
                                        fontSize: '14px', 
                                        color: '#475569', 
                                        marginBottom: '8px',
                                        lineHeight: '1.5'
                                    }}>
                                        {log.description}
                                    </div>
                                )}

                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#94a3b8', 
                                    display: 'flex', 
                                    gap: '16px',
                                    alignItems: 'center'
                                }}>
                                    {log.username && (
                                        <span style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '4px',
                                            padding: '2px 8px',
                                            background: '#f1f5f9',
                                            borderRadius: '4px'
                                        }}>
                                            <i className="fa-solid fa-user" style={{ fontSize: '11px' }}></i>
                                            <span style={{ fontWeight: '500', color: '#64748b' }}>{log.username}</span>
                                            {log.email && (
                                                <span style={{ color: '#94a3b8' }}>({log.email})</span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {logs.length === 0 && !loading && (
                    <div className="admin-empty">
                        <i className="fa-solid fa-list-ul"></i>
                        <h3>Không có log nào</h3>
                        <p>Thử thay đổi bộ lọc hoặc làm mới trang</p>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="admin-pagination" style={{ marginTop: '24px' }}>
                        <button
                            className="admin-pagination-btn"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <span style={{ padding: '0 12px', color: '#64748b' }}>
                            Trang {pagination.page} / {pagination.totalPages}
                        </span>
                        <button
                            className="admin-pagination-btn"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                )}
            </div>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
};

export default ActivityLogs;

