import React, { useEffect, useState } from 'react';
import useToast from '../../hooks/useToast';
import PageHeader from '../../components/pageHeader/PageHeader';
import EmptyState from '../../components/emptyState/EmptyState';
import LoadingState from '../../components/loadingState/LoadingState';
import { ToastContainer } from '../../components/toast/Toast';
import notificationService from '../../services/notificationService';
import { formatDateForDisplay } from '../../utils/dateHelper';
import './Notifications.css';

const Notifications = () => {
  const { toasts, addToast, removeToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    
    // Refresh unread count every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.list({
        unreadOnly: filter === 'unread',
        limit: 100
      });
      if (res.success) {
        setNotifications(res.data);
      } else {
        addToast('Không thể tải thông báo', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi tải thông báo', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      if (res.success) {
        setUnreadCount(res.data.count || 0);
      }
    } catch (err) {
      // Silent fail for unread count
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi đánh dấu đã đọc', 'danger');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
        addToast('Đã đánh dấu tất cả là đã đọc');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi đánh dấu tất cả đã đọc', 'danger');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await notificationService.remove(id);
      if (res.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        addToast('Đã xóa thông báo', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi xóa thông báo', 'danger');
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  return (
    <div className="notifications-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <PageHeader
        icon="fa-bell"
        title="THÔNG BÁO"
        subtitle="Xem tất cả thông báo và cập nhật từ hệ thống."
        badge={unreadCount > 0 ? `${unreadCount} chưa đọc` : ''}
        badgeIcon="fa-bell"
        actions={[
          {
            label: 'Đánh dấu tất cả đã đọc',
            icon: 'fa-check-double',
            className: 'secondary',
            onClick: handleMarkAllAsRead,
            disabled: unreadCount === 0
          }
        ]}
      />

      <div className="notifications-content">
        <div className="notifications-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            type="button"
          >
            <i className="fas fa-list"></i>
            Tất cả ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
            type="button"
          >
            <i className="fas fa-envelope"></i>
            Chưa đọc ({unreadCount})
          </button>
        </div>

        {loading ? (
          <LoadingState message="Đang tải thông báo..." />
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <div className="notification-content">
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">
                    {formatDateForDisplay(notification.created_at)}
                  </div>
                </div>
                <div className="notification-actions">
                  {!notification.is_read && (
                    <button
                      className="action-btn read-btn"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Đánh dấu đã đọc"
                      type="button"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(notification.id)}
                    title="Xóa"
                    type="button"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
            {filteredNotifications.length === 0 && (
              <EmptyState
                icon="fa-bell-slash"
                title={filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}
                description={filter === 'unread' 
                  ? 'Tất cả thông báo đã được đọc.'
                  : 'Các thông báo từ hệ thống sẽ hiển thị ở đây.'}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
