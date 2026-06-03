import './EmptyState.css';

const EmptyState = ({ 
  icon = 'fa-folder-open', 
  title, 
  description, 
  actionLabel,
  onAction,
  className = '' 
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-icon-wrapper">
        <i className={`fas ${icon} empty-icon`}></i>
      </div>
      {title && <div className="empty-title">{title}</div>}
      {description && <div className="empty-desc">{description}</div>}
      {actionLabel && onAction && (
        <button className="empty-action-btn" onClick={onAction} type="button">
          <i className="fas fa-plus"></i>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

