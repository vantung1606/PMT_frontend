import api from './api';

const userService = {
  // Lấy danh sách tất cả users
  list: async () => {
    const res = await api.get('/users');
    return res.data;
  },
  
  // Lấy thông tin user theo ID
  get: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },
  
  // Tạo user mới
  create: async (data) => {
    const res = await api.post('/users', data);
    return res.data;
  },
  
  // Cập nhật thông tin user
  update: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },
  
  // Xóa user
  remove: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
  
  // Lấy danh sách users có sẵn (với tìm kiếm)
  getAvailableMembers: async (query = '', limit = 50) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (limit) params.append('limit', limit);
    const res = await api.get(`/users/available/members?${params.toString()}`);
    return res.data;
  },
  
  // Tìm kiếm email theo pattern (chỉ role tl, mb, clt)
  searchEmails: async (query = '', limit = 10) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (limit) params.append('limit', limit);
    const res = await api.get(`/users/search/emails?${params.toString()}`);
    return res.data;
  }
};

export default userService;

