import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const badgeParts = badge ? badge.toString().split(' ') : [];
  const badgeNum = badgeParts[0] || '0';
  const badgeText = badgeParts.slice(1).join(' ') || '';

  return (
    <div className={`page-header-wrapper ${className}`}>
      {/* TOP NAV BAR */}
      <div className="ph-top-nav-bar">
        <div className="ph-nav-left">
          <div className="ph-nav-icon-box">
            <i className={`fas ${icon}`}></i>
          </div>
          <span className="ph-nav-title">{title}</span>
        </div>
        <div className="ph-nav-right">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`ph-btn ${action.className === 'primary' ? 'ph-btn-primary' : 'ph-btn-secondary'}`}
              onClick={action.onClick}
              type={action.type || 'button'}
              disabled={action.disabled}
            >
              {action.icon && <i className={`fas ${action.icon}`}></i>} {action.label}
            </button>
          ))}
          <div className="ph-nav-user-actions">
            <i className="far fa-bell"></i>
            <i className="fas fa-cog"></i>
          </div>
        </div>
      </div>

      {/* WELCOME BANNER SECTION */}
      <div className="ph-welcome-section">
        <div className="ph-welcome-text">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {badge && (
          <div className="ph-welcome-stats">
            <div className="ph-stat-card">
              <div className="ph-stat-icon ph-red-bg">
                <i className={`fas ${badgeIcon || icon}`}></i>
              </div>
              <div className="ph-stat-info">
                <h3>{badgeNum}</h3>
                <p>{badgeText || 'Mục'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CONTROLS SECTION */}
      {onSearchChange && (
        <div className="ph-controls-section">
          <div className="ph-search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              value={searchValue} 
              onChange={e => onSearchChange(e.target.value)} 
            />
          </div>
          <div className="ph-view-toggles">
            <button className="ph-view-btn active"><i className="fas fa-th-large"></i></button>
            <button className="ph-view-btn"><i className="fas fa-list"></i></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
