import React, { useEffect } from 'react';
import './ModalAdd.css';

const ModalAdd = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon = 'fa-info-circle',
  iconType = 'default', // 'default' | 'danger' | 'success'
  size = 'normal', // 'small' | 'normal' | 'large'
  children,
  actions = [],
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className={`modal-content ${size} ${className}`}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            {title && <h2 className="modal-title">{title}</h2>}
            {subtitle && <p className="modal-description">{subtitle}</p>}
          </div>
          {showCloseButton && (
            <button 
              className="modal-close-btn" 
              onClick={onClose} 
              type="button" 
              aria-label="Đóng"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        
        {/* Body */}
        <div className="modal-body">
          {children}
        </div>
        
        {/* Actions */}
        {actions.length > 0 && (
          <div className="modal-footer">
            {actions.map((action, index) => (
              <button
                key={index}
                type={action.type || 'button'}
                className={`modal-action-btn ${action.className || 'outline'}`}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && <i className={`fas ${action.icon}`}></i>}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalAdd;

