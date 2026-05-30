import api from './api';

const notificationService = {
  // Get user's notifications
  list: async (options = {}) => {
    const params = new URLSearchParams();
    if (options.unreadOnly) params.append('unreadOnly', 'true');
    if (options.limit) params.append('limit', options.limit);
    const res = await api.get(`/notifications?${params.toString()}`);
    return res.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const res = await api.get('/notifications/unread-count');
    return res.data;
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const res = await api.put('/notifications/read-all');
    return res.data;
  },

  // Delete notification
  remove: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  }
};

export default notificationService;

