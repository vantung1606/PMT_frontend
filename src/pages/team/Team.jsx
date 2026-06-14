import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import usePermissions from '../../hooks/usePermissions';
import memberService from '../../services/memberService';
import userService from '../../services/userService';
import projectService from '../../services/projectService';
import workspaceService from '../../services/workspaceService';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import ModalAdd from '../../components/modal/ModalAdd';
import EmptyState from '../../components/emptyState/EmptyState';
import { formatDateForDisplay, formatDateForInput } from '../../utils/dateHelper';
import { getLastName } from '../../utils/nameHelper';
import './Team.css';

const emptyMember = {
  name: '',
  email: '',
  date_of_birth: '',
  occupation: ''
};

const Team = () => {
  const { user } = useAuth();
  const permissions = usePermissions();
  const { currentWorkspace } = useWorkspace();
  // Sử dụng canManageMembers trong workspace, canManageUsers ở global scope
  const canManage = permissions.canManageMembers || permissions.canManageUsers;
  const canDelete = permissions.canDelete || permissions.canDeleteUsers;

  const [members, setMembers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [form, setForm] = useState(emptyMember);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [filterProjectId, setFilterProjectId] = useState('');

  const addToast = (message, type = 'success') => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500);
  };

  const resetForm = () => {
    setForm(emptyMember);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const closeFormOnly = () => {
    setIsFormOpen(false);
  };

  // Load members từ API - Backend đã xử lý toàn bộ logic nghiệp vụ
  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await memberService.list();
      if (res.success) {
        setMembers(res.data);
      } else {
        addToast('Không thể tải danh sách thành viên', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || err.message || 'Lỗi khi tải danh sách thành viên', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await projectService.getMyProjects();
        if (res.success) {
          setProjects(res.data);
        }
      } catch (err) {}
    };

    if (canManage || permissions.canViewTeam) {
      loadMembers();
      loadProjects();
    }
  }, [canManage, permissions.canViewTeam]);

  const handleUpdateRole = async (userId, newRole) => {
    if (!currentWorkspace?.id || !userId) return;
    try {
      const res = await workspaceService.updateMemberRole(currentWorkspace.id, userId, { role: newRole });
      if (res.success) {
        addToast('Đã cập nhật vai trò thành công', 'success');
        loadMembers(); // Reload to reflect changes
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi cập nhật vai trò', 'danger');
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyMember);
    setIsFormOpen(true);
  };

  const openEdit = async (member) => {
    try {
      const res = await memberService.get(member.id);
      if (res.success) {
        setEditingId(member.id);
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          date_of_birth: formatDateForInput(res.data.date_of_birth) || '',
          occupation: res.data.occupation || ''
        });
        setIsFormOpen(true);
      } else {
        addToast('Không thể tải thông tin thành viên', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || err.message || 'Lỗi khi tải thông tin thành viên', 'danger');
    }
  };

  // Tìm kiếm email suggestions từ table users
  useEffect(() => {
    const searchEmails = async () => {
      if (!form.email.trim() || form.email.length < 2) {
        setEmailSuggestions([]);
        setShowEmailSuggestions(false);
        return;
      }
      
      try {
        // Search from users table
        const res = await userService.searchEmails(form.email.trim(), 10);
        if (res.success) {
          setEmailSuggestions(res.data);
          setShowEmailSuggestions(res.data.length > 0);
        }
      } catch (err) {
        setEmailSuggestions([]);
        setShowEmailSuggestions(false);
      }
    };
    
    const timeoutId = setTimeout(searchEmails, 300); // Debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [form.email]);

  const handleEmailSelect = (user) => {
    setForm(prev => ({ ...prev, email: user.email, name: user.username || prev.name }));
    setShowEmailSuggestions(false);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    
    // Validation cơ bản ở frontend (chỉ để UX tốt hơn)
    // Backend sẽ validate đầy đủ và xử lý toàn bộ nghiệp vụ
    if (!form.name.trim()) {
      addToast('Tên thành viên là bắt buộc', 'danger');
      return;
    }
    
    if (!form.email.trim()) {
      addToast('Email là bắt buộc', 'danger');
      return;
    }
    
    try {
      // Gửi dữ liệu lên backend - Backend sẽ xử lý toàn bộ logic nghiệp vụ
      const memberData = {
        name: form.name.trim(),
        email: form.email.trim(),
        date_of_birth: form.date_of_birth || null,
        occupation: form.occupation.trim() || null
      };
      
      if (editingId) {
        // Update member - Backend xử lý validation và nghiệp vụ
        const res = await memberService.update(editingId, memberData);
        if (res.success) {
          await loadMembers(); // Reload list
          addToast('Đã cập nhật thành viên');
          resetForm();
        }
      } else {
        // Create new member - Backend xử lý validation và nghiệp vụ
        const res = await memberService.create(memberData);
        if (res.success) {
          await loadMembers(); // Reload list
          addToast('Đã thêm thành viên mới');
          resetForm();
        }
      }
    } catch (err) {
      // Backend trả về lỗi đã được xử lý
      addToast(err?.response?.data?.message || err.message || 'Lỗi khi lưu thành viên', 'danger');
    }
  };

  const openDelete = (id) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      // Backend xử lý toàn bộ logic xóa
      const res = await memberService.remove(deleteTargetId);
      if (res.success) {
        await loadMembers(); // Reload list
        addToast('Đã xóa thành viên', 'danger');
        if (editingId === deleteTargetId) {
          resetForm();
        }
      }
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    } catch (err) {
      addToast(err?.response?.data?.message || err.message || 'Lỗi khi xóa thành viên', 'danger');
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };



  // Chặn member và các role không có quyền
  if (!canManage && !permissions.canViewTeam) {
    return (
      <div className="team-page">
        <div className="page-header">
          <div>
            <h1>THÀNH VIÊN</h1>
            <p className="subtitle">Bạn không có quyền truy cập trang này.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="team-page">
      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
          ))}
        </div>
      )}

      {/* TOP NAV BAR - Global Nav for Team Page */}
      <div className="team-top-nav">
        <div className="nav-left">
          <div className="nav-brand">
            <div className="nav-icon"><i className="fas fa-layer-group"></i></div>
            <span className="nav-title">DỰ ÁN</span>
          </div>
          <span className="nav-link">Dashboard</span>
          <span className="nav-link active">Overview</span>
        </div>
        <div className="nav-right">
          <div className="nav-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Tìm kiếm thành viên..." />
          </div>
          <i className="far fa-bell icon-btn"></i>
          <i className="fas fa-cog icon-btn"></i>
          {user?.avatar ? (
             <img src={user.avatar} alt="User" className="nav-avatar" />
          ) : (
             <div className="nav-avatar-placeholder">
               {getLastName(user?.username || 'U').charAt(0).toUpperCase()}
             </div>
          )}
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="team-welcome">
        <div className="welcome-icon">
          <i className="fas fa-user-friends"></i>
        </div>
        <div className="welcome-text">
          <h1>QUẢN LÝ THÀNH VIÊN</h1>
          <p>Quản lý thông tin và vai trò của các thành viên trong hệ thống.</p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="team-controls">
        <div className="controls-search">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm thành viên..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="controls-filter" style={{ marginLeft: '12px' }}>
          <select 
            value={filterProjectId} 
            onChange={(e) => setFilterProjectId(e.target.value)}
            className="project-filter-select"
          >
            <option value="">Tất cả dự án</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="controls-count">
          <i className="fas fa-user-friends"></i>
          <span>{members.length} thành viên</span>
        </div>
        {canManage && (
          <button className="add-member-btn" onClick={openCreate}>
            <i className="fas fa-plus"></i> Thêm thành viên
          </button>
        )}
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải danh sách thành viên...</p>
        </div>
      ) : (
        <div className="team-table-card">
          {(() => {
            const filteredMembers = members.filter(m => {
              if (filterProjectId) {
                const selectedProject = projects.find(p => p.id.toString() === filterProjectId);
                if (selectedProject && (!m.projects || !m.projects.includes(selectedProject.name))) {
                  return false;
                }
              }
              if (!searchQuery.trim()) return true;
              const query = searchQuery.toLowerCase();
              return (
                m.name?.toLowerCase().includes(query) ||
                m.email?.toLowerCase().includes(query) ||
                m.occupation?.toLowerCase().includes(query) ||
                m.id?.toString().includes(query)
              );
            });

            return filteredMembers.length > 0 || members.length === 0 ? (
              <>
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>TÊN</th>
                      <th>EMAIL</th>
                      <th>VAI TRÒ</th>
                      <th>DỰ ÁN</th>
                      {canManage && <th>THAO TÁC</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((m, idx) => {
                        // Determine badge class
                        const occ = (m.occupation || '').toLowerCase();
                        let badgeClass = 'default';
                        if (occ.includes('design') || occ.includes('thiết kế')) badgeClass = 'design';
                        else if (occ.includes('engineer') || occ.includes('dev') || occ.includes('kỹ sư')) badgeClass = 'engineering';
                        else if (occ.includes('market') || occ.includes('sale') || occ.includes('kinh doanh')) badgeClass = 'marketing';

                        return (
                          <tr key={m.id}>
                            <td className="col-id">#{String(m.id).padStart(3, '0')}</td>
                            <td className="col-name">
                              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`} alt={m.name} className="member-avatar" />
                              <span>{m.name}</span>
                            </td>
                            <td className="col-email">{m.email}</td>
                            <td>
                              {canManage && m.user_id && m.workspace_role !== 'pm' ? (
                                <select 
                                  value={m.workspace_role || 'mb'}
                                  onChange={(e) => handleUpdateRole(m.user_id, e.target.value)}
                                  className="role-select"
                                >
                                  <option value="tl">Team Leader</option>
                                  <option value="mb">Member</option>
                                  <option value="clt">Khách hàng</option>
                                </select>
                              ) : (
                                <span className={`member-role-badge role-${m.workspace_role || 'mb'}`} style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', background: '#f3f4f6', color: '#4b5563' }}>
                                  {m.workspace_role === 'pm' ? 'PM' : m.workspace_role === 'tl' ? 'TL' : m.workspace_role === 'clt' ? 'KH' : 'MB'}
                                </span>
                              )}
                            </td>
                            <td>
                              <span style={{ fontSize: '13px', color: '#4b5563' }}>{m.projects || '-'}</span>
                            </td>
                            {canManage && (
                              <td>
                                <button className="table-btn edit-btn" onClick={() => openEdit(m)} title="Sửa">
                                  <i className="fas fa-edit"></i>
                                </button>
                                {canDelete && (
                                  <button className="table-btn delete-btn" onClick={() => openDelete(m.id)} title="Xóa">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={canManage ? 6 : 5} style={{ textAlign: 'center', padding: '40px' }}>
                          <div style={{ color: '#9ca3af' }}>Không có thành viên nào khớp với từ khóa "{searchQuery}"</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="table-footer">
                  <span>Hiển thị {Math.min(1, filteredMembers.length)} - {filteredMembers.length} trong số {filteredMembers.length} thành viên</span>
                  <div className="pagination">
                    <button>&lt;</button>
                    <button className="active">1</button>
                    <button>&gt;</button>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                icon="fa-users"
                title="Chưa có thành viên nào"
                description="Thêm thành viên mới để bắt đầu quản lý."
                actionLabel={canManage && permissions.canViewTeam ? "Thêm thành viên đầu tiên" : null}
                onAction={canManage && permissions.canViewTeam ? openCreate : null}
              />
            );
          })()}
        </div>
      )}

      {/* BOTTOM PANELS */}
      <div className="team-bottom-panels">
        <div className="panel-admin">
          <h3>Lời khuyên quản trị</h3>
          <p>Sử dụng vai trò 'Guest' cho các đối tác bên ngoài để giới hạn quyền truy cập vào dữ liệu nhạy cảm của công ty.</p>
          <a href="#">Xem hướng dẫn bảo mật</a>
          <i className="fas fa-shield-alt bg-icon"></i>
        </div>
        <div className="panel-support">
          <div className="support-icon"><i className="far fa-question-circle"></i></div>
          <div className="support-content">
            <h3>Cần hỗ trợ?</h3>
            <p>Nếu bạn gặp khó khăn trong việc quản lý thành viên, vui lòng liên hệ đội ngũ IT Hub.</p>
            <button>Gửi yêu cầu hỗ trợ</button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <ModalAdd
        isOpen={isFormOpen}
        onClose={closeFormOnly}
        title={editingId ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
        subtitle={editingId ? 'Cập nhật thông tin thành viên' : 'Thêm thành viên mới vào hệ thống'}
        icon={editingId ? 'fa-edit' : 'fa-user-plus'}
        actions={[
          {
            label: 'Hủy',
            icon: 'fa-times',
            className: 'secondary',
            onClick: closeFormOnly
          },
          {
            label: editingId ? 'Lưu' : 'Thêm',
            icon: editingId ? 'fa-save' : 'fa-plus',
            className: 'primary',
            onClick: () => {
              const form = document.getElementById('member-form');
              if (form) {
                form.requestSubmit();
              }
            }
          }
        ]}
      >
        <form id="member-form" className="project-form" onSubmit={submitForm}>
          <div className="form-row">
            <label htmlFor="name">
              <i className="fas fa-user"></i>
              Tên thành viên <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nhập tên thành viên"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email <span className="required">*</span>
            </label>
            <div className="email-input-wrapper" style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                placeholder="Nhập email (ví dụ: ki...)"
                value={form.email}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, email: e.target.value }));
                  setShowEmailSuggestions(true);
                }}
                onFocus={() => {
                  if (emailSuggestions.length > 0) {
                    setShowEmailSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowEmailSuggestions(false), 200);
                }}
                required
              />
              {showEmailSuggestions && emailSuggestions.length > 0 && (
                <div className="email-suggestions">
                  {emailSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="email-suggestion-item"
                      onClick={() => handleEmailSelect(suggestion)}
                    >
                      <div className="suggestion-icon">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="suggestion-info">
                        <div className="suggestion-email">{suggestion.email}</div>
                        <div className="suggestion-username">{suggestion.username}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="hint">
              <i className="fas fa-info-circle"></i>
              Email sẽ được kiểm tra tính duy nhất trong hệ thống
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="date_of_birth">
              <i className="fas fa-calendar"></i>
              Ngày sinh
            </label>
            <input
              id="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
            />
          </div>

          <div className="form-row">
            <label htmlFor="occupation">
              <i className="fas fa-briefcase"></i>
              Nghề nghiệp
            </label>
            <input
              id="occupation"
              type="text"
              placeholder="Nhập nghề nghiệp"
              value={form.occupation}
              onChange={(e) => setForm(prev => ({ ...prev, occupation: e.target.value }))}
            />
          </div>
          <button type="submit" style={{ display: 'none' }} form="member-form"></button>
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
            label: 'Xóa thành viên',
            icon: 'fa-trash',
            className: 'primary danger-fill',
            onClick: confirmDelete
          }
        ]}
      >
        <div className="confirm-body">
          <i className="fas fa-info-circle confirm-icon"></i>
          <p>Bạn có chắc muốn xóa thành viên này? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.</p>
        </div>
      </ModalAdd>
    </div>
  );
};

export default Team;


