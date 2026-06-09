import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import useToast from '../../hooks/useToast';
import { formatDistanceToNow } from '../../utils/dateHelper';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        search: '',
        role: ''
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        loadUsers();
    }, [filters]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllUsers(filters);
            if (response.success) {
                setUsers(response.data.users);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            showToast(error.message || 'Không thể tải danh sách người dùng', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setFilters({ ...filters, search: e.target.value, page: 1 });
    };

    const handleRoleFilter = (e) => {
        setFilters({ ...filters, role: e.target.value, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    const handleViewDetail = async (userId) => {
        try {
            const response = await adminService.getUserDetail(userId);
            if (response.success) {
                setSelectedUser(response.data);
                setShowDetailModal(true);
            }
        } catch (error) {
            showToast(error.message || 'Không thể tải chi tiết người dùng', 'error');
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        if (!window.confirm(`Bạn có chắc muốn thay đổi role của người dùng này thành ${newRole}?`)) {
            return;
        }

        try {
            const response = await adminService.updateUserRole(userId, newRole);
            if (response.success) {
                showToast('Đã cập nhật role thành công', 'success');
                loadUsers();
            }
        } catch (error) {
            showToast(error.message || 'Không thể cập nhật role', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác!')) {
            return;
        }

        try {
            const response = await adminService.deleteUser(userId);
            if (response.success) {
                showToast('Đã xóa người dùng thành công', 'success');
                loadUsers();
            }
        } catch (error) {
            showToast(error.message || 'Không thể xóa người dùng', 'error');
        }
    };

    const getRoleBadgeClass = (role) => {
        const roleMap = {
            'admin': 'admin',
            'pm': 'pm',
            'tl': 'tl',
            'mb': 'member',
            'user': 'member'
        };
        return roleMap[role] || 'member';
    };

    const getRoleDisplayName = (role) => {
        const roleNames = {
            'admin': 'Admin',
            'pm': 'PM',
            'tl': 'Team Leader',
            'mb': 'Member',
            'user': 'User'
        };
        return roleNames[role] || role;
    };

    if (loading && users.length === 0) {
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
                    <h1 className="admin-header-title">Quản lý người dùng</h1>
                    <p className="admin-header-subtitle">
                        Quản lý tất cả người dùng trong hệ thống
                    </p>
                </div>
                <div className="admin-header-actions">
                    <button 
                        className="admin-btn admin-btn-secondary"
                        onClick={loadUsers}
                    >
                        <i className="fa-solid fa-refresh"></i>
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {/* Filters */}
                <div className="admin-filters">
                    <input
                        type="text"
                        className="admin-search-input"
                        placeholder="🔍 Tìm kiếm theo tên hoặc email..."
                        value={filters.search}
                        onChange={handleSearch}
                    />
                </div>

                {/* Users Table */}
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người dùng</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Workspaces</th>
                                <th>Projects</th>
                                <th>Tasks</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div 
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: '#e2e8f0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 600,
                                                    color: '#475569'
                                                }}
                                            >
                                                {user.username.slice(0, 1).toUpperCase()}
                                            </div>
                                            <strong>{user.username}</strong>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`admin-badge ${getRoleBadgeClass(user.role)}`}>
                                            {getRoleDisplayName(user.role)}
                                        </span>
                                    </td>
                                    <td>{user.statistics?.workspaces || 0}</td>
                                    <td>{user.statistics?.projects || 0}</td>
                                    <td>{user.statistics?.tasks || 0}</td>
                                    <td>{formatDistanceToNow(user.created_at)}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button
                                                className="admin-table-btn admin-btn-secondary"
                                                onClick={() => handleViewDetail(user.id)}
                                                title="Xem chi tiết"
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button
                                                className="admin-table-btn admin-btn-primary"
                                                onClick={() => {
                                                    const newRole = user.role === 'admin' ? 'user' : 'admin';
                                                    handleUpdateRole(user.id, newRole);
                                                }}
                                                title="Thay đổi role"
                                            >
                                                <i className="fa-solid fa-user-shield"></i>
                                            </button>
                                            <button
                                                className="admin-table-btn admin-btn-danger"
                                                onClick={() => handleDeleteUser(user.id)}
                                                title="Xóa người dùng"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="admin-pagination">
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

            {/* User Detail Modal */}
            {showDetailModal && selectedUser && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                    onClick={() => setShowDetailModal(false)}
                >
                    <div 
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            maxWidth: '800px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Chi tiết người dùng</h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#64748b'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3>Thông tin cơ bản</h3>
                            <p><strong>ID:</strong> {selectedUser.user.id}</p>
                            <p><strong>Tên:</strong> {selectedUser.user.username}</p>
                            <p><strong>Email:</strong> {selectedUser.user.email}</p>
                            <p><strong>Vai trò:</strong> <span className={`admin-badge ${getRoleBadgeClass(selectedUser.user.role)}`}>
                                {getRoleDisplayName(selectedUser.user.role)}
                            </span></p>
                            <p><strong>Tham gia:</strong> {new Date(selectedUser.user.created_at).toLocaleDateString('vi-VN')}</p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3>Thống kê</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6' }}>
                                        {selectedUser.statistics.totalWorkspaces}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Workspaces</div>
                                </div>
                                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>
                                        {selectedUser.statistics.totalProjects}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Projects</div>
                                </div>
                                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>
                                        {selectedUser.statistics.totalTasks}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Tasks</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3>Hoạt động gần đây ({selectedUser.activities.length})</h3>
                            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                                {selectedUser.activities.slice(0, 10).map((activity) => (
                                    <div key={activity.id} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ fontSize: '14px', color: '#1e293b' }}>
                                            {activity.action} {activity.target_table && `in ${activity.target_table}`}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                                            {formatDistanceToNow(activity.created_at)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

