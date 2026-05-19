import api from './api';

const memberService = {
  // Lấy danh sách tất cả members (backend đã xử lý phân quyền)
  list: async () => {
    const res = await api.get('/members');
    return res.data;
  },
  
  // Lấy thông tin member theo ID
  get: async (id) => {
    const res = await api.get(`/members/${id}`);
    return res.data;
  },
  
  // Tạo member mới
  create: async (data) => {
    const res = await api.post('/members', data);
    return res.data;
  },
  
  // Cập nhật thông tin member
  update: async (id, data) => {
    const res = await api.put(`/members/${id}`, data);
    return res.data;
  },
  
  // Xóa member
  remove: async (id) => {
    const res = await api.delete(`/members/${id}`);
    return res.data;
  },
  
  // Tìm kiếm email theo pattern (cho autocomplete)
  searchEmails: async (query = '', limit = 10) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (limit) params.append('limit', limit);
    const res = await api.get(`/members/search/emails?${params.toString()}`);
    return res.data;
  }
};

export default memberService;

