import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3036/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Thêm token và workspace_id vào mỗi request để xác thực và phân quyền
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Gửi workspace_id để backend biết user đang làm việc trong workspace nào
    const workspaceId = localStorage.getItem('currentWorkspaceId');
    if (workspaceId) {
      config.headers['x-workspace-id'] = workspaceId;
      // Tự động thêm workspace_id vào body để backend không cần check header
      if ((config.method === 'post' || config.method === 'put') && config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
        if (!config.data.workspace_id) {
          config.data.workspace_id = parseInt(workspaceId);
        }
      }
      // GET request cần workspace_id trong query params thay vì body
      if (config.method === 'get' && !config.params?.workspace_id) {
        if (!config.params) config.params = {};
        config.params.workspace_id = workspaceId;
      }
    }
    
    // FormData cần browser tự set Content-Type để có boundary cho multipart
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Debug request để kiểm tra workspace context
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        workspaceId: workspaceId || 'none'
      });
    }
    
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// Xử lý response và các lỗi phổ biến từ backend
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
      });
    }
    return response;
  },
  (error) => {
    // Debug error để dễ dàng troubleshoot
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
      });
    }
    
    // Token hết hạn hoặc không hợp lệ, đăng xuất tự động
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      // Tránh redirect loop khi đã ở trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 