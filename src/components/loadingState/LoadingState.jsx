import React from 'react';
import './LoadingState.css';

const LoadingState = ({ message = 'Đang tải...', className = '' }) => {
  return (
    <div className={`loading-state ${className}`}>
      <i className="fas fa-spinner fa-spin loading-icon"></i>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingState;

