import React from 'react';
import './PageHeader.css';

const PageHeader = ({ 
  icon = 'fa-folder', 
  title, 
  subtitle, 
  badge, 
  badgeIcon,
  actions = [],
  searchValue = '',
  onSearchChange = null,
  searchPlaceholder = 'Tìm kiếm...',
  className = '' 
}) => {
  return (
    <div className={`page-header ${className}`}>
      <div className="header-content">
        <div className="header-icon-wrapper">
          <i className={`fas ${icon}`}></i>
        </div>
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="header-right-section">
        {/* Search Input */}
        {onSearchChange && (
          <div className="header-search">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchValue && (
              <button
                className="search-clear"
                onClick={() => onSearchChange('')}
                type="button"
                title="Xóa tìm kiếm"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        )}
        {(badge || actions.length > 0) && (
          <div className="header-actions">
            {badge && (
              <span className="badge-prj">
                {badgeIcon && <i className={`fas ${badgeIcon}`}></i>}
                {badge}
              </span>
            )}
            {actions.map((action, index) => (
              <button
                key={index}
                className={action.className || 'primary'}
                onClick={action.onClick}
                type={action.type || 'button'}
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

export default PageHeader;

