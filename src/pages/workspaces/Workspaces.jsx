import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAuth } from '../../contexts/AuthContext';
import './Workspaces.css';

const Workspaces = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { workspaces, currentWorkspace, loading, selectWorkspace, createWorkspace } = useWorkspace();
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Phân tách workspace do mình tạo và workspace được mời/tham gia
  const ownedWorkspaces = Array.isArray(workspaces)
    ? workspaces.filter(ws => user && ws.owner_id === user.id)
    : [];

  const memberWorkspaces = Array.isArray(workspaces)
    ? workspaces.filter(ws => !user || ws.owner_id !== user.id)
    : [];

  const handleSelect = (ws) => {
    selectWorkspace(ws);
    navigate('/projects');
  };

  const handleOpenModal = () => {
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Tên không gian làm việc là bắt buộc');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const ws = await createWorkspace({
        name: form.name.trim(),
        description: form.description.trim()
      });
      setForm({ name: '', description: '' });
      setShowModal(false);
      // Sau khi tạo tự động vào workspace mới
      // navigate('/projects');
    } catch (err) {
      setError(err.message || 'Không thể tạo không gian làm việc');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <div className="workspaces-page">
      {/* Top Navigation Bar */}
      <div className="workspace-top-nav">
        <button className="back-to-home-btn" onClick={handleBackToHome} title="Trở về trang chủ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Trang chủ</span>
        </button>
        
        <div className="user-menu-container" ref={userMenuRef}>
          <button 
            className="user-name-btn" 
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="Menu người dùng"
          >
            <div className="user-avatar">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} />
              ) : (
                <span>{user?.full_name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <span className="user-name">{user?.full_name || 'Người dùng'}</span>
            <svg 
              className={`dropdown-arrow ${showUserMenu ? 'open' : ''}`}
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown-menu">
              <div className="user-info-section">
                <div className="user-info-name">{user?.full_name}</div>
                <div className="user-info-email">{user?.email}</div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="logout-btn" onClick={handleLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="workspaces-hero" >
        <div>
          <p className="hero-eyebrow">Không gian làm việc</p>
          <h1>Chọn nơi bạn muốn bắt đầu</h1>
          <p className="hero-subtitle">
            Quản lý tất cả dự án, task, thành viên và báo cáo trong một nơi thống nhất.
          </p>
        </div>
        <div className='logo-wp-container'>
          <img src={require('../../assets/img/BrandCogniSync.png')} alt="CogniSync Logo" className='logo-wp' style={{ width: 48, height: 48, objectFit: 'contain' }} />
          <span className='logo-wp-text'>
            COGNISYNC
          </span>
        </div>
      </div>

      {/* Các workspace do chính user tạo */}
      <section className="workspace-section">
        <div className="workspace-section-header">
          <div>
            <h2>Không gian của bạn</h2>
            <p>Chạm để truy cập nhanh vào không gian đã tham gia</p>
          </div>
          <button className="workspace-section-action" onClick={handleOpenModal}>
            Tạo không gian
          </button>
        </div>

        {loading && (
          <div className="workspaces-loading">Đang tải danh sách không gian...</div>
        )}

        {!loading && ownedWorkspaces.length === 0 && (
          <div className="workspaces-empty">
            <p>Bạn chưa có không gian làm việc nào. Hãy tạo mới để bắt đầu.</p>
          </div>
        )}

        <div className="workspaces-grid">
          <button className="workspace-card workspace-card-create" onClick={handleOpenModal}>
            <div className="create-icon">+</div>
            <div>
              <h3>Tạo không gian mới</h3>
              <p>Bắt đầu dự án và mời thành viên</p>
            </div>
          </button>

          {ownedWorkspaces.map((ws) => (
            <button
              key={ws.id}
              className={`workspace-card ${currentWorkspace?.id === ws.id ? 'active' : ''}`}
              onClick={() => handleSelect(ws)}
            >
              <div className="workspace-card-header">
                <div>
                  <h3>{ws.name}</h3>
                  {ws.description && (
                    <p className="workspace-desc">{ws.description}</p>
                  )}
                </div>
              </div>
              <div className="workspace-footer">
                <span className="workspace-status">
                  {currentWorkspace?.id === ws.id ? 'Đang hoạt động' : 'Nhấn để truy cập'}
                </span>
                <span className="workspace-arrow">→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Các workspace mà user được PM khác thêm vào / tham gia */}
      {memberWorkspaces.length > 0 && (
        <section className="workspace-section">
          <div className="workspace-section-header">
            <div>
              <h2>Không gian bạn tham gia</h2>
              <p>Các không gian do người khác tạo và mời bạn vào làm thành viên</p>
            </div>
          </div>

          <div className="workspaces-grid">
            {memberWorkspaces.map((ws) => (
              <button
                key={ws.id}
                className={`workspace-card ${currentWorkspace?.id === ws.id ? 'active' : ''}`}
                onClick={() => handleSelect(ws)}
              >
                <div className="workspace-card-header">
                  <div>
                    <h3>{ws.name}</h3>
                    {ws.description && (
                      <p className="workspace-desc">{ws.description}</p>
                    )}
                  </div>
                </div>
                <div className="workspace-footer">
                  <span className="workspace-status">
                    {currentWorkspace?.id === ws.id ? 'Đang hoạt động' : 'Nhấn để truy cập'}
                  </span>
                  <span className="workspace-arrow">→</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {showModal && (
        <div className="workspace-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="workspace-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="workspace-modal-header">
              <div>
                <p className="modal-eyebrow">Tạo không gian</p>
                <h3>Thiết lập không gian mới</h3>
              </div>
              <button className="modal-close" onClick={handleCloseModal} disabled={submitting}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="workspace-form">
              <div className="form-row">
                <label htmlFor="ws-name">Tên không gian</label>
                <input
                  id="ws-name"
                  type="text"
                  placeholder="Ví dụ: Main project workspace"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label htmlFor="ws-desc">Mô tả</label>
                <textarea
                  id="ws-desc"
                  rows={4}
                  placeholder="Thêm mô tả ngắn gọn về mục đích, đội nhóm hoặc khách hàng..."
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              {error && <div className="workspace-error">{error}</div>}
              <div className="modal-actions">
                <button type="button" className="modal-secondary" onClick={handleCloseModal} disabled={submitting}>
                  Hủy
                </button>
                <button type="submit" className="workspace-submit" disabled={submitting}>
                  {submitting ? 'Đang tạo...' : 'Tạo không gian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspaces;

