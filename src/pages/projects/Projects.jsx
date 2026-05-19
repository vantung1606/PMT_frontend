import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';
import './Projects.css';
import projectService from '../../services/projectService';
import memberService from '../../services/memberService';
import StatusBadge from '../../components/statusBadge/StatusBadge';
import { formatDateForInput } from '../../utils/dateHelper';
import { getLastName } from '../../utils/nameHelper';
import ModalAdd from '../../components/modal/ModalAdd';

const emptyForm = {
  name: '',
  description: '',
  status: 'Not Started',
  start_date: '',
  end_date: '',
  members: [],
};

const Projects = () => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  // Danh sách dự án (fetch từ backend)
  const [projects, setProjects] = useState([]);
  
  // Danh sách status từ backend
  const [statuses, setStatuses] = useState([]);

  // Trạng thái form
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [memberQuery, setMemberQuery] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);


  const addToast = (message, type = 'success') => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMemberQuery('');
    setIsFormOpen(false);
  };

  const closeFormOnly = () => {
    setIsFormOpen(false); 
  };

  useEffect(() => {
    const searchMembers = async () => {
      if (!memberQuery.trim()) {
        setFilteredUsers([]);
        return;
      }
      
      try {
        const res = await memberService.searchEmails(memberQuery.trim(), 6);
        if (res.success && res.data) {
          const existingIds = form.members.map(m => m.user_id || m.member_id);
          const available = res.data.filter(m => !existingIds.includes(m.id));
          setFilteredUsers(available);
        } else {
          setFilteredUsers([]);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error searching members by email:', err);
        }
        setFilteredUsers([]);
        if (err?.response?.status === 403) {
          addToast('Bạn không có quyền tìm kiếm email', 'danger');
        }
      }
    };
    
    const timeoutId = setTimeout(searchMembers, 300); 
    return () => clearTimeout(timeoutId);
  }, [memberQuery, form.members]);

  const handleAddMember = (memberToAdd) => {
    setForm(prev => ({ 
      ...prev, 
      members: [...prev.members, { 
        user_id: memberToAdd.id, 
        username: memberToAdd.name || memberToAdd.username, 
        email: memberToAdd.email 
      }] 
    }));
    setMemberQuery('');
    setFilteredUsers([]);
    addToast(`Đã thêm thành viên ${memberToAdd.name || memberToAdd.username}`);
  };

  const handleRemoveMember = (userId) => {
    setForm(prev => ({ ...prev, members: prev.members.filter(m => m.user_id !== userId) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await projectService.update(editingId, {
          name: form.name,
          description: form.description,
          status: form.status,
          start_date: form.start_date,
          end_date: form.end_date,
          members: form.members.map(m => ({ user_id: m.user_id, role: m.role || 'mb' }))
        });
        if (res.success) {
          const updated = res.data;
          setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
          addToast('Đã lưu chỉnh sửa dự án');
        }
      } else {
        const res = await projectService.create({
          name: form.name,
          description: form.description,
          status: form.status,
          start_date: form.start_date,
          end_date: form.end_date,
          members: form.members.map(m => ({ user_id: m.user_id, role: m.role || 'mb' }))
        });
        if (res.success) {
          const newProject = res.data;
          setProjects(prev => [newProject, ...prev]);
          addToast('Đã tạo dự án mới');
        }
      }
      resetForm();
    } catch (err) {
      addToast(err?.response?.data?.message || err.message || 'Lỗi khi lưu dự án', 'danger');
    }
  };

  const handleEdit = async (project) => {
    try {
      const res = await projectService.get(project.id);
      if (res.success) {
        const fullProject = res.data;
        setEditingId(fullProject.id);
        setForm({
          name: fullProject.name,
          description: fullProject.description || '',
          status: fullProject.status || 'Not Started',
          start_date: formatDateForInput(fullProject.start_date),
          end_date: formatDateForInput(fullProject.end_date),
          members: fullProject.members || [],
        });
        setIsFormOpen(true);
      } else {
        addToast('Không thể tải thông tin dự án', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || err.message || 'Lỗi khi tải thông tin dự án', 'danger');
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openDeleteConfirm = (id) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await projectService.remove(deleteTargetId);
      if (res.success) {
        setProjects(prev => prev.filter(p => p.id !== deleteTargetId));
        if (editingId === deleteTargetId) {
          resetForm();
        }
        addToast('Đã xóa dự án', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || err.message || 'Lỗi khi xóa dự án', 'danger');
    } finally {
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  const openDetailModal = async (project) => {
    try {
      const res = await projectService.get(project.id);
      if (res.success) {
        setSelectedProject(res.data);
        setIsDetailOpen(true);
      } else {
        addToast('Không thể tải thông tin dự án', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi tải thông tin dự án', 'danger');
    }
  };

  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setSelectedProject(null);
  };


  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, statusesRes] = await Promise.all([
          projectService.list(),
          projectService.getStatuses()
        ]);
        
        if (projectsRes.success) {
          setProjects(projectsRes.data);
        } else {
          addToast('Không thể tải danh sách dự án', 'danger');
        }
        
        if (statusesRes.success && statusesRes.data && Array.isArray(statusesRes.data)) {
          setStatuses(statusesRes.data);
          if (process.env.NODE_ENV === 'development') {
            console.log('Loaded statuses:', statusesRes.data);
            console.log('Statuses count:', statusesRes.data.length);
            console.log('First status:', statusesRes.data[0]);
          }
        } else {
          console.error('Failed to load statuses - Response:', statusesRes);
          console.error('statusesRes.success:', statusesRes?.success);
          console.error('statusesRes.data:', statusesRes?.data);
          console.error('Is array:', Array.isArray(statusesRes?.data));
          addToast('Không thể tải danh sách trạng thái', 'danger');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        addToast('Không thể tải dữ liệu', 'danger');
      }
    };
    load();
  }, []);

  return (
    <div className="projects-page">
      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>
              {t.message}
            </div>
          ))}
        </div>
      )}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <i className="fas fa-folder-open"></i>
          </div>
          <div>
            <h1>DỰ ÁN</h1>
            <p className="subtitle">Tạo và quản lý dự án của bạn một cách trực quan.</p>
          </div>
        </div>
        {permissions.canCreateProject && (
          <div className="header-actions">
            <span className="badge-prj">
              <i className="fas fa-project-diagram"></i>
              {projects.length} dự án
            </span>
            <button 
              className="secondary" 
              onClick={() => navigate('/ai-chat')} 
              type="button"
              style={{ marginRight: '8px' }}
            >
              <i className="fas fa-robot"></i>
              Gợi ý AI
            </button>
            <button className="primary" onClick={openCreateModal} type="button">
              <i className="fas fa-plus"></i>
              Tạo dự án
            </button>
          </div>
        )}
      </div>
      {permissions.canCreateProject ? (
        <div className="project-manage">
          <ModalAdd
            isOpen={isFormOpen}
            onClose={closeFormOnly}
            title={editingId ? 'CHỈNH SỬA DỰ ÁN' : 'TẠO DỰ ÁN'}
            subtitle={editingId ? 'Cập nhật thông tin dự án của bạn' : 'Thêm dự án mới vào hệ thống'}
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
                  const form = document.getElementById('project-form');
                  if (form) {
                    form.requestSubmit();
                  }
                }
              }
            ]}
          >
            <form id="project-form" className="project-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="projectName">
                <i className="fas fa-tag"></i>
                Tên dự án
              </label>
              <input
                id="projectName"
                type="text"
                placeholder="Nhập tên dự án"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              />
              <div className="hint">
                <i className="fas fa-info-circle"></i>
                Tên nên ngắn gọn, mô tả đúng mục tiêu.
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="projectStatus">
                <i className="fas fa-tasks"></i>
                Trạng thái dự án
              </label>
              <select
                id="projectStatus"
                value={form.status}
                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                disabled={!statuses || statuses.length === 0}
              >
                {statuses && statuses.length > 0 ? (
                  statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label || status.value}
                    </option>
                  ))
                ) : (
                  <option value="">Đang tải trạng thái...</option>
                )}
              </select>
              <div className="hint">
                <i className="fas fa-info-circle"></i>
                Chọn trạng thái hiện tại của dự án.
              </div>
            </div>

            <div className="form-row dates-row">
              <div className="date-field">
                <label htmlFor="projectStartDate">
                  <i className="fas fa-calendar-plus"></i>
                  Ngày bắt đầu
                </label>
                <input
                  id="projectStartDate"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm(prev => ({ ...prev, start_date: e.target.value }))}
                />
                <div className="hint">
                  <i className="fas fa-info-circle"></i>
                  Chọn ngày bắt đầu dự án.
                </div>
              </div>
              <div className="date-field">
                <label htmlFor="projectEndDate">
                  <i className="fas fa-calendar-check"></i>
                  Ngày kết thúc
                </label>
                <input
                  id="projectEndDate"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm(prev => ({ ...prev, end_date: e.target.value }))}
                />
                <div className="hint">
                  <i className="fas fa-info-circle"></i>
                  Chọn ngày dự kiến hoàn thành dự án.
                </div>
              </div>
            </div>

            <div className="form-row">
              <label>
                <i className="fas fa-users"></i>
                Thêm thành viên
              </label>
              <div className="member-select">
                <div className="search-input-wrapper">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    placeholder="Nhập email để tìm kiếm (ví dụ: mem...)"
                    value={memberQuery}
                    onChange={(e) => setMemberQuery(e.target.value)}
                    onFocus={() => {
                      // Trigger search if there's a query
                      if (memberQuery.trim()) {
                        // Search will be triggered by useEffect
                      }
                    }}
                    onBlur={(e) => {
                      // Delay to allow click on dropdown item
                      // Check if click target is inside dropdown
                      setTimeout(() => {
                        const activeElement = document.activeElement;
                        if (!activeElement || !activeElement.closest('.dropdown')) {
                          setFilteredUsers([]);
                        }
                      }, 200);
                    }}
                  />
                </div>
                {memberQuery.trim() && filteredUsers.length > 0 && (
                  <div className="dropdown show">
                    {filteredUsers.map(u => (
                      <div 
                        key={u.id} 
                        className="option" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddMember(u);
                        }}
                        onMouseDown={(e) => {
                          // Prevent input blur when clicking dropdown item
                          e.preventDefault();
                        }}
                      >
                        <div className="option-icon">
                          <i className="fas fa-user"></i>
                        </div>
                        <div className="option-info">
                          <div className="option-name">{u.name || u.username}</div>
                          <div className="option-email">{u.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {memberQuery.trim() && filteredUsers.length === 0 && (
                  <div className="dropdown show">
                    <div className="option no-results">
                      <div className="option-info">
                        <div className="option-email" style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                          Không tìm thấy kết quả
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {form.members.length > 0 && (
                  <div className="chips">
                    {form.members.map(m => {
                      const lastName = getLastName(m.username);
                      return (
                        <div className="chip" key={m.user_id}>
                          <div className="chip-icon">
                            <i className="fas fa-user"></i>
                          </div>
                          <span className="chip-text">{lastName}</span>
                          <button type="button" className="chip-remove" onClick={() => handleRemoveMember(m.user_id)}>×</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>


            <div className="form-row">
              <label htmlFor="projectDesc">
                <i className="fas fa-align-left"></i>
                Mô tả
              </label>
              <div className="rich-text-editor">
                <textarea
                  id="projectDesc"
                  className="editor-textarea"
                  rows={6}
                  placeholder="Hãy thêm mô tả về dự án..."
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

              <button type="submit" style={{ display: 'none' }} form="project-form"></button>
            </form>
          </ModalAdd>

          <div className="projects-list modern">
            {projects.map(p => (
              <div 
                className="projects-item card" 
                key={p.id}
                onClick={() => openDetailModal(p)}
                style={{ cursor: 'pointer' }}
              >
                <div className="item-head">
                  <div className="item-title-wrapper">
                    <i className="fas fa-folder item-icon"></i>
                    <div className="item-title">{p.name}</div>
                  </div>
                  {permissions.canEditProject && (
                    <div className="item-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="text-btn" onClick={() => handleEdit(p)} title="Sửa">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-btn danger" onClick={() => openDeleteConfirm(p.id)} title="Xóa">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
                <div className="item-meta">
                  <div className="status-row">
                    <StatusBadge status={p.status} statuses={statuses} />
                  </div>
                  <div className="date-row">
                    <span className="date-item start-date">
                      <i className="fas fa-calendar-plus"></i>
                      <span className="date-text">Bắt đầu: {new Date(p.created_at).toLocaleDateString('vi-VN')}</span>
                    </span>
                    {p.end_date && (
                      <span className="date-item end-date">
                        <i className="fas fa-calendar-check"></i>
                        <span className="date-text">Kết thúc: {new Date(p.end_date).toLocaleDateString('vi-VN')}</span>
                      </span>
                    )}
                  </div>
                </div>
                {p.description && (
                  <div className="item-desc">
                    <i className="fas fa-file-alt desc-icon"></i>
                    {p.description}
                  </div>
                )}
              </div>
            ))}
            {projects.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon-wrapper">
                  <i className="fas fa-folder-open empty-icon"></i>
                </div>
                <div className="empty-title">Chưa có dự án nào</div>
                <div className="empty-desc">Tạo dự án mới để bắt đầu quản lý công việc.</div>
                {permissions.canCreateProject && (
                  <button className="empty-action-btn" onClick={openCreateModal}>
                    <i className="fas fa-plus"></i>
                    Tạo dự án đầu tiên
                  </button>
                )}
              </div>
            )}
          </div>
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
                label: 'Xóa dự án',
                icon: 'fa-trash',
                className: 'primary danger-fill',
                onClick: confirmDelete
              }
            ]}
          >
            <div className="confirm-body">
              <i className="fas fa-info-circle confirm-icon"></i>
              <p>Bạn có chắc muốn xóa dự án này? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.</p>
            </div>
          </ModalAdd>
        </div>
      ) : (
        <div className="projects-list modern">
          {projects.map(p => (
            <div 
              className="projects-item card" 
              key={p.id}
              onClick={() => openDetailModal(p)}
              style={{ cursor: 'pointer' }}
            >
              <div className="item-head">
                <div className="item-title-wrapper">
                  <i className="fas fa-folder item-icon"></i>
                  <div className="item-title">{p.name}</div>
                </div>
              </div>
              <div className="item-meta">
                <div className="status-row">
                  <StatusBadge status={p.status} statuses={statuses} />
                </div>
                <div className="date-row">
                  <span className="date-item start-date">
                    <i className="fas fa-calendar-plus"></i>
                    <span className="date-text">{new Date(p.created_at).toLocaleDateString('vi-VN')}</span>
                  </span>
                  {p.end_date && (
                    <span className="date-item end-date">
                      <i className="fas fa-calendar-check"></i>
                      <span className="date-text">{new Date(p.end_date).toLocaleDateString('vi-VN')}</span>
                    </span>
                  )}
                </div>
              </div>
              {p.description && (
                <div className="item-desc">
                  <i className="fas fa-file-alt desc-icon"></i>
                  {p.description}
                </div>
              )}
            </div>
          ))}
          {projects.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <i className="fas fa-folder-open empty-icon"></i>
              </div>
              <div className="empty-title">Chưa có dự án nào</div>
              <div className="empty-desc">Bạn chưa được tham gia vào dự án nào.</div>
            </div>
          )}
        </div>
      )}

      {/* Project Detail Modal */}
      <ModalAdd
        isOpen={isDetailOpen}
        onClose={closeDetailModal}
        title={selectedProject?.name || 'Chi tiết dự án'}
        subtitle="Thông tin chi tiết về dự án"
        icon="fa-folder-open"
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
        {selectedProject && (
          <div className="project-detail-content">
            <div className="project-detail-section">
              <h4>
                <i className="fas fa-info-circle"></i>
                Thông tin dự án
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Mô tả:</span>
                  <span className="detail-value">
                    {selectedProject.description || 'Không có mô tả'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Trạng thái:</span>
                  <div className="detail-value">
                    <StatusBadge status={selectedProject.status} statuses={statuses} />
                  </div>
                </div>
                {selectedProject.start_date && (
                  <div className="detail-item">
                    <span className="detail-label">Ngày bắt đầu:</span>
                    <span className="detail-value">
                      {new Date(selectedProject.start_date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
                {selectedProject.end_date && (
                  <div className="detail-item">
                    <span className="detail-label">Ngày kết thúc:</span>
                    <span className="detail-value">
                      {new Date(selectedProject.end_date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {selectedProject.members && selectedProject.members.length > 0 && (
              <div className="project-detail-section">
                <h4>
                  <i className="fas fa-users"></i>
                  Thành viên dự án ({selectedProject.members.length})
                </h4>
                <div className="project-members-list">
                  {selectedProject.members.map(member => (
                    <div key={member.id} className="project-member-item">
                      <div className="member-info">
                        <div className="member-avatar-small">
                          <span>{getLastName(member.username || 'U').charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="member-details">
                          <span className="member-name">{member.username}</span>
                          <span className="member-email">{member.email}</span>
                        </div>
                      </div>
                      <span className={`member-role-badge role-${member.role}`}>
                        {member.role === 'pm' ? 'PM' : member.role === 'tl' ? 'TL' : 'MB'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ModalAdd>
    </div>
  );
};

export default Projects;


