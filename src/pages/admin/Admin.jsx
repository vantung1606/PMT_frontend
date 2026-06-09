import React, { useState } from 'react';
import AdminLayout from '../../layouts/adminLayout/AdminLayout';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import WorkspaceMonitoring from './WorkspaceMonitoring';
import ActivityLogs from './ActivityLogs';
import SystemSettings from './SystemSettings';

const Admin = () => {
    const [currentView, setCurrentView] = useState('dashboard');

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'users':
                return <UserManagement />;
            case 'workspaces':
                return <WorkspaceMonitoring />;
            case 'logs':
                return <ActivityLogs />;
            case 'settings':
                return <SystemSettings />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <AdminLayout currentView={currentView} setCurrentView={setCurrentView}>
            {renderView()}
        </AdminLayout>
    );
};

export default Admin;

