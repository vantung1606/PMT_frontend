import api from './api';

const authService = {
  // Xác thực thông tin đăng nhập và lưu token vào session
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success && response.data.data.token) {
        sessionStorage.setItem('token', response.data.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error);
      }
      
      // Chuyển đổi mảng lỗi validation thành chuỗi để hiển thị
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        throw new Error(errorMessages);
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi kết nối đến server';
      throw new Error(errorMessage);
    }
  },

  // Tạo tài khoản mới và tự động đăng nhập
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success && response.data.data.token) {
        sessionStorage.setItem('token', response.data.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Register error:', error);
      }
      
      // Hiển thị lỗi validation một cách thân thiện
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        throw new Error(errorMessages);
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi kết nối đến server';
      throw new Error(errorMessage);
    }
  },

  // Xóa token và thông tin user khỏi session
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  // Parse thông tin user từ session storage
  getCurrentUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Kiểm tra user đã đăng nhập hay chưa dựa trên token
  isAuthenticated: () => {
    return !!sessionStorage.getItem('token');
  },

  // Lấy thông tin profile đầy đủ từ server
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Get profile error:', error);
      }
      throw error.response?.data || { success: false, message: 'Lỗi kết nối' };
    }
  },

  // Cập nhật thông tin cá nhân và lưu lại vào session
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      
      if (response.data.success && response.data.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Profile update error:', error);
      }
      
      // Tổng hợp các lỗi validation để hiển thị
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        throw new Error(errorMessages);
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi kết nối đến server';
      throw new Error(errorMessage);
    }
  },

  // Thay đổi mật khẩu sau khi xác thực mật khẩu cũ
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Lỗi kết nối' };
    }
  },

  // Upload ảnh đại diện với validation trước khi gửi
  uploadAvatar: async (file) => {
    try {
      // Kiểm tra file hợp lệ để tránh lãng phí bandwidth
      if (!file) {
        throw new Error('Không có file được chọn');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File phải là ảnh (jpeg, jpg, png, gif, webp)');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Kích thước file không được vượt quá 5MB');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      // Browser tự động set Content-Type multipart/form-data với boundary
      const response = await api.post('/auth/profile/avatar', formData);
      
      if (response.data.success && response.data.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Upload avatar error:', error);
        console.error('Error response:', error.response?.data);
      }
      
      // Backend trả về mảng lỗi, cần gộp lại thành chuỗi
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        throw new Error(errorMessages);
      }
      
      // Lỗi từ Multer (file upload middleware)
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      const errorMessage = error.message || 'Lỗi kết nối đến server';
      throw new Error(errorMessage);
    }
  },
};

export default authService; 