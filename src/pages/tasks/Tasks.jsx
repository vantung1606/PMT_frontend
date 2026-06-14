import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import usePermissions from '../../hooks/usePermissions';
import useToast from '../../hooks/useToast';
import PageHeader from '../../components/pageHeader/PageHeader';
import EmptyState from '../../components/emptyState/EmptyState';
import LoadingState from '../../components/loadingState/LoadingState';
import { ToastContainer } from '../../components/toast/Toast';
import ModalAdd from '../../components/modal/ModalAdd';
import StatusBadge from '../../components/statusBadge/StatusBadge';
import taskService from '../../services/taskService';
import projectService from '../../services/projectService';
import commentService from '../../services/commentService';
import taskAssignmentService from '../../services/taskAssignmentService';
import userService from '../../services/userService';
import { getSocket } from '../../services/socketService';
import { formatDateForInput, formatDateForDisplay } from '../../utils/dateHelper';
import { getLastName } from '../../utils/nameHelper';
import './Tasks.css';

const DEFAULT_STATUS = 'In Progress';

// Helper function to render text with clickable links
const renderTextWithLinks = (text) => {
  if (!text) return null;
  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="inline-link" onClick={(e) => e.stopPropagation()} style={{ color: '#0056b3', textDecoration: 'underline', wordBreak: 'break-all' }}>
          <i className="fas fa-external-link-alt" style={{ marginRight: '4px', fontSize: '0.85em' }}></i>
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const emptyForm = {
  name: '',
  description: '',
  status: DEFAULT_STATUS,
  progress: 0,
  due_date: '',
};

const Tasks = () => {
  const { user } = useAuth();
  const permissions = usePermissions();
  const { toasts, addToast, removeToast } = useToast();
  const canCreate = permissions.canCreateTask;
  const canEdit = permissions.canEditTask;
  const canDelete = permissions.canDeleteTask;
  // MB, TL, PM, Admin đều có thể cập nhật progress
  const canUpdateProgress = permissions.isMember || permissions.isTL || permissions.isPM || permissions.isAdmin;

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([{ value: DEFAULT_STATUS, label: DEFAULT_STATUS }]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [taskComments, setTaskComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [taskAssignments, setTaskAssignments] = useState({});
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberQuery, setMemberQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [assigningMember, setAssigningMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const socketRef = useRef(null);
  const commentsEndRefs = useRef({});
  const detailCommentInputRef = useRef(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await taskService.getStatuses();
        if (res.success && Array.isArray(res.data) && res.data.length) {
          const options = res.data.map(status => ({ value: status, label: status }));
          setStatuses(options);
          setForm(prev => ({
            ...prev,
            status: res.data.includes(prev.status) ? prev.status : DEFAULT_STATUS
          }));
        }
      } catch (err) {
        addToast('Không thể tải danh sách trạng thái', 'danger');
      }
    };
    fetchStatuses();
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await projectService.getMyProjects();
        if (res.success) {
          setProjects(res.data);
          if (res.data.length > 0 && !selectedProjectId) {
            setSelectedProjectId(res.data[0].id);
          }
        }
      } catch (err) {
        addToast('Không thể tải danh sách dự án', 'danger');
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadTasks(selectedProjectId);
    } else {
      setTasks([]);
    }
  }, [selectedProjectId]);

  // Setup socket connection
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    
    socketRef.current = socket;

    socket.on('comment-received', (comment) => {
      setTaskComments(prev => {
        const taskId = comment.task_id;
        const existingComments = prev[taskId] || [];
        // Check if comment already exists
        if (existingComments.some(c => c.id === comment.id)) {
          return prev;
        }
        return {
          ...prev,
          [taskId]: [...existingComments, comment]
        };
      });
      // Scroll to bottom
      setTimeout(() => {
        const ref = commentsEndRefs.current[comment.task_id];
        if (ref) {
          ref.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });

    socket.on('comment-error', (error) => {
      addToast(error.message || 'Lỗi khi gửi bình luận', 'danger');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('comment-received');
        socketRef.current.off('comment-error');
      }
    };
  }, []);

  const loadTasks = async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await taskService.listByProject(projectId);
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

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const closeFormOnly = () => {
    setIsFormOpen(false);
  };

  const openCreateModal = () => {
    if (!selectedProjectId) {
      addToast('Vui lòng chọn dự án trước', 'warning');
      return;
    }
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditModal = async (task) => {
    try {
      const res = await taskService.get(task.id);
      if (res.success) {
        setEditingId(task.id);
        setForm({
          name: res.data.name || '',
          description: res.data.description || '',
          status: res.data.status || DEFAULT_STATUS,
          progress: res.data.progress || 0,
          due_date: formatDateForInput(res.data.due_date),
        });
        setIsFormOpen(true);
      } else {
        addToast('Không thể tải thông tin công việc', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi tải thông tin công việc', 'danger');
    }
  };

  const openDetailModal = async (task) => {
    try {
      const res = await taskService.get(task.id);
      if (res.success) {
        setSelectedTask(res.data);
        setIsDetailOpen(true);
        // Join socket room
        if (socketRef.current) {
          socketRef.current.emit('join-task', task.id);
        }
        // Load comments if not already loaded
        if (!taskComments[task.id]) {
          await loadComments(task.id);
        }
        // Load task assignments
        await loadTaskAssignments(task.id);
        // Focus comment input after modal opens
        setTimeout(() => {
          detailCommentInputRef.current?.focus();
        }, 300);
      } else {
        addToast('Không thể tải thông tin công việc', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi tải thông tin công việc', 'danger');
    }
  };

  const closeDetailModal = () => {
    if (selectedTask && socketRef.current) {
      socketRef.current.emit('leave-task', selectedTask.id);
    }
    setIsDetailOpen(false);
    setSelectedTask(null);
    setCommentInputs(prev => ({
      ...prev,
      [selectedTask?.id]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      addToast('Vui lòng chọn dự án', 'warning');
      return;
    }
    if (!form.name.trim()) {
      addToast('Tên công việc là bắt buộc', 'warning');
      return;
    }

    try {
      if (editingId) {
        const res = await taskService.update(editingId, {
          ...form,
          project_id: selectedProjectId,
        });
        if (res.success) {
          await loadTasks(selectedProjectId);
          addToast('Đã cập nhật công việc');
          resetForm();
        }
      } else {
        const res = await taskService.create({
          ...form,
          project_id: selectedProjectId,
        });
        if (res.success) {
          await loadTasks(selectedProjectId);
          addToast('Đã tạo công việc mới');
          resetForm();
        }
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi lưu công việc', 'danger');
    }
  };

  const handleUpdateProgress = async (taskId, newProgress) => {
    if (!canUpdateProgress) {
      addToast('Bạn không có quyền cập nhật tiến độ', 'warning');
      return;
    }
    
    setUpdatingProgress(true);
    try {
      const updateRes = await taskService.updateProgress(taskId, newProgress);
      if (updateRes.success) {
        await loadTasks(selectedProjectId);
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(prev => ({ ...prev, progress: newProgress }));
        }
        addToast('Đã cập nhật tiến độ');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi cập nhật tiến độ', 'danger');
    } finally {
      setUpdatingProgress(false);
    }
  };

  const loadTaskAssignments = async (taskId) => {
    try {
      const res = await taskAssignmentService.getTaskAssignments(taskId);
      if (res.success) {
        setTaskAssignments(prev => ({
          ...prev,
          [taskId]: res.data
        }));
      }
    } catch (err) {
      // Silently fail - assignments are optional
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading task assignments:', err);
      }
    }
  };

  const handleOpenMemberModal = () => {
    setIsMemberModalOpen(true);
    setMemberQuery('');
    setAvailableUsers([]);
  };

  const handleSearchMembers = async (query) => {
    setMemberQuery(query);
    if (!query.trim()) {
      setAvailableUsers([]);
      return;
    }

    setLoadingMembers(true);
    try {
      const res = await userService.getAvailableMembers(query, 10);
      if (res.success) {
        // Filter out users already assigned
        const currentAssignments = taskAssignments[selectedTask?.id] || [];
        const assignedUserIds = currentAssignments.map(a => a.user_id);
        setAvailableUsers(res.data.filter(u => !assignedUserIds.includes(u.id)));
      }
    } catch (err) {
      addToast('Không thể tìm kiếm thành viên', 'danger');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAssignMember = async (userId) => {
    if (!selectedTask) return;

    setAssigningMember(true);
    try {
      const res = await taskAssignmentService.assignTask(selectedTask.id, [userId]);
      if (res.success) {
        await loadTaskAssignments(selectedTask.id);
        addToast('Đã thêm thành viên vào task');
        setMemberQuery('');
        setAvailableUsers([]);
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi thêm thành viên', 'danger');
    } finally {
      setAssigningMember(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    if (!selectedTask) return;

    try {
      const res = await taskAssignmentService.removeAssignment(assignmentId);
      if (res.success) {
        await loadTaskAssignments(selectedTask.id);
        addToast('Đã xóa thành viên khỏi task');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi xóa thành viên', 'danger');
    }
  };

  // Check if current user can edit progress (must be assigned or PM/Admin)
  const canEditProgress = (taskId) => {
    if (permissions.isAdmin || permissions.isPM) return true;
    const assignments = taskAssignments[taskId] || [];
    return assignments.some(a => a.user_id === user.id);
  };

  const openDeleteConfirm = (id) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await taskService.remove(deleteTargetId);
      if (res.success) {
        await loadTasks(selectedProjectId);
        addToast('Đã xóa công việc', 'danger');
        if (editingId === deleteTargetId) {
          resetForm();
        }
        if (selectedTask && selectedTask.id === deleteTargetId) {
          closeDetailModal();
        }
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi xóa công việc', 'danger');
    } finally {
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  const loadComments = async (taskId) => {
    setLoadingComments(prev => ({ ...prev, [taskId]: true }));
    try {
      const res = await commentService.getTaskComments(taskId);
      if (res.success) {
        setTaskComments(prev => ({
          ...prev,
          [taskId]: res.data
        }));
        // Scroll to bottom after loading
        setTimeout(() => {
          const ref = commentsEndRefs.current[taskId];
          if (ref) {
            ref.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (err) {
      addToast('Không thể tải bình luận', 'danger');
    } finally {
      setLoadingComments(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const handleCommentChange = (taskId, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  const handleSendComment = async (e, taskId) => {
    e.preventDefault();
    const commentText = commentInputs[taskId]?.trim();
    if (!commentText) return;

    // Clear input
    setCommentInputs(prev => ({
      ...prev,
      [taskId]: ''
    }));

    try {
      if (socketRef.current && socketRef.current.connected) {
        // Send via socket for real-time
        socketRef.current.emit('new-comment', {
          task_id: taskId,
          comment: commentText
        });
      } else {
        // Fallback to API
        const res = await commentService.create(taskId, commentText);
        if (res.success) {
          setTaskComments(prev => {
            const existingComments = prev[taskId] || [];
            return {
              ...prev,
              [taskId]: [...existingComments, res.data]
            };
          });
          setTimeout(() => {
            const ref = commentsEndRefs.current[taskId];
            if (ref) {
              ref.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi gửi bình luận', 'danger');
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

  const selectedProject = projects.find(p => p.id === parseInt(selectedProjectId));
  const currentTaskComments = selectedTask ? taskComments[selectedTask.id] || [] : [];

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.name?.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.status?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="tasks-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <PageHeader
        icon="fa-tasks"
        title="QUẢN LÝ CÔNG VIỆC"
        subtitle="Xem và quản lý các công việc trong dự án của bạn."
        badge={selectedProject ? `${tasks.length} công việc` : ''}
        badgeIcon="fa-tasks"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm kiếm công việc..."
        actions={canCreate ? [
          {
            label: 'Tạo công việc',
            icon: 'fa-plus',
            className: 'primary',
            onClick: openCreateModal,
            disabled: !selectedProjectId
          }
        ] : []}
      />

      <div className="tasks-content">
        <div className="tasks-filters">
          <div className="filter-group">
            <label htmlFor="projectSelect">
              <i className="fas fa-folder"></i>
              Chọn dự án
            </label>
            <select
              id="projectSelect"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="project-select"
            >
              <option value="">-- Chọn dự án --</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {!selectedProjectId ? (
          <EmptyState
            icon="fa-folder-open"
            title="Chưa chọn dự án"
            description="Vui lòng chọn một dự án để xem và quản lý công việc."
          />
        ) : loading ? (
          <LoadingState message="Đang tải danh sách công việc..." />
        ) : (
          <div className="tasks-list modern">
            {filteredTasks.length === 0 && tasks.length > 0 ? (
              <EmptyState
                icon="fa-search"
                title="Không tìm thấy công việc"
                description={`Không có công việc nào khớp với từ khóa "${searchQuery}"`}
              />
            ) : (
              filteredTasks.map(task => (
                <div 
                  className="tasks-item card" 
                  key={task.id}
                  onClick={() => openDetailModal(task)}
                  style={{ cursor: 'pointer' }}
                >
  
                <div className="item-head">
                  <div className="item-title-wrapper">
                    <i className="fas fa-tasks item-icon"></i>
                    <div className="item-title">{task.name}</div>
                  </div>
                  {canEdit && (
                    <div className="item-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="text-btn"
                        onClick={() => openEditModal(task)}
                        title="Sửa"
                        type="button"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {canDelete && (
                        <button
                          className="text-btn danger"
                          onClick={() => openDeleteConfirm(task.id)}
                          title="Xóa"
                          type="button"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="item-meta">
                  <div className="status-row">
                    <StatusBadge status={task.status} statuses={statuses} />
                    <span className="progress-badge">
                      <i className="fas fa-chart-line"></i>
                      {task.progress}%
                    </span>
                  </div>
                  {task.due_date && (
                    <div className="date-row">
                      <span className="date-item end-date">
                        <i className="fas fa-calendar-check"></i>
                        <span className="date-text">
                          Hạn: {new Date(task.due_date).toLocaleDateString('vi-VN')}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
                {task.description && (
                  <div className="item-desc">
                    <i className="fas fa-file-alt desc-icon"></i>
                    {renderTextWithLinks(task.description)}
                  </div>
                )}
              </div>
              ))
            )}
            {tasks.length === 0 && (
              <EmptyState
                icon="fa-tasks"
                title="Chưa có công việc nào"
                description={canCreate ? "Tạo công việc mới để bắt đầu quản lý." : "Chưa có công việc nào trong dự án này."}
                actionLabel={canCreate ? "Tạo công việc đầu tiên" : undefined}
                onAction={canCreate ? openCreateModal : undefined}
              />
            )}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <ModalAdd
        isOpen={isDetailOpen}
        onClose={closeDetailModal}
        title={selectedTask?.name || 'Chi tiết công việc'}
        subtitle={selectedProject?.name || ''}
        icon="fa-tasks"
        size="large"
        actions={[
          {
            label: 'Đóng',
            icon: 'fa-times',
            className: 'secondary',
            onClick: closeDetailModal
          }
        ]}
      >
        {selectedTask && (
          <div className="task-detail-content">
            {/* Task Info Section */}
            <div className="task-detail-section">
              <h4>
                <i className="fas fa-info-circle"></i>
                Thông tin công việc
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Mô tả:</span>
                  <span className="detail-value">
                    {selectedTask.description ? renderTextWithLinks(selectedTask.description) : 'Không có mô tả'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Trạng thái:</span>
                  <div className="detail-value">
                    {canEditProgress(selectedTask.id) || permissions.isPM || permissions.isAdmin ? (
                      <select
                        className="status-dropdown"
                        value={selectedTask.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            const res = await taskService.updateStatus(selectedTask.id, newStatus);
                            if (res.success) {
                              setSelectedTask(prev => ({ ...prev, status: newStatus }));
                              await loadTasks(selectedProjectId);
                              addToast('Đã cập nhật trạng thái');
                            }
                          } catch (err) {
                            addToast(err?.response?.data?.message || 'Lỗi khi cập nhật trạng thái', 'danger');
                          }
                        }}
                      >
                        {statuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge status={selectedTask.status} statuses={statuses} />
                    )}
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tiến độ:</span>
                  <div className="detail-value">
                    <div className="progress-control">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedTask.progress || 0}
                        onChange={(e) => {
                          const newProgress = parseInt(e.target.value);
                          setSelectedTask(prev => ({ ...prev, progress: newProgress }));
                        }}
                        onMouseUp={(e) => {
                          const newProgress = parseInt(e.target.value);
                          handleUpdateProgress(selectedTask.id, newProgress);
                        }}
                        disabled={!canEditProgress(selectedTask.id) || updatingProgress}
                        className="progress-slider"
                      />
                      <span className="progress-value">{selectedTask.progress || 0}%</span>
                    </div>
                    {!canEditProgress(selectedTask.id) && (
                      <div className="progress-hint">
                        <i className="fas fa-info-circle"></i>
                        Chỉ thành viên được giao task mới có thể chỉnh sửa tiến độ
                      </div>
                    )}
                  </div>
                </div>
                {selectedTask.due_date && (
                  <div className="detail-item">
                    <span className="detail-label">Hạn hoàn thành:</span>
                    <span className="detail-value">
                      {formatDateForDisplay(selectedTask.due_date)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Members Section */}
            <div className="task-detail-section">
              <div className="section-header-with-action">
                <h4>
                  <i className="fas fa-users"></i>
                  Thành viên được giao ({taskAssignments[selectedTask.id]?.length || 0})
                </h4>
                {(permissions.isPM || permissions.isAdmin || permissions.isTL) && (
                  <button
                    className="add-member-btn"
                    onClick={handleOpenMemberModal}
                    title="Thêm thành viên"
                  >
                    <i className="fas fa-plus"></i>
                    Thêm thành viên
                  </button>
                )}
              </div>
              <div className="task-members-list">
                {taskAssignments[selectedTask.id]?.length > 0 ? (
                  taskAssignments[selectedTask.id].map(assignment => (
                    <div key={assignment.id} className="task-member-item">
                      <div className="member-info">
                        <div className="member-avatar-small">
                          {assignment.avatar ? (
                            <img src={getAvatarUrl(assignment.avatar)} alt={assignment.username} />
                          ) : (
                            <span>{getLastName(assignment.username || 'U').charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <span className="member-name">{assignment.username}</span>
                        {assignment.user_id === user.id && (
                          <span className="member-badge">Bạn</span>
                        )}
                      </div>
                      {(permissions.isPM || permissions.isAdmin || permissions.isTL) && (
                        <button
                          className="remove-member-btn"
                          onClick={() => handleRemoveAssignment(assignment.id)}
                          title="Xóa thành viên"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-members">
                    <i className="fas fa-user-slash"></i>
                    <span>Chưa có thành viên nào được giao task này</span>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="task-detail-section">
              <h4>
                <i className="fas fa-comments"></i>
                Bình luận ({currentTaskComments.length})
              </h4>
              <div className="comments-container-detail">
                <div className="comments-list-detail">
                  {loadingComments[selectedTask.id] ? (
                    <div className="comments-loading">
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Đang tải bình luận...</span>
                    </div>
                  ) : currentTaskComments.length > 0 ? (
                    currentTaskComments.map(comment => (
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
                          <div className="comment-text-detail">{renderTextWithLinks(comment.comment)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="comments-empty">
                      <i className="fas fa-comment-slash"></i>
                      <span>Chưa có bình luận nào</span>
                    </div>
                  )}
                  <div ref={el => commentsEndRefs.current[selectedTask.id] = el}></div>
                </div>

                <form
                  className="comment-form-detail"
                  onSubmit={(e) => handleSendComment(e, selectedTask.id)}
                >
                  <input
                    ref={detailCommentInputRef}
                    type="text"
                    className="comment-input-detail"
                    placeholder="Nhập bình luận..."
                    value={commentInputs[selectedTask.id] || ''}
                    onChange={(e) => handleCommentChange(selectedTask.id, e.target.value)}
                  />
                  <button
                    type="submit"
                    className="comment-send-btn-detail"
                    disabled={!commentInputs[selectedTask.id]?.trim()}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </ModalAdd>

      {/* Add Member Modal */}
      <ModalAdd
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          setMemberQuery('');
          setAvailableUsers([]);
        }}
        title="Thêm thành viên"
        subtitle="Tìm kiếm và thêm thành viên vào task"
        icon="fa-user-plus"
        size="medium"
        actions={[
          {
            label: 'Đóng',
            icon: 'fa-times',
            className: 'secondary',
            onClick: () => {
              setIsMemberModalOpen(false);
              setMemberQuery('');
              setAvailableUsers([]);
            }
          }
        ]}
      >
        <div className="add-member-content">
          <div className="member-search">
            <input
              type="text"
              className="member-search-input"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={memberQuery}
              onChange={(e) => handleSearchMembers(e.target.value)}
            />
            {loadingMembers && (
              <div className="search-loading">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            )}
          </div>
          <div className="available-members-list">
            {availableUsers.length > 0 ? (
              availableUsers.map(user => (
                <div key={user.id} className="available-member-item">
                  <div className="member-info">
                    <div className="member-avatar-small">
                      {user.avatar ? (
                        <img src={getAvatarUrl(user.avatar)} alt={user.username} />
                      ) : (
                        <span>{getLastName(user.username || 'U').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="member-details">
                      <span className="member-name">{user.username}</span>
                      <span className="member-email">{user.email}</span>
                    </div>
                  </div>
                  <button
                    className="assign-member-btn"
                    onClick={() => handleAssignMember(user.id)}
                    disabled={assigningMember}
                  >
                    <i className={`fas ${assigningMember ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
                    Thêm
                  </button>
                </div>
              ))
            ) : memberQuery.trim() ? (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <span>Không tìm thấy thành viên nào</span>
              </div>
            ) : (
              <div className="search-hint">
                <i className="fas fa-info-circle"></i>
                <span>Nhập tên hoặc email để tìm kiếm thành viên</span>
              </div>
            )}
          </div>
        </div>
      </ModalAdd>

      {/* Create/Edit Modal */}
      <ModalAdd
        isOpen={isFormOpen}
        onClose={closeFormOnly}
        title={editingId ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
        subtitle={editingId ? 'Cập nhật thông tin công việc' : 'Thêm công việc mới vào dự án'}
        icon={editingId ? 'fa-edit' : 'fa-plus-circle'}
        actions={[
          {
            label: 'Hủy',
            icon: 'fa-times',
            className: 'secondary',
            onClick: closeFormOnly
          },
          {
            label: editingId ? 'Lưu' : 'Tạo',
            icon: editingId ? 'fa-save' : 'fa-plus',
            className: 'primary',
            onClick: () => {
              const form = document.getElementById('task-form');
              if (form) {
                form.requestSubmit();
              }
            }
          }
        ]}
      >
        <form id="task-form" className="project-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="taskName">
              <i className="fas fa-tag"></i>
              Tên công việc <span className="required">*</span>
            </label>
            <input
              id="taskName"
              type="text"
              placeholder="Nhập tên công việc"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <div className="hint">
              <i className="fas fa-info-circle"></i>
              Tên công việc nên ngắn gọn và mô tả rõ ràng.
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="taskStatus">
              <i className="fas fa-tasks"></i>
              Trạng thái
            </label>
            <select
              id="taskStatus"
              value={form.status}
              onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row dates-row">
            <div className="date-field">
              <label htmlFor="taskProgress">
                <i className="fas fa-chart-line"></i>
                Tiến độ (%)
              </label>
              <input
                id="taskProgress"
                type="number"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) => setForm(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="date-field">
              <label htmlFor="taskDueDate">
                <i className="fas fa-calendar-check"></i>
                Hạn hoàn thành
              </label>
              <input
                id="taskDueDate"
                type="date"
                value={form.due_date}
                onChange={(e) => setForm(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="taskDesc">
              <i className="fas fa-align-left"></i>
              Mô tả
            </label>
            <div className="rich-text-editor">
              <textarea
                id="taskDesc"
                className="editor-textarea"
                rows={6}
                placeholder="Hãy thêm mô tả về công việc..."
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <button type="submit" style={{ display: 'none' }} form="task-form"></button>
        </form>
      </ModalAdd>

      {/* Delete Confirmation Modal */}
      <ModalAdd
        isOpen={isDeleteOpen}
        onClose={cancelDelete}
        title="Xác nhận xóa"
        subtitle="Hành động này không thể hoàn tác"
        icon="fa-exclamation-triangle"
        iconType="danger"
        size="small"
        actions={[
          {
            label: 'Hủy',
            icon: 'fa-times',
            className: 'secondary',
            onClick: cancelDelete
          },
          {
            label: 'Xóa công việc',
            icon: 'fa-trash',
            className: 'primary danger-fill',
            onClick: confirmDelete
          }
        ]}
      >
        <div className="confirm-body">
          <i className="fas fa-info-circle confirm-icon"></i>
          <p>Bạn có chắc muốn xóa công việc này? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.</p>
        </div>
      </ModalAdd>
    </div>
  );
};

export default Tasks;
