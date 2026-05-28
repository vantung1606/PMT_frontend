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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const userMenuRef = useRef(null);

  const ownedWorkspaces = Array.isArray(workspaces)
    ? workspaces.filter((ws) => user && ws.owner_id === user.id)
    : [];

  const memberWorkspaces = Array.isArray(workspaces)
    ? workspaces.filter((ws) => !user || ws.owner_id !== user.id)
    : [];

  const getWorkspaceTime = (ws) => {
    const rawValue = ws?.updated_at || ws?.created_at;
    const parsed = rawValue ? new Date(rawValue).getTime() : 0;
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const filterAndSortWorkspaces = (list) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = normalizedSearch
      ? list.filter((ws) => {
          const name = (ws?.name || '').toLowerCase();
          const description = (ws?.description || '').toLowerCase();
          return name.includes(normalizedSearch) || description.includes(normalizedSearch);
        })
      : list;

    const sorted = [...filtered];
    if (sortBy === 'name-asc') {
      sorted.sort((a, b) => (a?.name || '').localeCompare(b?.name || '', 'vi'));
    } else if (sortBy === 'name-desc') {
      sorted.sort((a, b) => (b?.name || '').localeCompare(a?.name || '', 'vi'));
    } else {
      sorted.sort((a, b) => getWorkspaceTime(b) - getWorkspaceTime(a));
    }

    return sorted;
  };

  const displayedOwnedWorkspaces = filterAndSortWorkspaces(ownedWorkspaces);
  const displayedMemberWorkspaces = filterAndSortWorkspaces(memberWorkspaces);
  const recentWorkspaces = filterAndSortWorkspaces(Array.isArray(workspaces) ? workspaces : []).slice(0, 4);

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
      setError('Tên không gian làm vi?c là b?t bu?c');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await createWorkspace({
        name: form.name.trim(),
        description: form.description.trim()
      });
      setForm({ name: '', description: '' });
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Không th? t?o không gian làm vi?c');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <div className="workspaces-page">
      <div className="workspace-top-nav">
        <div className="workspace-nav-actions">
          <button className="back-to-home-btn" onClick={() => navigate('/')} title="Tr? v? trang ch?">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Trang ch?</span>
          </button>
          {user?.role === 'admin' && (
            <button className="back-to-admin-btn" onClick={() => navigate('/admin')} title="Back to Admin Dashboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              <span>Admin Dashboard</span>
            </button>
          )}
        </div>

        <div className="user-menu-container" ref={userMenuRef}>
          <button className="user-name-btn" onClick={() => setShowUserMenu(!showUserMenu)} title="Menu ngu?i dùng">
            <div className="user-avatar">
              {user?.avatar_url ? <img src={user.avatar_url} alt={user.full_name} /> : <span>{user?.full_name?.charAt(0).toUpperCase() || 'U'}</span>}
            </div>
            <span className="user-name">{user?.full_name || 'Ngu?i dùng'}</span>
            <svg className={`dropdown-arrow ${showUserMenu ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <span>Ðang xu?t</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="workspaces-hero">
        <div>
          <p className="hero-eyebrow">Workspace cho d? án</p>
          <h1>Ch?n workspace d? di th?ng vào qu?n lý d? án</h1>
          <p className="hero-subtitle">M?i workspace giúp b?n tách d? án theo team ho?c khách hàng, theo dõi ti?n d? và ph?i h?p công vi?c rõ ràng.</p>
        </div>
        <div className="logo-wp-container">
          <img src={require('../../assets/img/BrandCollabTask.png')} alt="CollabTask Logo" className="logo-wp" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          <span className="logo-wp-text">COLLABTASK</span>
        </div>
      </div>

      <section className="workspace-section workspace-tools-section">
        <div className="workspace-tools">
          <div className="workspace-search">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm workspace theo tên d? án, team ho?c mô t?..."
              aria-label="Tìm workspace"
            />
          </div>
          <div className="workspace-sort">
            <label htmlFor="workspace-sort">S?p x?p</label>
            <select id="workspace-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">M?i c?p nh?t</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
            </select>
          </div>
        </div>
      </section>

      <div className="workspace-main-layout">
        <div className="workspace-primary-column">
          <section className="workspace-section workspace-primary-section">
            <div className="workspace-section-header">
              <div>
                <h2>Không gian c?a b?n</h2>
                <p>Ch?n workspace d? m? danh sách d? án tuong ?ng</p>
              </div>
              <button className="workspace-section-action" onClick={handleOpenModal}>T?o không gian</button>
            </div>

            {loading && <div className="workspaces-loading">Ðang t?i danh sách không gian...</div>}

            {!loading && displayedOwnedWorkspaces.length === 0 && (
              <div className="workspaces-empty">
                <p>{searchTerm.trim() ? 'Không tìm th?y workspace phù h?p v?i t? khóa c?a b?n.' : 'B?n chua có không gian làm vi?c nào. Hãy t?o m?i d? b?t d?u.'}</p>
              </div>
            )}

            <div className="workspaces-grid">
              <button className="workspace-card workspace-card-create" onClick={handleOpenModal}>
                <div className="create-icon">+</div>
                <div>
                  <h3>T?o không gian m?i</h3>
                  <p>B?t d?u qu?n lý d? án m?i theo team ho?c khách hàng</p>
                </div>
              </button>

              {displayedOwnedWorkspaces.map((ws) => (
                <button key={ws.id} className={`workspace-card ${currentWorkspace?.id === ws.id ? 'active' : ''}`} onClick={() => handleSelect(ws)}>
                  <div className="workspace-card-header">
                    <div>
                      <h3>{ws.name}</h3>
                      {ws.description && <p className="workspace-desc">{ws.description}</p>}
                    </div>
                  </div>
                  <div className="workspace-footer">
                    <span className="workspace-status">{currentWorkspace?.id === ws.id ? 'Ðang ho?t d?ng' : 'M? d? án'}</span>
                    <span className="workspace-arrow">?</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {!loading && recentWorkspaces.length > 0 && (
            <section className="workspace-section">
              <div className="workspace-section-header">
                <div>
                  <h2>G?n dây truy c?p</h2>
                  <p>Các workspace b?n v?a làm vi?c g?n nh?t</p>
                </div>
              </div>
              <div className="workspaces-grid">
                {recentWorkspaces.map((ws) => (
                  <button key={`recent-${ws.id}`} className={`workspace-card ${currentWorkspace?.id === ws.id ? 'active' : ''}`} onClick={() => handleSelect(ws)}>
                    <div className="workspace-card-header">
                      <div>
                        <h3>{ws.name}</h3>
                        {ws.description && <p className="workspace-desc">{ws.description}</p>}
                      </div>
                    </div>
                    <div className="workspace-footer">
                      <span className="workspace-status">{currentWorkspace?.id === ws.id ? 'Ðang ho?t d?ng' : 'M? d? án'}</span>
                      <span className="workspace-arrow">?</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {displayedMemberWorkspaces.length > 0 && (
            <section className="workspace-section">
              <div className="workspace-section-header">
                <div>
                  <h2>Không gian b?n tham gia</h2>
                  <p>Các workspace có d? án b?n dang c?ng tác</p>
                </div>
              </div>

              <div className="workspaces-grid">
                {displayedMemberWorkspaces.map((ws) => (
                  <button key={ws.id} className={`workspace-card ${currentWorkspace?.id === ws.id ? 'active' : ''}`} onClick={() => handleSelect(ws)}>
                    <div className="workspace-card-header">
                      <div>
                        <h3>{ws.name}</h3>
                        {ws.description && <p className="workspace-desc">{ws.description}</p>}
                      </div>
                    </div>
                    <div className="workspace-footer">
                      <span className="workspace-status">{currentWorkspace?.id === ws.id ? 'Ðang ho?t d?ng' : 'M? d? án'}</span>
                      <span className="workspace-arrow">?</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="workspace-sidebar-column">
          <section className="workspace-section workspace-sidebar-block">
            <div className="workspace-section-header">
              <div>
                <h2>B?t d?u trong 3 bu?c</h2>
                <p>T?i uu d? vào qu?n lý d? án ngay</p>
              </div>
            </div>
            <div className="workspace-content-grid sidebar-grid">
              <article className="workspace-content-card">
                <span className="content-step">01</span>
                <h3>T?o workspace</h3>
                <p>T?o không gian theo team/khách hàng d? gom dúng d? án.</p>
              </article>
              <article className="workspace-content-card">
                <span className="content-step">02</span>
                <h3>T?o d? án d?u tiên</h3>
                <p>Thi?t l?p m?c tiêu, timeline và ph?m vi công vi?c rõ ràng.</p>
              </article>
              <article className="workspace-content-card">
                <span className="content-step">03</span>
                <h3>Phân công & theo dõi</h3>
                <p>Giao task cho thành viên và c?p nh?t ti?n d? theo d? án.</p>
              </article>
            </div>
          </section>

          <section className="workspace-section workspace-sidebar-block">
            <div className="workspace-section-header">
              <div>
                <h2>M?u workspace d? án</h2>
                <p>Ch?n m?u d? tri?n khai nhanh</p>
              </div>
            </div>
            <div className="workspace-content-grid sidebar-grid">
              <article className="workspace-content-card"><h3>Ph?n m?m</h3><p>Backlog, sprint, bug, release.</p></article>
              <article className="workspace-content-card"><h3>Marketing</h3><p>Timeline n?i dung và KPI.</p></article>
              <article className="workspace-content-card"><h3>V?n hành</h3><p>Quy trình d?nh k? và báo cáo.</p></article>
            </div>
          </section>
        </aside>
      </div>

      {showModal && (
        <div className="workspace-modal-backdrop" onClick={handleCloseModal}>
          <div className="workspace-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="workspace-modal-header">
              <div>
                <p className="modal-eyebrow">T?o không gian</p>
                <h3>Thi?t l?p không gian m?i</h3>
              </div>
              <button className="modal-close" onClick={handleCloseModal} disabled={submitting}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="workspace-form">
              <div className="form-row">
                <label htmlFor="ws-name">Tên không gian</label>
                <input id="ws-name" type="text" placeholder="Ví d?: Product Team 2026" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="form-row">
                <label htmlFor="ws-desc">Mô t?</label>
                <textarea id="ws-desc" rows={4} placeholder="Mô t? ng?n v? d? án/team/khách hàng trong workspace này..." value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
              </div>
              {error && <div className="workspace-error">{error}</div>}
              <div className="modal-actions">
                <button type="button" className="modal-secondary" onClick={handleCloseModal} disabled={submitting}>H?y</button>
                <button type="submit" className="workspace-submit" disabled={submitting}>{submitting ? 'Ðang t?o...' : 'T?o không gian'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspaces;
