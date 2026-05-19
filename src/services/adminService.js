import api from './api';

const adminService = {
    // ========== DASHBOARD ==========
    getDashboardStats: async () => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // ========== USER MANAGEMENT ==========
    getAllUsers: async (params = {}) => {
        try {
            const response = await api.get('/admin/users', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserDetail: async (userId) => {
        try {
            const response = await api.get(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateUserRole: async (userId, role) => {
        try {
            const response = await api.put(`/admin/users/${userId}/role`, { role });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    toggleUserStatus: async (userId, isBlocked) => {
        try {
            const response = await api.put(`/admin/users/${userId}/status`, { 
                is_blocked: isBlocked 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // ========== WORKSPACE MONITORING ==========
    getAllWorkspaces: async (params = {}) => {
        try {
            const response = await api.get('/admin/workspaces', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getWorkspaceDetail: async (workspaceId) => {
        try {
            const response = await api.get(`/admin/workspaces/${workspaceId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deleteWorkspace: async (workspaceId) => {
        try {
            const response = await api.delete(`/admin/workspaces/${workspaceId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // ========== ACTIVITY LOGS ==========
    getActivityLogs: async (params = {}) => {
        try {
            const response = await api.get('/admin/logs', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getActivityStats: async () => {
        try {
            const response = await api.get('/admin/logs/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // ========== SYSTEM SETTINGS ==========
    getSystemInfo: async () => {
        try {
            const response = await api.get('/admin/system/info');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default adminService;

