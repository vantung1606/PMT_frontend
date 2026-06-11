import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAuth } from '../../contexts/AuthContext';
import logoImage from '../../assets/img/logo.png';
import api from '../../services/api';
import './Workspaces.css';

const DEFAULT_SETTINGS = {
  heroTitle1: 'Quản lý dự án',
  heroTitleHighlight: 'rõ ràng cho cả đội.',
  heroDesc: 'CollabTask giúp bạn tạo workspace, phân công task, trao đổi realtime và theo dõi tiến độ trong một nơi duy nhất.',
  heroCtaText: 'Bắt đầu miễn phí',
  titleFontFamily: 'Montserrat',
  titleFontSize: 48,
  titleFontWeight: '900',
  highlightColor1: '#c62828',
  highlightColor2: '#991b1b',
  backgroundGradientStart: '#fff4ef',
  backgroundGradientEnd: '#eef5ff',
  glowOrbColor1: '#c62828',
  glowOrbColor2: '#2563eb',
  backgroundImageUrl: ''
};

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

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('collabtask_website_settings');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/website/settings');
        if (response.data?.success && response.data?.data) {
          setSettings(response.data.data);
          localStorage.setItem('collabtask_website_settings', JSON.stringify(response.data.data));
        }
      } catch (error) {
        console.error('Không thể tải cấu hình giao diện từ server:', error);
      }
    };
    fetchSettings();
  }, []);

  const currentSettings = useMemo(() => {
    return { ...DEFAULT_SETTINGS, ...settings };
  }, [settings]);

  useEffect(() => {
    if (currentSettings) {
      const styleId = 'custom-workspaces-theme-styles';
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      const bgImg = currentSettings.backgroundImageUrl ? `url("${currentSettings.backgroundImageUrl}"),` : '';
      styleEl.innerHTML = `
        .workspaces-page {
          background-image:
            linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(244, 247, 251, 0.76) 34%, rgba(255, 255, 255, 0.96) 100%),
            ${bgImg}
            radial-gradient(ellipse at 12% 18%, ${currentSettings.glowOrbColor1}22 0%, ${currentSettings.glowOrbColor1}10 26%, transparent 58%),
            radial-gradient(ellipse at 88% 24%, ${currentSettings.glowOrbColor2}1e 0%, ${currentSettings.glowOrbColor2}0e 26%, transparent 60%),
            radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.88) 0%, transparent 56%),
            linear-gradient(135deg, ${currentSettings.backgroundGradientStart} 0%, ${currentSettings.backgroundGradientEnd} 100%) !important;
          background-size: cover, cover, auto, auto, auto, auto !important;
          background-position: center, center, center, center, center, center !important;
        }
      `;
      return () => {
        const el = document.getElementById(styleId);
        if (el) el.remove();
      };
    }
  }, [currentSettings]);

  const ownedWorkspaces = useMemo(
    () => (Array.isArray(workspaces) ? workspaces.filter((ws) => user && ws.owner_id === user.id) : []),
    [workspaces, user]
  );

  const memberWorkspaces = useMemo(
    () => (Array.isArray(workspaces) ? workspaces.filter((ws) => !user || ws.owner_id !== user.id) : []),
    [workspaces, user]
  );

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
  const totalCount = Array.isArray(workspaces) ? workspaces.length : 0;

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
      await createWorkspace({
        name: form.name.trim(),
        description: form.description.trim()
      });
      setForm({ name: '', description: '' });
      setShowModal(false);
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

  useEffect(() => {
    window.scrollTo(0, 0);
    window.scroll(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleNavClick = (path) => {
    if (path === '/workspaces') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  const headerLinks = [
    { label: 'TRANG CHỦ', active: false, path: '/' },
    { label: 'DỰ ÁN', active: true, path: '/workspaces' },
    { label: 'SỰ KIỆN', active: false, path: '/#events' },
    { label: 'TIN TỨC', active: false, path: '/#news' }
  ];

  return (
    <div className="workspaces-page">
      <div className="workspace-pill-nav">
        <div className="wp-nav-left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img className="wp-brand-logo" src={logoImage} alt="CollabTask" />
        </div>
        <div className="wp-nav-center">
          {headerLinks.map((link) => (
            <span
              key={link.label}
              className={`wp-nav-link ${link.active ? 'active' : ''}`}
              onClick={() => handleNavClick(link.path)}
            >
              {link.label}
            </span>
          ))}
        </div>
        <div className="wp-nav-right">
          <div className="wp-account-trigger" onClick={() => setShowUserMenu(!showUserMenu)} ref={userMenuRef}>
            <div className="wp-avatar">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="User" />
              ) : (
                <span>{(user?.username || user?.full_name || 'A').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="wp-account-name">{user?.full_name || user?.username || 'Admin Account'}</span>
            <i className={`fas fa-chevron-down wp-account-arrow ${showUserMenu ? 'open' : ''}`}></i>
            {showUserMenu && (
              <div className="wp-user-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="wp-user-info">
                  <div className="wp-user-name">{user?.username || user?.full_name || 'Admin Account'}</div>
                  <div className="wp-user-email">{user?.email}</div>
                </div>
                <div className="wp-dropdown-divider"></div>
                {user?.role === 'admin' && (
                  <button className="wp-admin-btn" onClick={() => { setShowUserMenu(false); navigate('/admin'); }} type="button">
                    <i className="fas fa-shield-alt"></i> Admin Dashboard
                  </button>
                )}
                <button className="wp-logout-btn" onClick={() => { setShowUserMenu(false); handleLogout(); }} type="button">
                  <i className="fas fa-sign-out-alt"></i> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="workspace-hero-wrapper">
        <div className="workspace-hero-content">
          <div className="workspace-hero-copy">
            <h1>Workspace của bạn, gọn hơn và dễ quét hơn.</h1>
            <p>
              Tạo, lọc và mở workspace nhanh. Mỗi không gian đều có trạng thái riêng, quyền riêng và luồng làm việc rõ ràng.
            </p>
          </div>
          <div className="workspace-hero-stats">
            <div>
              <strong>{totalCount}</strong>
              <span>workspace</span>
            </div>
            <div>
              <strong>{displayedOwnedWorkspaces.length}</strong>
              <span>sở hữu</span>
            </div>
            <div>
              <strong>{displayedMemberWorkspaces.length}</strong>
              <span>tham gia</span>
            </div>
          </div>
        </div>
      </div>

      <div className="workspace-main-container">
        <div className="workspace-left-col">
          <div className="wp-toolbar">
            <div className="wp-toolbar-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm workspace..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="wp-toolbar-actions">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">Mới nhất</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
              </select>
              <button className="wp-btn-primary" onClick={handleOpenModal} type="button">
                <i className="fas fa-plus"></i> Không gian mới
              </button>
            </div>
          </div>

          {loading && <div className="workspaces-loading">Đang tải danh sách không gian...</div>}

          {!loading && displayedOwnedWorkspaces.length === 0 && displayedMemberWorkspaces.length === 0 && (
            <div className="workspaces-empty">Bạn chưa có workspace nào khớp với bộ lọc hiện tại.</div>
          )}

          {!!displayedOwnedWorkspaces.length && (
            <section className="workspace-group">
              <div className="workspace-group-header">
                <h2>Workspace của bạn</h2>
                <span>{displayedOwnedWorkspaces.length} mục</span>
              </div>
              <div className="wp-cards-grid">
                {displayedOwnedWorkspaces.map((ws, index) => {
                  const badgeLabels = ['Đang hoạt động', 'Ưu tiên', 'Riêng tư'];
                  const badgeClass = ['active', 'priority', 'private'];
                  const bIdx = index % 3;
                  const icons = ['fa-network-wired', 'fa-bullhorn', 'fa-shield-halved'];

                  return (
                    <button key={ws.id} className="wp-card" onClick={() => handleSelect(ws)} type="button">
                      <div className="wp-card-header">
                        <div className={`wp-card-icon badge-${badgeClass[bIdx]}`}>
                          <i className={`fas ${icons[bIdx]}`}></i>
                        </div>
                        <span className={`wp-card-badge type-${badgeClass[bIdx]}`}>
                          {badgeLabels[bIdx]}
                        </span>
                      </div>
                      <h3 className="wp-card-title">{ws.name}</h3>
                      <p className="wp-card-desc">
                        {ws.description || 'Không gian làm việc tập trung cho dự án, nhiệm vụ và cộng tác nhóm.'}
                      </p>

                      <div className="wp-card-stats">
                        <div className="wp-stat-box">
                          <span className="stat-label">Dự án</span>
                          <span className="stat-value">{Math.floor(Math.random() * 20) + 5}</span>
                        </div>
                        <div className="wp-stat-box">
                          <span className="stat-label">Thành viên</span>
                          <span className="stat-value">{Math.floor(Math.random() * 40) + 4}</span>
                        </div>
                      </div>

                      <div className="wp-card-footer">
                        <div className="wp-card-avatars">
                          <img src="https://i.pravatar.cc/150?u=1" alt="Member" />
                          <img src="https://i.pravatar.cc/150?u=2" alt="Member" />
                          <span className="more-members">+{Math.floor(Math.random() * 10) + 2}</span>
                        </div>
                        <div className="wp-card-action">
                          Mở bảng điều khiển <i className="fas fa-chevron-right"></i>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {!!displayedMemberWorkspaces.length && (
            <section className="workspace-group">
              <div className="workspace-group-header">
                <h2>Workspace bạn tham gia</h2>
                <span>{displayedMemberWorkspaces.length} mục</span>
              </div>
              <div className="wp-cards-grid member-grid">
                {displayedMemberWorkspaces.map((ws, index) => {
                  const badgeLabels = ['Đang hoạt động', 'Ưu tiên', 'Cộng tác'];
                  const badgeClass = ['active', 'priority', 'private'];
                  const bIdx = index % 3;
                  const icons = ['fa-people-group', 'fa-folder-open', 'fa-layer-group'];

                  return (
                    <button key={ws.id} className="wp-card member-card" onClick={() => handleSelect(ws)} type="button">
                      <div className="wp-card-header">
                        <div className={`wp-card-icon badge-${badgeClass[bIdx]}`}>
                          <i className={`fas ${icons[bIdx]}`}></i>
                        </div>
                        <span className={`wp-card-badge type-${badgeClass[bIdx]}`}>
                          {badgeLabels[bIdx]}
                        </span>
                      </div>
                      <h3 className="wp-card-title">{ws.name}</h3>
                      <p className="wp-card-desc">
                        {ws.description || 'Workspace được chia sẻ với team để phối hợp công việc hiệu quả hơn.'}
                      </p>
                      <div className="wp-card-footer member-footer">
                        <div className="wp-card-avatars">
                          <span className="more-members">{(ws.role || 'M').toString().charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="wp-card-action">
                          Vào workspace <i className="fas fa-chevron-right"></i>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <div className="wp-card wp-card-create" onClick={handleOpenModal} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleOpenModal()}>
            <div className="wp-create-circle">
              <i className="fas fa-plus"></i>
            </div>
            <span>Tạo workspace mới</span>
          </div>
        </div>

        <div className="workspace-right-col">
          <div className="wp-overview-card">
            <div className="wp-overview-top">
              <p className="wp-overview-label">Tổng quan</p>
              <h3 className="wp-overview-title">
                <i className="fas fa-chart-pie"></i> Nguồn lực & hoạt động
              </h3>
            </div>

            <div className="wp-current-workspace">
              <span className="current-label">Workspace hiện tại</span>
              <strong>{currentWorkspace?.name || 'Chưa chọn workspace'}</strong>
              <p>{currentWorkspace?.description || 'Chọn một workspace để vào bảng dự án, task và báo cáo.'}</p>
            </div>

            <div className="wp-storage-section">
              <div className="storage-header">
                <span>HẠN MỨC LƯU TRỮ</span>
                <strong>78%</strong>
              </div>
              <div className="storage-bar">
                <div className="storage-fill" style={{ width: '78%' }}></div>
              </div>
              <p className="storage-desc">Đã sử dụng 156GB trên tổng số 200GB tại tất cả các trung tâm.</p>
            </div>

            <div className="wp-system-structure">
              <h4>CẤU TRÚC HỆ THỐNG</h4>
              <div className="system-item">
                <div className="sys-icon"><i className="fas fa-sitemap"></i></div>
                <div className="sys-info">
                  <strong>Cấu trúc phân cấp</strong>
                  <span>Xem sơ đồ phân cấp trực quan</span>
                </div>
              </div>
              <div className="system-item">
                <div className="sys-icon"><i className="fas fa-shield-alt"></i></div>
                <div className="sys-info">
                  <strong>Kiểm soát truy cập</strong>
                  <span>Mã hóa & phân quyền</span>
                </div>
              </div>
              <div className="system-item">
                <div className="sys-icon"><i className="fas fa-history"></i></div>
                <div className="sys-info">
                  <strong>Nhật ký hệ thống</strong>
                  <span>Các hành động theo thời gian thực</span>
                </div>
              </div>
            </div>

            <div className="wp-recent-list">
              <h4>WORKSPACE GẦN ĐÂY</h4>
              {recentWorkspaces.map((ws) => (
                <button key={ws.id} className="recent-item" onClick={() => handleSelect(ws)} type="button">
                  <div>
                    <strong>{ws.name}</strong>
                    <span>{ws.description || 'Không có mô tả'}</span>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </button>
              ))}
            </div>

            <div className="wp-support-box">
              <h4>Hỗ Trợ Chuyên Nghiệp</h4>
              <p>Dịch vụ hỗ trợ riêng biệt cho các vấn đề quản trị cấp cao.</p>
              <button type="button">Liên Hệ Hỗ Trợ 24/7</button>
            </div>
          </div>
        </div>
      </div>

      <div className="wp-footer">
        <div className="wp-footer-brand">
          <img className="wp-brand-logo footer-logo" src={logoImage} alt="CollabTask" />
          <span>© 2026 COLLABTASK. Bảo lưu mọi quyền.</span>
        </div>
        <div className="wp-footer-links">
          <span>Chính sách bảo mật</span>
          <span>Điều khoản dịch vụ</span>
          <span>Liên hệ hỗ trợ</span>
          <span>Bảo mật</span>
        </div>
      </div>

      {showModal && (
        <div className="workspace-modal-backdrop" onClick={handleCloseModal}>
          <div className="workspace-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="workspace-modal-header">
              <div>
                <p className="modal-eyebrow">Tạo không gian</p>
                <h3>Thiết lập workspace mới</h3>
              </div>
              <button className="modal-close" onClick={handleCloseModal} disabled={submitting} type="button">×</button>
            </div>

            <form onSubmit={handleSubmit} className="workspace-form">
              <div className="form-row">
                <label htmlFor="ws-name">Tên workspace</label>
                <input
                  id="ws-name"
                  type="text"
                  placeholder="Ví dụ: Product Team 2026"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label htmlFor="ws-desc">Mô tả</label>
                <textarea
                  id="ws-desc"
                  rows={4}
                  placeholder="Mô tả ngắn về dự án/team/khách hàng trong workspace này..."
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              {error && <div className="workspace-error">{error}</div>}
              <div className="modal-actions">
                <button type="button" className="modal-secondary" onClick={handleCloseModal} disabled={submitting}>Hủy</button>
                <button type="submit" className="workspace-submit" disabled={submitting}>{submitting ? 'Đang tạo...' : 'Tạo workspace'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspaces;
