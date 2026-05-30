import api from './api';

const projectService = {
  list: async () => {
    const res = await api.get('/projects');
    return res.data;
  },
  getMyProjects: async () => {
    const res = await api.get('/projects/my/list');
    return res.data;
  },
  get: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/projects', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/projects/${id}` , data);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
  getUsers: async (query = '', limit = 8) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (limit) params.append('limit', limit);
    const res = await api.get(`/projects/users/list?${params.toString()}`);
    return res.data;
  },
  // Search users by email from users table
  searchUsersByEmail: async (query = '', limit = 10) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (limit) params.append('limit', limit);
    const res = await api.get(`/users/search/emails?${params.toString()}`);
    return res.data;
  },
  getMembers: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/members`);
    return res.data;
  },
  addMember: async (projectId, data) => {
    const res = await api.post(`/projects/${projectId}/members`, data);
    return res.data;
  },
  removeMember: async (projectId, memberId) => {
    const res = await api.delete(`/projects/${projectId}/members/${memberId}`);
    return res.data;
  },
  getStatuses: async () => {
    const res = await api.get('/projects/statuses/list');
    if (process.env.NODE_ENV === 'development') {
      console.log('getStatuses API response:', res.data);
    }
    return res.data;
  }
};

export default projectService;


