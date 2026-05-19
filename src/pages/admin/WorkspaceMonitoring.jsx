import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import useToast from '../../hooks/useToast';
import { formatDistanceToNow } from '../../utils/dateHelper';

const WorkspaceMonitoring = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        search: ''
    });
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        loadWorkspaces();
    }, [filters]);

    const loadWorkspaces = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllWorkspaces(filters);
            if (response.success) {
                setWorkspaces(response.data.workspaces);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            showToast(error.message || 'Không thể tải danh sách workspaces', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setFilters({ ...filters, search: e.target.value, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    const handleViewDetail = async (workspaceId) => {
        try {
            const response = await adminService.getWorkspaceDetail(workspaceId);
            if (response.success) {
                setSelectedWorkspace(response.data);
                setShowDetailModal(true);
            }
        } catch (error) {
            showToast(error.message || 'Không thể tải chi tiết workspace', 'error');
        }
    };

    const handleDeleteWorkspace = async (workspaceId) => {
        if (!window.confirm('Bạn có chắc muốn xóa workspace này? Hành động này sẽ xóa tất cả dữ liệu liên quan!')) {
            return;
        }

        try {
            const response = await adminService.deleteWorkspace(workspaceId);
            if (response.success) {
                showToast('Đã xóa workspace thành công', 'success');
                loadWorkspaces();
            }
        } catch (error) {
            showToast(error.message || 'Không thể xóa workspace', 'error');
        }
    };

    if (loading && workspaces.length === 0) {
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
                    <h1 className="admin-header-title">Workspace Monitoring</h1>
                    <p className="admin-header-subtitle">
                        Giám sát tất cả workspaces trong hệ thống
                    </p>
                </div>
                <div className="admin-header-actions">
                    <button 
                        className="admin-btn admin-btn-secondary"
                        onClick={loadWorkspaces}
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
                        placeholder="🔍 Tìm kiếm workspace..."
                        value={filters.search}
                        onChange={handleSearch}
                    />
                </div>

                {/* Workspaces Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {workspaces.map((workspace) => (
                        <div
                            key={workspace.id}
                            style={{
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            onClick={() => handleViewDetail(workspace.id)}
                        >
                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    borderRadius: '12px', 
                                    background: '#1c4e70',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: 700
                                }}>
                                    {workspace.name.slice(0, 1).toUpperCase()}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteWorkspace(workspace.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        padding: '4px 8px'
                                    }}
                                    title="Xóa workspace"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#1e293b' }}>
                                {workspace.name}
                            </h3>

                            {workspace.description && (
                                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: '1.5' }}>
                                    {workspace.description}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#1c4e70' }}>
                                        {workspace.members_count}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Members</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>
                                        {workspace.projects_count}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>Projects</div>
                                </div>
                            </div>

                            <div style={{ fontSize: '12px', color: '#64748b', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                                <div><strong>Owner:</strong> {workspace.owner_name}</div>
                                <div><strong>Created:</strong> {formatDistanceToNow(workspace.created_at)}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {workspaces.length === 0 && !loading && (
                    <div className="admin-empty">
                        <i className="fa-solid fa-building"></i>
                        <h3>Chưa có workspace nào</h3>
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

            {/* Workspace Detail Modal */}
            {showDetailModal && selectedWorkspace && (
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
                            maxWidth: '900px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>{selectedWorkspace.workspace.name}</h2>
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

                        {selectedWorkspace.workspace.description && (
                            <p style={{ color: '#64748b', marginBottom: '20px' }}>
                                {selectedWorkspace.workspace.description}
                            </p>
                        )}

                        <div style={{ marginBottom: '20px' }}>
                            <h3>Owner</h3>
                            {selectedWorkspace.owner && (
                                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                    <strong>{selectedWorkspace.owner.username}</strong>
                                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                                        {selectedWorkspace.owner.email}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h3>Members ({selectedWorkspace.members.length})</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                {selectedWorkspace.members.map((member) => (
                                    <div key={member.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <strong>{member.username}</strong>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                    {member.email}
                                                </div>
                                            </div>
                                            <span className={`admin-badge ${member.workspace_role}`}>
                                                {member.workspace_role.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3>Projects ({selectedWorkspace.projects.length})</h3>
                            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                                {selectedWorkspace.projects.map((project) => (
                                    <div key={project.id} style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>{project.name}</strong>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                    {project.description}
                                                </div>
                                            </div>
                                            <span className="admin-badge">{project.status}</span>
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

export default WorkspaceMonitoring;

