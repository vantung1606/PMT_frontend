import React, { useEffect, useState, useRef } from 'react';
import useToast from '../../hooks/useToast';
import PageHeader from '../../components/pageHeader/PageHeader';
import EmptyState from '../../components/emptyState/EmptyState';
import LoadingState from '../../components/loadingState/LoadingState';
import { ToastContainer } from '../../components/toast/Toast';
import ModalAdd from '../../components/modal/ModalAdd';
import StatusBadge from '../../components/statusBadge/StatusBadge';
import taskAssignmentService from '../../services/taskAssignmentService';
import taskService from '../../services/taskService';
import commentService from '../../services/commentService';
import { formatDateForDisplay } from '../../utils/dateHelper';
import { getLastName } from '../../utils/nameHelper';
import { useAuth } from '../../contexts/AuthContext';
import './MyTasks.css';

const MyTasks = () => {
  const { toasts, addToast, removeToast } = useToast();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [progressDraft, setProgressDraft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    loadStatuses();
    loadMyTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStatuses = async () => {
    try {
      const res = await taskService.getStatuses();
      if (res.success) {
        // Convert array of strings to array of objects for StatusBadge
        const statusOptions = res.data.map(status => ({
          value: status,
          label: status
        }));
        setStatuses(statusOptions);
      }
    } catch (err) {
      console.error('Error loading statuses:', err);
      // Fallback to default statuses if API fails
      setStatuses([
        { value: 'Not Started', label: 'Not Started' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' }
      ]);
    }
  };

  const loadMyTasks = async () => {
    setLoading(true);
    try {
      const res = await taskAssignmentService.getMyTasks();
      if (res.success) {
        setTasks(res.data);
      } else {
        addToast('Không thể tải danh sách công việc', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi tải danh sách công việc', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const openTaskDetail = async (task) => {
    try {
      // Load full task details including comments
      const res = await taskService.get(task.task_id);
      if (res.success) {
        setSelectedTask({
          ...task,
          ...res.data,
          assignment_id: task.id
        });
        setProgressDraft(res.data.progress || 0);
        setIsDetailOpen(true);
        // Load comments for this task
        loadComments(task.task_id);
      } else {
        addToast('Không thể tải chi tiết công việc', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi tải chi tiết công việc', 'danger');
    }
  };

  const loadComments = async (taskId) => {
    setLoadingComments(true);
    try {
      const res = await commentService.getTaskComments(taskId);
      if (res.success) {
        setComments(res.data || []);
        // Scroll to bottom after loading
        setTimeout(() => {
          if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedTask(null);
    setProgressDraft(0);
    setComments([]);
    setNewComment('');
  };

  const updateProgress = async () => {
    if (!selectedTask || progressDraft < 0 || progressDraft > 100) {
      addToast('Tiến độ phải từ 0 đến 100', 'warning');
      return;
    }

    setUpdating(true);
    try {
      const progressValue = parseInt(progressDraft);
      const res = await taskService.updateProgress(
        selectedTask.task_id,
        progressValue
      );
      if (res.success) {
        // Update progress
        setSelectedTask(prev => ({ ...prev, progress: progressValue }));
        
        // If progress is 100%, automatically update status to Completed
        if (progressValue === 100) {
          try {
            const statusRes = await taskService.updateStatus(selectedTask.task_id, 'Completed');
            if (statusRes.success) {
              setSelectedTask(prev => ({ ...prev, status: 'Completed', task_status: 'Completed' }));
              addToast('Đã cập nhật tiến độ 100% và chuyển trạng thái sang Completed');
            } else {
              addToast('Đã cập nhật tiến độ nhưng không thể tự động chuyển trạng thái', 'warning');
            }
          } catch (statusErr) {
            addToast('Đã cập nhật tiến độ nhưng không thể tự động chuyển trạng thái', 'warning');
          }
        } else {
          addToast('Đã cập nhật tiến độ');
        }
        
        await loadMyTasks();
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi cập nhật tiến độ', 'danger');
    } finally {
      setUpdating(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!selectedTask) return;

    setUpdating(true);
    try {
      const res = await taskService.updateStatus(selectedTask.task_id, newStatus);
      if (res.success) {
        setSelectedTask(prev => ({ ...prev, status: newStatus, task_status: newStatus }));
        await loadMyTasks();
        addToast('Đã cập nhật trạng thái');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi cập nhật trạng thái', 'danger');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;

    setSubmittingComment(true);
    try {
      const res = await commentService.create(selectedTask.task_id, newComment.trim());
      if (res.success) {
        setNewComment('');
        // Add new comment to list
        setComments(prev => [...prev, res.data]);
        // Scroll to bottom
        setTimeout(() => {
          if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        addToast('Đã thêm bình luận');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi thêm bình luận', 'danger');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Get avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3036';
    return avatar.startsWith('http') 
      ? avatar 
      : `${API_BASE_URL}/uploads/avatars/${avatar}`;
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.task_name?.toLowerCase().includes(query) ||
      task.task_description?.toLowerCase().includes(query) ||
      task.task_status?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mytasks-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <PageHeader
        icon="fa-user-check"
        title="CÔNG VIỆC CỦA TÔI"
        subtitle="Xem và cập nhật tiến độ các công việc được giao cho bạn."
        badge={tasks.length > 0 ? `${tasks.length} công việc` : ''}
        badgeIcon="fa-tasks"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm kiếm công việc..."
      />

      {loading ? (
        <LoadingState message="Đang tải danh sách công việc..." />
      ) : (
        <div className="mytasks-content">
          <div className="mytasks-list modern">
            {filteredTasks.length === 0 && tasks.length > 0 ? (
              <EmptyState
                icon="fa-search"
                title="Không tìm thấy công việc"
                description={`Không có công việc nào khớp với từ khóa "${searchQuery}"`}
              />
            ) : (
              filteredTasks.map((task) => (
              <div
                key={task.id}
                className="mytasks-card"
                onClick={() => openTaskDetail(task)}
              >
 
                <div className="mytasks-card-header">
                  <StatusBadge status={task.task_status} statuses={statuses} />
                  <span className="progress-badge">
                    <i className="fas fa-chart-line"></i>
                    {task.task_progress || 0}%
                  </span>
                </div>
                <h3 className="mytasks-card-title">{task.task_name}</h3>
                {task.task_description && (
                  <p className="mytasks-card-desc">{task.task_description}</p>
                )}
                <div className="mytasks-card-meta">
                  <span className="meta-item">
                    <i className="fas fa-folder"></i>
                    {task.project_name}
                  </span>
                  {task.task_due_date && (
                    <span className="meta-item">
                      <i className="fas fa-calendar-check"></i>
                      Hạn: {formatDateForDisplay(task.task_due_date)}
                    </span>
                  )}
                </div>
                <div className="mytasks-progress">
                  <div className="mytasks-progress-bar">
                    <div
                      className="mytasks-progress-fill"
                      style={{ width: `${task.task_progress || 0}%` }}
                    />
                  </div>
                  <span className="mytasks-progress-text">{task.task_progress || 0}%</span>
                </div>
              </div>
              ))
            )}
            {tasks.length === 0 && (
              <EmptyState
                icon="fa-tasks"
                title="Chưa có công việc nào"
                description="Bạn chưa được giao công việc nào. Các công việc được giao sẽ hiển thị ở đây."
              />
            )}
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <ModalAdd
          isOpen={isDetailOpen}
          onClose={closeDetail}
          title={selectedTask.task_name}
          subtitle={selectedTask.project_name}
          icon="fa-tasks"
          size="large"
          actions={[
            {
              label: 'Đóng',
              icon: 'fa-times',
              className: 'secondary',
              onClick: closeDetail
            }
          ]}
        >
          <div className="task-detail-content">
            <div className="task-detail-section">
              <h4>
                <i className="fas fa-info-circle"></i>
                Thông tin công việc
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Mô tả:</span>
                  <span className="detail-value">
                    {selectedTask.task_description || 'Không có mô tả'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Trạng thái:</span>
                  <div className="detail-value">
                    <select
                      value={selectedTask.task_status || selectedTask.status}
                      onChange={(e) => updateStatus(e.target.value)}
                      disabled={updating}
                      className="status-dropdown"
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {selectedTask.task_due_date && (
                  <div className="detail-item">
                    <span className="detail-label">Hạn hoàn thành:</span>
                    <span className="detail-value">
                      {formatDateForDisplay(selectedTask.task_due_date)}
                    </span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Ngày được giao:</span>
                  <span className="detail-value">
                    {formatDateForDisplay(selectedTask.assigned_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="task-detail-section">
              <h4>
                <i className="fas fa-chart-line"></i>
                Cập nhật tiến độ
              </h4>
              <div className="progress-editor">
                <div className="progress-input-group">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressDraft}
                    onChange={(e) => setProgressDraft(e.target.value)}
                    className="progress-slider"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressDraft}
                    onChange={(e) => setProgressDraft(e.target.value)}
                    className="progress-input"
                  />
                  <span className="progress-percent">%</span>
                </div>
                <button
                  className="primary"
                  onClick={updateProgress}
                  disabled={updating || progressDraft === selectedTask.progress}
                  type="button"
                >
                  <i className="fas fa-save"></i>
                  {updating ? 'Đang lưu...' : 'Lưu tiến độ'}
                </button>
              </div>
              <div className="progress-bar-large">
                <div
                  className="progress-fill-large"
                  style={{ width: `${selectedTask.progress || 0}%` }}
                />
                <span className="progress-text-large">{selectedTask.progress || 0}%</span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="task-detail-section">
              <h4>
                <i className="fas fa-comments"></i>
                Bình luận ({comments.length})
              </h4>
              <div className="comments-container-detail">
                <div className="comments-list-detail">
                  {loadingComments ? (
                    <div className="comments-loading">
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Đang tải bình luận...</span>
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map(comment => (
                      <div
                        key={comment.id}
                        className={`comment-item-detail ${comment.user_id === user.id ? 'own' : ''}`}
                      >
                        <div className="comment-avatar-detail">
                          {comment.avatar ? (
                            <img src={getAvatarUrl(comment.avatar)} alt={comment.username} />
                          ) : (
                            <span>{getLastName(comment.username || 'U').charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="comment-content-detail">
                          <div className="comment-header-detail">
                            <span className="comment-author-detail">{comment.username}</span>
                            <span className="comment-time-detail">
                              {formatDateForDisplay(comment.created_at)}
                            </span>
                          </div>
                          <div className="comment-text-detail">{comment.comment}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="comments-empty">
                      <i className="fas fa-comment-slash"></i>
                      <span>Chưa có bình luận nào</span>
                    </div>
                  )}
                  <div ref={commentsEndRef}></div>
                </div>

                <form
                  className="comment-form-detail"
                  onSubmit={handleAddComment}
                >
                  <input
                    type="text"
                    className="comment-input-detail"
                    placeholder="Nhập bình luận..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submittingComment}
                  />
                  <button
                    type="submit"
                    className="comment-send-btn-detail"
                    disabled={!newComment.trim() || submittingComment}
                  >
                    <i className={`fas ${submittingComment ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </ModalAdd>
      )}
    </div>
  );
};

export default MyTasks;
