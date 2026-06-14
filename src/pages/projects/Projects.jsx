import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';
import { useAuth } from '../../contexts/AuthContext';
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
  const { user } = useAuth();

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
  const [activeMenuId, setActiveMenuId] = useState(null);


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
    setForm(prev => ({ ...prev, members: prev.members.filter(m => (m.user_id || m.id) !== userId) }));
  };

  const handleUpdateMemberRole = (userId, newRole) => {
    setForm(prev => ({
      ...prev,
      members: prev.members.map(m => (m.user_id || m.id) === userId ? { ...m, role: newRole } : m)
    }));
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
          members: form.members.map(m => ({ user_id: m.user_id || m.id, role: m.role || 'mb' }))
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
          members: form.members.map(m => ({ user_id: m.user_id || m.id, role: m.role || 'mb' }))
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
      {/* HEADER SECTION */}
      <div className="top-nav-bar">
        <div className="nav-left">
          <div className="nav-icon-box">
            <i className="fas fa-folder"></i>
          </div>
          <span className="nav-title">DỰ ÁN</span>
          <div className="nav-tabs">
            <span className="nav-tab active">Dashboard</span>
            <span className="nav-tab">Overview</span>
          </div>
        </div>
        {permissions.canCreateProject && (
          <div className="nav-right">
            <button className="btn-ai" onClick={() => navigate('/ai-chat')}>
              <i className="fas fa-robot"></i> Gợi ý AI
            </button>
            <button className="btn-create" onClick={openCreateModal}>
              <i className="fas fa-plus"></i> Tạo dự án
            </button>
            {user?.role === 'admin' && (
              <button className="btn-ai" onClick={() => navigate('/admin')}>
                <i className="fas fa-cog"></i> Admin
              </button>
            )}
            <div className="nav-user-actions">
              <i className="far fa-bell"></i>
              <i className="fas fa-cog"></i>
              <div className="nav-avatar">AD</div>
            </div>
          </div>
        )}
      </div>

      {/* WELCOME BANNER SECTION */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Chào mừng trở lại, {user?.username || 'Admin'}</h1>
          <p>Tạo và quản lý dự án của bạn một cách trực quan.</p>
        </div>
        <div className="welcome-stats">
          <div className="stat-card">
            <div className="stat-icon red-bg">
              <i className="fas fa-project-diagram"></i>
            </div>
            <div className="stat-info">
              <h3>{projects.length < 10 ? `0${projects.length}` : projects.length}</h3>
              <p>Tổng dự án</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow-bg">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div className="stat-info">
              <h3>04</h3>
              <p>Đang chờ</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS SECTION */}
      <div className="controls-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm dự án..." />
        </div>
        <div className="view-toggles">
          <button className="view-btn active"><i className="fas fa-th-large"></i></button>
          <button className="view-btn"><i className="fas fa-list"></i></button>
        </div>
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
                className: 'outline',
                onClick: closeFormOnly
              },
              {
                label: editingId ? 'Lưu' : 'Tạo',
                icon: editingId ? 'fa-save' : 'fa-plus-circle',
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
                <i className="fas fa-list-ul"></i>
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
                  <i className="far fa-calendar-alt"></i>
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
                  <i className="far fa-calendar-check"></i>
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
                <i className="fas fa-user-plus"></i>
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
                        <div className="chip" key={m.user_id || m.id}>
                          <div className="chip-icon">
                            <i className="fas fa-user"></i>
                          </div>
                          <span className="chip-text">{lastName}</span>
                          <button type="button" className="chip-remove" onClick={() => handleRemoveMember(m.user_id || m.id)}>×</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>


            <div className="form-row">
              <label htmlFor="projectDesc">
                <i className="far fa-file-alt"></i>
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

          <div className="projects-grid-layout">
            {projects.map(p => (
              <div 
                className="project-card" 
                key={p.id}
                onClick={() => openDetailModal(p)}
              >
                <div className="card-top">
                  <div className="card-icon"><i className="fas fa-folder"></i></div>
                  <div className="card-title-group">
                    <h4>{p.name}</h4>
                    <p>{p.description || 'Infrastructure Redesign'}</p>
                  </div>
                  <div className="card-menu" style={{ position: 'relative' }} onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === p.id ? null : p.id);
                  }}>
                    <i className="fas fa-ellipsis-v"></i>
                    {activeMenuId === p.id && permissions.canCreateProject && (
                      <div className="card-dropdown-menu" style={{ position: 'absolute', right: 0, top: '24px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 10 }}>
                        <div style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '14px' }} onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); handleEdit(p); }}>
                          <i className="fas fa-edit" style={{ marginRight: '8px', color: '#007bff' }}></i> Chỉnh sửa
                        </div>
                        <div style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '14px', color: 'red' }} onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); openDeleteConfirm(p.id); }}>
                          <i className="fas fa-trash" style={{ marginRight: '8px' }}></i> Xóa
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Using a mockup badge style since real status codes might differ */}
                <div className="card-badge yellow-badge">
                  CHƯA BẮT ĐẦU
                </div>

                {/* Mockup Progress or Date Box */}
                {p.id % 2 === 0 ? (
                  <div className="card-progress">
                    <div className="progress-info">
                      <span>ĐANG THỰC HIỆN</span>
                      <span>65%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '65%'}}></div>
                    </div>
                  </div>
                ) : (
                  <div className="card-date-box">
                    <i className="far fa-calendar-alt"></i>
                    <div className="date-text">
                      <span>Bắt đầu</span>
                      <strong>{new Date(p.created_at).toLocaleDateString('vi-VN')}</strong>
                    </div>
                  </div>
                )}

                <div className="card-bottom">
                  <div className="avatar-group">
                    <div className="avatar-img">A</div>
                    <div className="avatar-img">B</div>
                    <div className="avatar-more">+3</div>
                  </div>
                  <div className="card-stats">
                    <span><i className="far fa-comment-dots"></i> 12</span>
                    <span><i className="fas fa-paperclip"></i> 8/16</span>
                  </div>
                </div>
              </div>
            ))}

            {permissions.canCreateProject && (
              <div className="project-card add-new-card" onClick={openCreateModal}>
                <div className="add-icon-circle">
                  <i className="fas fa-plus"></i>
                </div>
                <h4>Thêm dự án mới</h4>
                <p>Bắt đầu lập kế hoạch cho mục tiêu tiếp theo của bạn.</p>
              </div>
            )}
          </div>
          
          {/* BOTTOM DASHBOARD PANELS */}
          <div className="bottom-dashboard">
            <div className="panel chart-panel">
              <div className="panel-header">
                <h3>Hiệu suất dự án</h3>
                <div className="chart-legend">
                  <span><i className="fas fa-circle text-red"></i> Hoàn thành</span>
                  <span><i className="fas fa-circle text-grey"></i> Mục tiêu</span>
                </div>
              </div>
              <div className="chart-mockup">
                {/* Empty space for chart */}
                <div className="chart-x-axis">
                  <span>Thứ 2</span>
                  <span>Thứ 3</span>
                  <span>Thứ 4</span>
                  <span>Thứ 5</span>
                  <span>Thứ 6</span>
                  <span>Thứ 7</span>
                </div>
              </div>
            </div>
            
            <div className="panel activity-panel">
              <h3>Hoạt động gần đây</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-avatar">F</div>
                  <div className="activity-content">
                    <p><strong>Felix</strong> đã chỉnh sửa dự án <strong>B1</strong></p>
                    <span>10 phút trước</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-avatar bg-green">A</div>
                  <div className="activity-content">
                    <p><strong>Anna</strong> đã hoàn thành task <em>"Nghiên cứu thị trường"</em></p>
                    <span>2 giờ trước</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-avatar bg-blue"><i className="fas fa-robot"></i></div>
                  <div className="activity-content">
                    <p><strong>Trợ lý AI</strong> đã gửi báo cáo tiến độ tuần</p>
                    <span>Hôm qua</span>
                  </div>
                </div>
              </div>
              <button className="view-all-btn">Xem tất cả hoạt động</button>
            </div>
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
          },
          ...(permissions.canCreateProject ? [
            {
              label: 'Xóa',
              icon: 'fa-trash',
              className: 'outline',
              onClick: () => {
                closeDetailModal();
                openDeleteConfirm(selectedProject.id);
              }
            },
            {
              label: 'Chỉnh sửa',
              icon: 'fa-edit',
              className: 'primary',
              onClick: () => {
                closeDetailModal();
                handleEdit(selectedProject);
              }
            }
          ] : [])
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


