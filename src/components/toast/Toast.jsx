import React from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose }) => {
  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        <i className={`fas ${type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
        <span>{message}</span>
      </div>
      {onClose && (
        <button className="toast-close" onClick={onClose} type="button" aria-label="Đóng">
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => onRemove?.(t.id)}
        />
      ))}
    </div>
  );
};

export default Toast;

