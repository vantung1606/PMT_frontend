import api from './api';

const projectCommentService = {
  getProjectComments: async (projectId) => {
    const res = await api.get(`/project-comments/project/${projectId}`);
    return res.data;
  },
  create: async (projectId, comment) => {
    const res = await api.post('/project-comments', {
      project_id: projectId,
      comment: comment
    });
    return res.data;
  },
  update: async (id, comment) => {
    const res = await api.put(`/project-comments/${id}`, { comment });
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/project-comments/${id}`);
    return res.data;
  }
};

export default projectCommentService;

