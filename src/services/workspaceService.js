import api from './api';

const workspaceService = {
  getMyWorkspaces: async () => {
    const res = await api.get('/workspaces/my');
    return res.data;
  },

  createWorkspace: async (data) => {
    const res = await api.post('/workspaces', data);
    return res.data;
  },

  getWorkspaceDetail: async (id) => {
    const res = await api.get(`/workspaces/${id}`);
    return res.data;
  },

  addMember: async (workspaceId, data) => {
    const res = await api.post(`/workspaces/${workspaceId}/members`, data);
    return res.data;
  },

  updateMemberRole: async (workspaceId, userId, data) => {
    const res = await api.put(`/workspaces/${workspaceId}/members/${userId}/role`, data);
    return res.data;
  }
};

export default workspaceService;


