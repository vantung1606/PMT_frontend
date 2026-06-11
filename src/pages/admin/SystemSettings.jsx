import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import useToast from '../../hooks/useToast';
import { ToastContainer } from '../../components/toast/Toast';

const SystemSettings = () => {
    const [systemInfo, setSystemInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        loadSystemInfo();
    }, []);

    const loadSystemInfo = async () => {
        try {
            setLoading(true);
            const response = await adminService.getSystemInfo();
            if (response.success) {
                setSystemInfo(response.data);
            }
        } catch (error) {
            showToast(error.message || 'Không thể tải thông tin hệ thống', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatUptime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    if (loading) {
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
                    <h1 className="admin-header-title">System Settings</h1>
                    <p className="admin-header-subtitle">
                        Thông tin và cấu hình hệ thống
                    </p>
                </div>
                <div className="admin-header-actions">
                    <button 
                        className="admin-btn admin-btn-primary"
                        onClick={loadSystemInfo}
                    >
                        <i className="fa-solid fa-refresh"></i>
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {/* System Info Cards */}
                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="admin-stat-icon blue">
                            <i className="fa-brands fa-node-js"></i>
                        </div>
                        <div className="admin-stat-info">
                            <div className="admin-stat-label">Node.js Version</div>
                            <div className="admin-stat-value" style={{ fontSize: '20px' }}>
                                {systemInfo?.nodeVersion || 'N/A'}
                            </div>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon green">
                            <i className="fa-solid fa-database"></i>
                        </div>
                        <div className="admin-stat-info">
                            <div className="admin-stat-label">Database</div>
                            <div className="admin-stat-value" style={{ fontSize: '20px' }}>
                                MySQL {systemInfo?.databaseVersion?.split('-')[0] || 'N/A'}
                            </div>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon purple">
                            <i className="fa-solid fa-server"></i>
                        </div>
                        <div className="admin-stat-info">
                            <div className="admin-stat-label">Environment</div>
                            <div className="admin-stat-value" style={{ fontSize: '20px' }}>
                                {systemInfo?.environment || 'development'}
                            </div>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-icon orange">
                            <i className="fa-solid fa-clock"></i>
                        </div>
                        <div className="admin-stat-info">
                            <div className="admin-stat-label">Uptime</div>
                            <div className="admin-stat-value" style={{ fontSize: '16px' }}>
                                {systemInfo?.uptime ? formatUptime(systemInfo.uptime) : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Database Tables */}
                <div style={{ marginTop: '24px' }}>
                    <h3 style={{ marginBottom: '16px' }}>
                        <i className="fa-solid fa-table"></i> Database Tables
                    </h3>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Table Name</th>
                                    <th>Rows</th>
                                    <th>Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                {systemInfo?.tableSizes?.map((table, index) => {
                                    const tableName = table.table_name || table.TABLE_NAME;
                                    const tableRows = table.table_rows !== undefined ? table.table_rows : table.TABLE_ROWS;
                                    const sizeMb = table.size_mb || table.SIZE_MB;
                                    return (
                                        <tr key={tableName || index}>
                                            <td>
                                                <code style={{ 
                                                    background: '#f1f5f9', 
                                                    padding: '4px 8px', 
                                                    borderRadius: '4px',
                                                    fontSize: '13px',
                                                    fontFamily: 'monospace'
                                                }}>
                                                    {tableName || 'N/A'}
                                                </code>
                                            </td>
                                            <td>{(tableRows !== undefined && tableRows !== null) ? Number(tableRows).toLocaleString() : 0}</td>
                                            <td>{sizeMb || 0} MB</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Configuration Info */}
                <div style={{ marginTop: '32px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                    <h3 style={{ marginBottom: '16px' }}>
                        <i className="fa-solid fa-info-circle"></i> Configuration Info
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                                Environment
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                                {systemInfo?.environment || 'development'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                                Node Version
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                                {systemInfo?.nodeVersion || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                                Database Version
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                                {systemInfo?.databaseVersion || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                                System Uptime
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                                {systemInfo?.uptime ? formatUptime(systemInfo.uptime) : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '8px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'start'
                }}>
                    <i className="fa-solid fa-exclamation-triangle" style={{ color: '#f59e0b', fontSize: '20px' }}></i>
                    <div>
                        <strong style={{ color: '#92400e' }}>Lưu ý</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#78350f' }}>
                            Các thay đổi cấu hình hệ thống nên được thực hiện trực tiếp trên server thông qua file .env và database configuration.
                            Khởi động lại server sau khi thay đổi cấu hình.
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
};

export default SystemSettings;

