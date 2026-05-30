import api from './api';

const taskAssignmentService = {
  // Get tasks assigned to current user
  getMyTasks: async () => {
    const res = await api.get('/task-assignments/my-tasks');
    return res.data;
  },

  // Assign task to user(s)
  assignTask: async (task_id, user_ids) => {
    const res = await api.post('/task-assignments/assign', { task_id, user_ids });
    return res.data;
  },

  // Get assignments for a task
  getTaskAssignments: async (taskId) => {
    const res = await api.get(`/task-assignments/task/${taskId}`);
    return res.data;
  },

  // Remove assignment
  removeAssignment: async (id) => {
    const res = await api.delete(`/task-assignments/${id}`);
    return res.data;
  },

  // Remove assignment by task and user
  removeAssignmentByTaskAndUser: async (taskId, userId) => {
    const res = await api.delete(`/task-assignments/task/${taskId}/user/${userId}`);
    return res.data;
  }
};

export default taskAssignmentService;

