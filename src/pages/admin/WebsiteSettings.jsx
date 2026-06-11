import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import useToast from '../../hooks/useToast';
import { ToastContainer } from '../../components/toast/Toast';
import './WebsiteSettings.css';

const DEFAULT_SETTINGS = {
  // Hero
  heroTitle1: 'Quản lý dự án',
  heroTitleHighlight: 'rõ ràng cho cả đội.',
  heroDesc: 'CollabTask giúp bạn tạo workspace, phân công task, trao đổi realtime và theo dõi tiến độ trong một nơi duy nhất.',
  heroCtaText: 'Bắt đầu miễn phí',
  
  // Font & Style
  titleFontFamily: 'Montserrat',
  titleFontSize: 48,
  titleFontWeight: '900',
  highlightColor1: '#c62828',
  highlightColor2: '#991b1b',
  backgroundGradientStart: '#fff4ef',
  backgroundGradientEnd: '#eef5ff',
  glowOrbColor1: '#c62828',
  glowOrbColor2: '#2563eb',
  backgroundImageUrl: '',
  
  // Features Section
  featuresTitle: 'CollabTask làm được gì?',
  featuresDesc: 'Những khối chức năng cần có để một đội nhóm làm việc gọn hơn, rõ hơn và ít đứt mạch hơn.',
  feature1Title: 'Workspace rõ ràng',
  feature1Desc: 'Tổ chức công việc theo không gian riêng cho từng đội, từng dự án, từng mục tiêu.',
  feature2Title: 'Task minh bạch',
  feature2Desc: 'Giao việc, đặt deadline, cập nhật trạng thái và theo dõi tiến độ theo thời gian thực.',
  feature3Title: 'Trao đổi ngay tại việc',
  feature3Desc: 'Bình luận, phản hồi và thống nhất ngay trên task để tránh rời rạc thông tin.',
  
  // Stats Section
  stat1Value: '500+',
  stat1Label: 'WORKSPACE',
  stat2Value: '99.9%',
  stat2Label: 'THỜI GIAN HOẠT ĐỘNG',
  stat3Value: '24/7',
  stat3Label: 'HỖ TRỢ',
  
  // Footer
  footerText: '© 2026 COLLABTASK. Bảo lưu mọi quyền.'
};

const WebsiteSettings = () => {
  const { toasts, showToast, removeToast } = useToast();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await adminService.getWebsiteSettings();
        if (response.success && response.data) {
          setSettings({ ...DEFAULT_SETTINGS, ...response.data });
          localStorage.setItem('collabtask_website_settings', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Lỗi khi tải cấu hình giao diện từ DB:', error);
        const saved = localStorage.getItem('collabtask_website_settings');
        if (saved) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFieldChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await adminService.updateWebsiteSettings(settings);
      localStorage.setItem('collabtask_website_settings', JSON.stringify(settings));
      window.dispatchEvent(new Event('collabtask_theme_change'));
      showToast('Đã lưu cấu hình giao diện website thành công!', 'success');
    } catch (error) {
      showToast(error.message || 'Lỗi lưu cấu hình giao diện', 'error');
    }
  };

  const handleReset = async () => {
    try {
      await adminService.updateWebsiteSettings(DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('collabtask_website_settings', JSON.stringify(DEFAULT_SETTINGS));
      window.dispatchEvent(new Event('collabtask_theme_change'));
      showToast('Đã khôi phục giao diện mặc định!', 'info');
    } catch (error) {
      showToast(error.message || 'Lỗi khôi phục giao diện mặc định', 'error');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: '#c62828' }}></i>
      </div>
    );
  }

  const fontFamilies = [
    { label: 'Montserrat (Đậm chất hình khối)', value: 'Montserrat' },
    { label: 'Inter (Hiện đại, tối giản)', value: 'Inter' },
    { label: 'Playfair Display (Sang trọng, cổ điển)', value: 'Playfair Display' },
    { label: 'Poppins (Trẻ trung, bo tròn)', value: 'Poppins' },
    { label: 'Rubik (Thân thiện, mềm mại)', value: 'Rubik' },
    { label: 'Roboto Mono (Công nghệ, cá tính)', value: 'Roboto Mono' }
  ];

  const fontWeights = [
    { label: 'Regular (400)', value: '400' },
    { label: 'Medium (500)', value: '500' },
    { label: 'Semi Bold (600)', value: '600' },
    { label: 'Bold (700)', value: '700' },
    { label: 'Extra Bold (800)', value: '800' },
    { label: 'Black (900)', value: '900' }
  ];

  return (
    <div className="admin-website-settings">
      {/* Header */}
      <div className="admin-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="admin-header-title">Quản lý giao diện</h1>
          <p className="admin-header-subtitle">
            Thiết lập và tùy biến giao diện toàn diện cho trang chủ ứng dụng CollabTask
          </p>
        </div>
      </div>

      <div className="website-settings-container">
        {/* Editor Panel */}
        <div className="website-settings-card editor-panel">
          {/* Tabs Navigation */}
          <div className="settings-tabs">
            <button 
              className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
              onClick={() => setActiveTab('hero')}
            >
              <i className="fa-solid fa-house"></i> Hero Section
            </button>
            <button 
              className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              <i className="fa-solid fa-cubes"></i> Tính năng
            </button>
            <button 
              className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <i className="fa-solid fa-chart-simple"></i> Thống kê & Chân trang
            </button>
            <button 
              className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
              onClick={() => setActiveTab('style')}
            >
              <i className="fa-solid fa-palette"></i> Kiểu chữ & Màu sắc
            </button>
          </div>

          <div className="tab-content">
            {/* TAB 1: HERO */}
            {activeTab === 'hero' && (
              <div className="settings-tab-pane">
                <h3><i className="fa-solid fa-house-laptop"></i> Cấu hình phần Hero Banner</h3>
                
                <div className="settings-group">
                  <label>Tiêu đề chính (Dòng 1)</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={settings.heroTitle1}
                    onChange={(e) => handleFieldChange('heroTitle1', e.target.value)}
                  />
                </div>

                <div className="settings-group">
                  <label>Tiêu đề nổi bật (Dòng 2)</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={settings.heroTitleHighlight}
                    onChange={(e) => handleFieldChange('heroTitleHighlight', e.target.value)}
                  />
                </div>

                <div className="settings-group">
                  <label>Đoạn giới thiệu ngắn</label>
                  <textarea
                    className="settings-input"
                    rows="3"
                    value={settings.heroDesc}
                    onChange={(e) => handleFieldChange('heroDesc', e.target.value)}
                  />
                </div>

                <div className="settings-group">
                  <label>Nhãn nút kêu gọi hành động (CTA Button)</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={settings.heroCtaText}
                    onChange={(e) => handleFieldChange('heroCtaText', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: FEATURES */}
            {activeTab === 'features' && (
              <div className="settings-tab-pane">
                <h3><i className="fa-solid fa-cubes-stacked"></i> Cấu hình khối Tính năng</h3>
                
                <div className="settings-group">
                  <label>Tiêu đề khối</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={settings.featuresTitle}
                    onChange={(e) => handleFieldChange('featuresTitle', e.target.value)}
                  />
                </div>

                <div className="settings-group">
                  <label>Mô tả khối</label>
                  <textarea
                    className="settings-input"
                    rows="2"
                    value={settings.featuresDesc}
                    onChange={(e) => handleFieldChange('featuresDesc', e.target.value)}
                  />
                </div>

                <div className="features-editor-grid">
                  <div className="feature-item-box">
                    <h5>Tính năng 1</h5>
                    <input
                      type="text"
                      className="settings-input compact"
                      placeholder="Tiêu đề"
                      value={settings.feature1Title}
                      onChange={(e) => handleFieldChange('feature1Title', e.target.value)}
                    />
                    <textarea
                      className="settings-input compact"
                      placeholder="Mô tả ngắn"
                      rows="2"
                      value={settings.feature1Desc}
                      onChange={(e) => handleFieldChange('feature1Desc', e.target.value)}
                    />
                  </div>

                  <div className="feature-item-box">
                    <h5>Tính năng 2</h5>
                    <input
                      type="text"
                      className="settings-input compact"
                      placeholder="Tiêu đề"
                      value={settings.feature2Title}
                      onChange={(e) => handleFieldChange('feature2Title', e.target.value)}
                    />
                    <textarea
                      className="settings-input compact"
                      placeholder="Mô tả ngắn"
                      rows="2"
                      value={settings.feature2Desc}
                      onChange={(e) => handleFieldChange('feature2Desc', e.target.value)}
                    />
                  </div>

                  <div className="feature-item-box">
                    <h5>Tính năng 3</h5>
                    <input
                      type="text"
                      className="settings-input compact"
                      placeholder="Tiêu đề"
                      value={settings.feature3Title}
                      onChange={(e) => handleFieldChange('feature3Title', e.target.value)}
                    />
                    <textarea
                      className="settings-input compact"
                      placeholder="Mô tả ngắn"
                      rows="2"
                      value={settings.feature3Desc}
                      onChange={(e) => handleFieldChange('feature3Desc', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STATS & FOOTER */}
            {activeTab === 'stats' && (
              <div className="settings-tab-pane">
                <h3><i className="fa-solid fa-chart-line"></i> Cấu hình số liệu thống kê & Footer</h3>
                
                <div className="stats-editor-grid">
                  <div className="stat-input-row">
                    <div>
                      <label>Chỉ số 1 (Ví dụ: 500+)</label>
                      <input
                        type="text"
                        className="settings-input"
                        value={settings.stat1Value}
                        onChange={(e) => handleFieldChange('stat1Value', e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Nhãn chỉ số 1</label>
                      <input
                        type="text"
                        className="settings-input"
                        value={settings.stat1Label}
                        onChange={(e) => handleFieldChange('stat1Label', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="stat-input-row">
                    <div>
                      <label>Chỉ số 2 (Ví dụ: 99.9%)</label>
                      <input
                        type="text"
                        className="settings-input"
                        value={settings.stat2Value}
                        onChange={(e) => handleFieldChange('stat2Value', e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Nhãn chỉ số 2</label>
                      <input
                        type="text"
                        className="settings-input"
                        value={settings.stat2Label}
                        onChange={(e) => handleFieldChange('stat2Label', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="stat-input-row">
                    <div>
                      <label>Chỉ số 3 (Ví dụ: 24/7)</label>
                      <input
                        type="text"
                        className="settings-input"
                        value={settings.stat3Value}
                        onChange={(e) => handleFieldChange('stat3Value', e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Nhãn chỉ số 3</label>
                      <input
                        type="text"
                        className="settings-input"
                        value={settings.stat3Label}
                        onChange={(e) => handleFieldChange('stat3Label', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="settings-group" style={{ marginTop: '20px' }}>
                  <label>Bản quyền chân trang (Footer Copyright)</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={settings.footerText}
                    onChange={(e) => handleFieldChange('footerText', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 4: STYLE */}
            {activeTab === 'style' && (
              <div className="settings-tab-pane">
                <h3><i className="fa-solid fa-sliders"></i> Phông chữ & Màu sắc chủ đạo</h3>

                <div className="settings-grid">
                  <div className="settings-group">
                    <label>Bộ font tiêu đề chính</label>
                    <select
                      className="settings-input"
                      value={settings.titleFontFamily}
                      onChange={(e) => handleFieldChange('titleFontFamily', e.target.value)}
                    >
                      {fontFamilies.map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="settings-group">
                    <label>Độ đậm phông chữ</label>
                    <select
                      className="settings-input"
                      value={settings.titleFontWeight}
                      onChange={(e) => handleFieldChange('titleFontWeight', e.target.value)}
                    >
                      {fontWeights.map(w => (
                        <option key={w.value} value={w.value}>{w.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="settings-group">
                  <label>Kích thước chữ tiêu đề chính</label>
                  <div className="font-size-slider">
                    <input
                      type="range"
                      min="24"
                      max="72"
                      value={settings.titleFontSize}
                      onChange={(e) => handleFieldChange('titleFontSize', parseInt(e.target.value))}
                    />
                    <span className="slider-value">{settings.titleFontSize}px</span>
                  </div>
                </div>

                <div className="settings-group">
                  <label>Dải màu chữ tiêu đề nổi bật (Text Gradient)</label>
                  <div className="color-pickers-row">
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={settings.highlightColor1}
                        onChange={(e) => handleFieldChange('highlightColor1', e.target.value)}
                      />
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Bắt đầu</div>
                        <span className="color-value-text">{settings.highlightColor1}</span>
                      </div>
                    </div>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={settings.highlightColor2}
                        onChange={(e) => handleFieldChange('highlightColor2', e.target.value)}
                      />
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Kết thúc</div>
                        <span className="color-value-text">{settings.highlightColor2}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-group">
                  <label>Dải màu nền trang chủ (Background Gradient)</label>
                  <div className="color-pickers-row">
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={settings.backgroundGradientStart}
                        onChange={(e) => handleFieldChange('backgroundGradientStart', e.target.value)}
                      />
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Nền trái</div>
                        <span className="color-value-text">{settings.backgroundGradientStart}</span>
                      </div>
                    </div>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={settings.backgroundGradientEnd}
                        onChange={(e) => handleFieldChange('backgroundGradientEnd', e.target.value)}
                      />
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Nền phải</div>
                        <span className="color-value-text">{settings.backgroundGradientEnd}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-group">
                  <label>Màu quầng sáng nền (Ambient Glow Orbs)</label>
                  <div className="color-pickers-row">
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={settings.glowOrbColor1}
                        onChange={(e) => handleFieldChange('glowOrbColor1', e.target.value)}
                      />
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Quầng sáng 1</div>
                        <span className="color-value-text">{settings.glowOrbColor1}</span>
                      </div>
                    </div>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={settings.glowOrbColor2}
                        onChange={(e) => handleFieldChange('glowOrbColor2', e.target.value)}
                      />
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Quầng sáng 2</div>
                        <span className="color-value-text">{settings.glowOrbColor2}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-group">
                  <label>Ảnh nền trang chủ (Background Image URL)</label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Dán link ảnh (https://...) hoặc chọn hình mẫu bên dưới..."
                    value={settings.backgroundImageUrl || ''}
                    onChange={(e) => handleFieldChange('backgroundImageUrl', e.target.value)}
                  />
                  <div className="preset-backgrounds" style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      className="settings-btn settings-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', margin: 0 }}
                      onClick={() => handleFieldChange('backgroundImageUrl', '')}
                    >
                      Mặc định (Trống)
                    </button>
                    <button 
                      type="button"
                      className="settings-btn settings-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', margin: 0 }}
                      onClick={() => handleFieldChange('backgroundImageUrl', 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop')}
                    >
                      Dải màu trừu tượng (Abstract)
                    </button>
                    <button 
                      type="button"
                      className="settings-btn settings-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', margin: 0 }}
                      onClick={() => handleFieldChange('backgroundImageUrl', 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop')}
                    >
                      Văn phòng tối giản (Office)
                    </button>
                    <button 
                      type="button"
                      className="settings-btn settings-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px', margin: 0 }}
                      onClick={() => handleFieldChange('backgroundImageUrl', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop')}
                    >
                      Sóng màu mềm (Waves)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="settings-actions">
            <button className="settings-btn settings-btn-secondary" onClick={handleReset}>
              <i className="fa-solid fa-rotate-left"></i> Khôi phục mặc định
            </button>
            <button className="settings-btn settings-btn-primary" onClick={handleSave}>
              <i className="fa-solid fa-floppy-disk"></i> Lưu cấu hình
            </button>
          </div>
        </div>

        {/* Live Preview Panel - Simulated Browser Frame */}
        <div className="preview-sticky">
          <div className="simulated-browser">
            <div className="browser-bar">
              <div className="browser-dots">
                <span className="b-dot b-dot-red"></span>
                <span className="b-dot b-dot-yellow"></span>
                <span className="b-dot b-dot-green"></span>
              </div>
              <div className="browser-url">
                <i className="fa-solid fa-lock" style={{ fontSize: '10px', color: '#10b981', marginRight: '6px' }}></i>
                localhost:3000/
              </div>
            </div>

            <div 
              className="browser-screen"
              style={{
                backgroundImage: `
                  linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(244, 247, 251, 0.7) 100%),
                  ${settings.backgroundImageUrl ? `url("${settings.backgroundImageUrl}"),` : ''}
                  linear-gradient(135deg, ${settings.backgroundGradientStart} 0%, ${settings.backgroundGradientEnd} 100%)
                `,
                backgroundSize: 'cover, cover, auto',
                backgroundPosition: 'center, center, center',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
              }}
            >
              {/* Glow Orbs */}
              <div 
                className="sim-orb orb-1"
                style={{ background: `radial-gradient(circle, ${settings.glowOrbColor1}20 0%, rgba(255,255,255,0) 70%)` }}
              ></div>
              <div 
                className="sim-orb orb-2"
                style={{ background: `radial-gradient(circle, ${settings.glowOrbColor2}20 0%, rgba(255,255,255,0) 70%)` }}
              ></div>

              {/* Fixed header mock - Floats at top: 3px and has border-radius 999px */}
              <div className="sim-header-wrapper">
                <div className="sim-header-pill">
                  <div className="sim-logo">COLLABTASK</div>
                  <div className="sim-menu">
                    <span className="active">TRANG CHỦ</span>
                    <span>DỰ ÁN</span>
                    <span>SỰ KIỆN</span>
                    <span>TIN TỨC</span>
                  </div>
                  <div className="sim-auth-btn">Đăng nhập</div>
                </div>
              </div>

              {/* Vertical spacer - 45px inside mock (scale down of 90px) */}
              <div className="sim-header-spacer"></div>

              {/* 1. HERO SECTION */}
              <div className="sim-hero">
                <div className="sim-hero-text">
                  <span className="sim-tag">PREVIEW MODE</span>
                  <h1
                    style={{
                      fontFamily: settings.titleFontFamily,
                      fontSize: `${settings.titleFontSize * 0.45}px`, // scaled
                      fontWeight: settings.titleFontWeight
                    }}
                  >
                    {settings.heroTitle1}
                    <br />
                    <span 
                      style={{
                        background: `linear-gradient(135deg, ${settings.highlightColor1} 0%, ${settings.highlightColor2} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: settings.highlightColor1,
                        fontStyle: 'italic'
                      }}
                    >
                      {settings.heroTitleHighlight}
                    </span>
                  </h1>
                  <p className="sim-desc">{settings.heroDesc}</p>
                  <div className="sim-actions">
                    <button className="sim-btn sim-btn-primary" type="button" disabled>{settings.heroCtaText}</button>
                    <button className="sim-btn sim-btn-secondary" type="button" disabled>Xem tính năng</button>
                  </div>
                </div>

                <div className="sim-hero-visual">
                  <div className="sim-dashboard-mock">
                    <div className="mock-title-bar"></div>
                    <div className="mock-content-row">
                      <div className="mock-sidebar"></div>
                      <div className="mock-main"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. FEATURES SECTION */}
              <div className="sim-features">
                <div className="sim-section-header">
                  <h3>{settings.featuresTitle}</h3>
                  <p>{settings.featuresDesc}</p>
                </div>
                
                <div className="sim-features-grid">
                  <div className="sim-feature-card">
                    <div className="sim-icon"><i className="fa-solid fa-diagram-project"></i></div>
                    <h4>{settings.feature1Title}</h4>
                    <p>{settings.feature1Desc}</p>
                  </div>
                  <div className="sim-feature-card visual-card">
                    <div className="sim-photo-mock"></div>
                  </div>
                  <div className="sim-feature-card">
                    <div className="sim-icon"><i className="fa-solid fa-list-check"></i></div>
                    <h4>{settings.feature2Title}</h4>
                    <p>{settings.feature2Desc}</p>
                  </div>
                  <div className="sim-feature-card">
                    <div className="sim-icon"><i className="fa-solid fa-comments"></i></div>
                    <h4>{settings.feature3Title}</h4>
                    <p>{settings.feature3Desc}</p>
                  </div>
                </div>
              </div>

              {/* 3. STATS SECTION */}
              <div className="sim-stats">
                <div className="sim-stat-item">
                  <strong>{settings.stat1Value}</strong>
                  <span>{settings.stat1Label}</span>
                </div>
                <div className="sim-stat-item">
                  <strong>{settings.stat2Value}</strong>
                  <span>{settings.stat2Label}</span>
                </div>
                <div className="sim-stat-item">
                  <strong>{settings.stat3Value}</strong>
                  <span>{settings.stat3Label}</span>
                </div>
              </div>

              {/* FOOTER */}
              <div className="sim-footer">
                <div>COLLABTASK</div>
                <div className="copyright">{settings.footerText}</div>
              </div>
            </div>
          </div>
          
          <p className="preview-tip-text">
            <i className="fa-solid fa-scroll"></i> Bạn có thể cuộn danh sách preview bên trên để kiểm tra đầy đủ bố cục của trang chủ. Nhấn <strong>Lưu cấu hình</strong> để xuất bản thay đổi.
          </p>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default WebsiteSettings;
