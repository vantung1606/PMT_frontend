import api from './api';

const aiService = {
  chat: async (messages, project_name, user_projects) => {
    const res = await api.post('/ai/chat', { messages, project_name, user_projects }, {
      timeout: 60000
    });
    return res.data;
  },

  generateTaskSuggestions: async (project_name) => {
    const res = await api.post('/ai/tasks/suggestions', { project_name }, {
      timeout: 60000
    });
    return res.data;
  }
};

export default aiService;

