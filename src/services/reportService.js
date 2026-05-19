import api from './api';

const reportService = {
  // Get project statistics
  getProjectStats: async () => {
    const res = await api.get('/reports/projects/stats');
    return res.data;
  },

  // Get task statistics
  getTaskStats: async () => {
    const res = await api.get('/reports/tasks/stats');
    return res.data;
  },

  // Get task progress by project
  getTaskProgressByProject: async () => {
    const res = await api.get('/reports/tasks/progress-by-project');
    return res.data;
  },

  // Get tasks by month
  getTasksByMonth: async () => {
    const res = await api.get('/reports/tasks/by-month');
    return res.data;
  },

  // Get user activity stats
  getUserActivityStats: async () => {
    const res = await api.get('/reports/users/activity');
    return res.data;
  }
};

export default reportService;

