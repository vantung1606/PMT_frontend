import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, statuses = [] }) => {
  // Debug: Log statuses khi component render
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (statuses.length === 0) {
        console.warn('StatusBadge: statuses array is empty');
      } else {
        console.log('StatusBadge: Received statuses:', statuses.length, 'items');
        console.log('StatusBadge: Current status:', status);
        console.log('StatusBadge: Statuses values:', statuses.map(s => s.value));
      }
    }
  }, [statuses, status]);

  // Helper function để lấy thông tin status từ API
  const getStatusInfo = (statusValue) => {
    if (!statusValue || !statuses || statuses.length === 0) {
      return { 
        label: statusValue || 'Unknown', 
        icon: 'fa-circle', 
        class: statusValue?.toLowerCase().replace(/\s+/g, '-') || 'default' 
      };
    }

    const statusObj = statuses.find(s => s.value === statusValue);
    if (statusObj) {
      // Thêm fa-spin cho In Progress
      let icon = statusObj.icon || 'fa-circle';
      if (statusValue === 'In Progress' && icon && !icon.includes('fa-spin')) {
        icon = icon + ' fa-spin';
      }
      return {
        label: statusObj.label || statusValue,
        icon: icon,
        class: statusObj.class || statusValue.toLowerCase().replace(/\s+/g, '-')
      };
    }
    
    // Fallback nếu không tìm thấy
    if (process.env.NODE_ENV === 'development') {
      console.warn('StatusBadge: Status not found in statuses:', statusValue, 'Available:', statuses.map(s => s.value));
    }
    
    return { 
      label: statusValue, 
      icon: 'fa-circle', 
      class: statusValue?.toLowerCase().replace(/\s+/g, '-') || 'default' 
    };
  };

  // Helper function để normalize status class name
  const getStatusClass = (statusValue) => {
    if (!statusValue) return 'default';
    if (!statuses || statuses.length === 0) {
      return statusValue.toLowerCase().replace(/\s+/g, '-');
    }
    
    const statusObj = statuses.find(s => s.value === statusValue);
    const className = statusObj?.class || statusValue.toLowerCase().replace(/\s+/g, '-');
    
    return className;
  };

  if (!status) return null;

  const statusInfo = getStatusInfo(status);
  const statusClass = getStatusClass(status);

  return (
    <span className={`status-badge ${statusClass}`}>
      <i className={`fas ${statusInfo.icon}`}></i>
      {statusInfo.label}
    </span>
  );
};

export default StatusBadge;

