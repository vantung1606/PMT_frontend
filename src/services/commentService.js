import api from './api';

const commentService = {
  // Get comments for a task
  getTaskComments: async (taskId) => {
    const res = await api.get(`/comments/task/${taskId}`);
    return res.data;
  },

  // Create a comment
  create: async (task_id, comment) => {
    const res = await api.post('/comments', { task_id, comment });
    return res.data;
  },

  // Update a comment
  update: async (id, comment) => {
    const res = await api.put(`/comments/${id}`, { comment });
    return res.data;
  },

  // Delete a comment
  remove: async (id) => {
    const res = await api.delete(`/comments/${id}`);
    return res.data;
  }
};

export default commentService;

