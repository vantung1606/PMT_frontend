import { useState, useCallback } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Thêm thông báo mới và tự động ẩn
  const addToast = useCallback((message, type = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Tự động xóa toast
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  // Xóa thông báo thủ công khi user click
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { 
    toasts, 
    addToast, 
    removeToast,
    showToast: addToast
  };
};

export default useToast;

