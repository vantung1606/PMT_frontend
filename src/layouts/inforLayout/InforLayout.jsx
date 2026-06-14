import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import "./InforLayout.css";
import "../../pages/workspaces/Workspaces.css";
import Slide1 from "../../assets/img/hero_slide_1.png";
import Slide2 from "../../assets/img/hero_slide_2.png";
import Slide3 from "../../assets/img/hero_slide_3.png";
import logoImage from "../../assets/img/logo.png";

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
  backgroundImageUrl: '',
  featuresTitle: 'CollabTask làm được gì?',
  featuresDesc: 'Những khối chức năng cần có để một đội nhóm làm việc gọn hơn, rõ hơn và ít đứt mạch hơn.',
  feature1Title: 'Workspace rõ ràng',
  feature1Desc: 'Tổ chức công việc theo không gian riêng cho từng đội, từng dự án, từng mục tiêu.',
  feature2Title: 'Task minh bạch',
  feature2Desc: 'Giao việc, đặt deadline, cập nhật trạng thái và theo dõi tiến độ theo thời gian thực.',
  feature3Title: 'Trao đổi ngay tại việc',
  feature3Desc: 'Bình luận, phản hồi và thống nhất ngay trên task để tránh rời rạc thông tin.',
  stat1Value: '500+',
  stat1Label: 'WORKSPACE',
  stat2Value: '99.9%',
  stat2Label: 'THỜI GIAN HOẠT ĐỘNG',
  stat3Value: '24/7',
  stat3Label: 'HỖ TRỢ',
  footerText: '© 2026 COLLABTASK. Bảo lưu mọi quyền.'
};

const featureCards = [
  {
    icon: 'fa-diagram-project',
    title: 'Workspace rõ ràng',
    text: 'Tổ chức công việc theo không gian riêng cho từng đội, từng dự án, từng mục tiêu.'
  },
  {
    icon: 'fa-list-check',
    title: 'Task minh bạch',
    text: 'Giao việc, đặt deadline, cập nhật trạng thái và theo dõi tiến độ theo thời gian thực.'
  },
  {
    icon: 'fa-comments',
    title: 'Trao đổi ngay tại việc',
    text: 'Bình luận, phản hồi và thống nhất ngay trên task để tránh rời rạc thông tin.'
  },
  {
    icon: 'fa-chart-line',
    title: 'Báo cáo dễ đọc',
    text: 'Nhìn nhanh khối lượng công việc, rủi ro và hiệu suất để ra quyết định kịp lúc.'
  },
  {
    icon: 'fa-wand-magic-sparkles',
    title: 'AI hỗ trợ',
    text: 'Tóm tắt, gợi ý và hỗ trợ đội ngũ xử lý việc nhanh hơn mà không rời khỏi hệ thống.'
  },
  {
    icon: 'fa-user-shield',
    title: 'Phân quyền linh hoạt',
    text: 'Quản lý quyền truy cập theo workspace và vai trò như PM, TL, member, client.'
  }
];

const roleCards = [
  {
    icon: 'fa-compass-drafting',
    title: 'Project Manager',
    text: 'Nắm toàn cảnh dự án, ưu tiên đầu việc và kiểm soát tiến độ.'
  },
  {
    icon: 'fa-people-group',
    title: 'Team Leader',
    text: 'Phân việc hợp lý, giữ nhịp làm việc và theo sát team.'
  },
  {
    icon: 'fa-user-pen',
    title: 'Member',
    text: 'Xem rõ việc được giao, cập nhật trạng thái và trao đổi ngay tại task.'
  },
  {
    icon: 'fa-eye',
    title: 'Client',
    text: 'Theo dõi kết quả minh bạch mà không cần hỏi lặp lại nhiều lần.'
  }
];

const workflowSteps = [
  {
    title: 'Tạo workspace và dự án',
    text: 'Khởi tạo không gian làm việc riêng cho từng nhóm, từng khách hàng hoặc từng chiến dịch.'
  },
  {
    title: 'Giao việc và phối hợp',
    text: 'Phân task, cập nhật tiến độ, bình luận và đồng bộ trao đổi ở đúng chỗ.'
  },
  {
    title: 'Đọc báo cáo và tối ưu',
    text: 'Theo dõi số liệu, phát hiện điểm nghẽn và điều chỉnh kế hoạch sớm.'
  }
];

const eventsList = [
  { id: 1, title: "Hội Thảo AI & Tương Lai", date: "15/06/2026", type: "online", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "Workshop Năng Suất Nhóm", date: "22/06/2026", type: "offline", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "Lãnh Đạo Kỷ Nguyên Số", date: "01/07/2026", type: "offline", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80" }
];

const newsList = [
  { id: 1, title: "CollabTask v2.0 chính thức ra mắt", category: "Sản Phẩm", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "Cột mốc 10.000 thành viên", category: "Cộng Đồng", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "Tăng 200% tốc độ tải trang", category: "Công Nghệ", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" }
];

const InforLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [activeHash, setActiveHash] = React.useState('/');
  const heroSlides = [Slide1, Slide2, Slide3];

  const scrollToElementWithOffset = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // Offset for fixed navbar height + padding
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const timer = setTimeout(() => {
        scrollToElementWithOffset(id);
        setActiveHash(location.hash);
      }, 150);
      return () => clearTimeout(timer);
    } else if (location.pathname === '/') {
      setActiveHash('/');
    }
  }, [location]);

  const [settings, setSettings] = React.useState(() => {
    const saved = localStorage.getItem('collabtask_website_settings');
    return saved ? JSON.parse(saved) : null;
  });

  const currentSettings = React.useMemo(() => {
    return { ...DEFAULT_SETTINGS, ...settings };
  }, [settings]);

  React.useEffect(() => {
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

  const displayFeatureCards = React.useMemo(() => {
    return featureCards.map((card, idx) => {
      if (idx === 0) {
        return { ...card, title: currentSettings.feature1Title, text: currentSettings.feature1Desc };
      }
      if (idx === 2) {
        return { ...card, title: currentSettings.feature2Title, text: currentSettings.feature2Desc };
      }
      if (idx === 3) {
        return { ...card, title: currentSettings.feature3Title, text: currentSettings.feature3Desc };
      }
      return card;
    });
  }, [currentSettings]);

  React.useEffect(() => {
    const handleThemeChange = () => {
      const saved = localStorage.getItem('collabtask_website_settings');
      setSettings(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener('collabtask_theme_change', handleThemeChange);
    return () => window.removeEventListener('collabtask_theme_change', handleThemeChange);
  }, []);

  React.useEffect(() => {
    if (settings) {
      // Inject background styles dynamically
      const styleId = 'custom-website-theme-styles';
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      const bgImg = settings.backgroundImageUrl ? `url("${settings.backgroundImageUrl}"),` : '';
      styleEl.innerHTML = `
        .landing-page::before {
          background-image:
            linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(244, 247, 251, 0.76) 34%, rgba(255, 255, 255, 0.96) 100%),
            ${bgImg}
            radial-gradient(ellipse at 12% 18%, ${settings.glowOrbColor1}22 0%, ${settings.glowOrbColor1}10 26%, transparent 58%),
            radial-gradient(ellipse at 88% 24%, ${settings.glowOrbColor2}1e 0%, ${settings.glowOrbColor2}0e 26%, transparent 60%),
            radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.88) 0%, transparent 56%),
            linear-gradient(135deg, ${settings.backgroundGradientStart} 0%, ${settings.backgroundGradientEnd} 100%) !important;
          background-size: cover, cover, auto, auto, auto, auto !important;
          background-position: center, center, center, center, center, center !important;
        }
      `;
      
      // Load custom font dynamically if chosen
      if (settings.titleFontFamily) {
        const font = settings.titleFontFamily;
        const fontId = `custom-font-${font.replace(/\s+/g, '-').toLowerCase()}`;
        if (!document.getElementById(fontId)) {
          const link = document.createElement('link');
          link.id = fontId;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;500;700;900&display=swap`;
          document.head.appendChild(link);
        }
      }

      return () => {
        const el = document.getElementById(styleId);
        if (el) el.remove();
      };
    }
  }, [settings]);

  React.useEffect(() => {
    if (window.location.hash) {
      setActiveHash(window.location.hash);
    }
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartClick = () => {
    setIsMobileMenuOpen(false);
    navigate(isAuthenticated ? '/workspaces' : '/login');
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const headerLinks = [
    { label: 'TRANG CHỦ', active: activeHash === '/', path: '/' },
    { label: 'DỰ ÁN', active: false, path: '/workspaces' },
    { label: 'SỰ KIỆN', active: activeHash === '#events', path: '#events' },
    { label: 'TIN TỨC', active: activeHash === '#news', path: '#news' }
  ];

  const handleNavClick = (path) => {
    setActiveHash(path);
    setIsMobileMenuOpen(false);
    if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path.startsWith('#')) {
      const id = path.substring(1);
      scrollToElementWithOffset(id);
    } else {
      navigate(path);
    }
  };

  return (
    <main className="landing-page">
      {/* Backdrop */}
      <div className={`mobile-backdrop ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      {/* Red Drawer */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-close" onClick={() => setIsMobileMenuOpen(false)}>
          <i className="fas fa-times"></i>
        </div>

        {/* Avatar section at top of drawer */}
        <div className="drawer-user-section">
          {isAuthenticated ? (
            <>
              <div className="drawer-avatar">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="User" />
                ) : (
                  <span>{(user?.username || user?.full_name || 'A').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="drawer-user-info">
                <strong>{user?.full_name || user?.username || 'Người dùng'}</strong>
                <span>{user?.email}</span>
              </div>
            </>
          ) : (
            <div className="drawer-guest">
              <i className="fas fa-user-circle"></i>
              <span>Chưa đăng nhập</span>
            </div>
          )}
        </div>

        <div className="drawer-divider"></div>

        {/* Nav links */}
        <nav className="drawer-nav">
          {headerLinks.map((link) => (
            <span
              key={link.label}
              className={`drawer-nav-link ${link.active ? 'active' : ''}`}
              onClick={() => handleNavClick(link.path)}
            >
              {link.label}
            </span>
          ))}
        </nav>

        <div className="drawer-divider"></div>

        {/* Auth actions */}
        <div className="drawer-actions">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <button className="drawer-action-btn" onClick={() => { setIsMobileMenuOpen(false); navigate('/admin'); }} type="button">
                  <i className="fas fa-shield-alt"></i> Admin Dashboard
                </button>
              )}
              <button className="drawer-action-btn danger" onClick={handleLogout} type="button">
                <i className="fas fa-sign-out-alt"></i> Đăng xuất
              </button>
            </>
          ) : (
            <button className="drawer-action-btn primary" onClick={handleStartClick} type="button">
              <i className="fas fa-sign-in-alt"></i> Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Pill Navbar */}
      <div className="workspace-pill-nav">
        <div className="wp-nav-left" onClick={() => handleNavClick('/')} style={{ cursor: 'pointer' }}>
          <img className="wp-brand-logo" src={logoImage} alt="CollabTask" />
        </div>

        {/* Desktop nav center */}
        <div className="wp-nav-center desktop-only">
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

        {/* Desktop right */}
        <div className="wp-nav-right desktop-only">
          {isAuthenticated ? (
            <div className="wp-account-trigger" onClick={() => setShowUserMenu(!showUserMenu)} ref={userMenuRef}>
              <div className="wp-avatar">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="User" />
                ) : (
                  <span>{(user?.username || user?.full_name || 'A').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="wp-account-name">{user?.full_name || user?.username || 'Account'}</span>
              <i className={`fas fa-chevron-down wp-account-arrow ${showUserMenu ? 'open' : ''}`}></i>
              {showUserMenu && (
                <div className="wp-user-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="wp-user-info">
                    <div className="wp-user-name">{user?.username || user?.full_name}</div>
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
          ) : (
            <button className="ld-btn-start glow-btn" onClick={handleStartClick}>Đăng nhập</button>
          )}
        </div>

        {/* Mobile: hamburger only */}
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)} type="button">
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div style={{ height: '90px' }}></div>

      <section className="ld-hero-section">
        <div className="hero-glow-orb orb-1"></div>
        <div className="hero-glow-orb orb-2"></div>

        <div className="ld-hero-left">
          <h1 
            className="ld-hero-title"
            style={{
              fontFamily: currentSettings.titleFontFamily,
              fontSize: `${currentSettings.titleFontSize}px`,
              fontWeight: currentSettings.titleFontWeight,
            }}
          >
            {currentSettings.heroTitle1}<br />
            <span 
              className="ld-hero-highlight"
              style={{
                background: `linear-gradient(135deg, ${currentSettings.highlightColor1} 0%, ${currentSettings.highlightColor2} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: currentSettings.highlightColor1
              }}
            >
              {currentSettings.heroTitleHighlight}
            </span>
          </h1>
          <p className="ld-hero-desc">
            {currentSettings.heroDesc}
          </p>
          <div className="ld-hero-actions">
            <button className="ld-btn-primary glow-btn" onClick={handleStartClick} type="button">
              {currentSettings.heroCtaText} <i className="fas fa-arrow-right"></i>
            </button>
            <button className="ld-btn-secondary glass-btn" type="button" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Xem tính năng
            </button>
          </div>
        </div>
        <div className="ld-hero-right">
          <div className="ld-hero-image-wrapper float-anim">
            <div className="glass-reflection"></div>
            <div className="ld-hero-slider">
              {heroSlides.map((slide, index) => (
                <img
                  key={index}
                  src={slide}
                  alt={`Dashboard slide ${index + 1}`}
                  className={`ld-dashboard-img slide-img ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
            <div className="ld-hero-slider-dots">
              {heroSlides.map((_, index) => (
                <div
                  key={index}
                  className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></div>
              ))}
            </div>
            <div className="ld-hero-badge float-anim-delayed">
              <div className="badge-icon"><i className="fas fa-bolt"></i></div>
              <div className="badge-text">
                <span>HIỆU SUẤT</span>
                <strong>+142%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ld-features-section" id="features">
        <div className="ld-features-header">
          <h2 className="reveal-text">{currentSettings.featuresTitle}</h2>
          <p>{currentSettings.featuresDesc}</p>
        </div>

        <div className="ld-features-grid">
          {displayFeatureCards.map((card, index) => (
            <div className={`ld-feature-card ${index === 1 ? 'image-card' : 'glass-card'} hover-lift`} key={card.title}>
              {index === 1 ? (
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" alt="Team collaboration" />
              ) : (
                <>
                  <div className="ld-fc-icon pulse-icon"><i className={`fas ${card.icon}`}></i></div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="ld-workflow-section">
        <div className="ld-workflow-copy">
          <span className="ld-section-label">Luồng làm việc</span>
          <h2>Từ ý tưởng đến báo cáo, mọi thứ đi cùng một nhịp.</h2>
          <p>
            Không cần nhảy giữa nhiều công cụ. Bạn tạo việc, giao việc, cập nhật trạng thái và đọc báo cáo ngay trong hệ thống.
          </p>
          <div className="ld-workflow-list">
            {workflowSteps.map((step, index) => (
              <div className="ld-workflow-item" key={step.title}>
                <span>{`0${index + 1}`}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ld-workflow-visual">
          <div className="ld-workflow-panel">
            <img src={Slide2} alt="Task board preview" />
          </div>
          <div className="ld-workflow-panel secondary">
            <img src={Slide3} alt="Reports preview" />
          </div>
        </div>
      </section>

      <section className="ld-role-section">
        <div className="ld-features-header compact">
          <h2 className="reveal-text">Thiết kế cho từng vai trò</h2>
          <p>Mỗi người trong team thấy đúng thứ họ cần để làm việc nhanh hơn, không bị ngợp thông tin.</p>
        </div>
        <div className="ld-role-grid">
          {roleCards.map((role) => (
            <div className="ld-role-card" key={role.title}>
              <i className={`fas ${role.icon}`}></i>
              <h3>{role.title}</h3>
              <p>{role.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ld-stats-section">
        <div className="ld-stat-item">
          <h3>{currentSettings.stat1Value}</h3>
          <p>{currentSettings.stat1Label}</p>
        </div>
        <div className="ld-stat-item">
          <h3>{currentSettings.stat2Value}</h3>
          <p>{currentSettings.stat2Label}</p>
        </div>
        <div className="ld-stat-item">
          <h3>{currentSettings.stat3Value}</h3>
          <p>{currentSettings.stat3Label}</p>
        </div>
        <div className="ld-stat-item">
          <h3>15M</h3>
          <p>TASK ĐÃ XỬ LÝ</p>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section id="events" className="ld-events-section">
        <div className="ld-section-header">

          <h2>Sự Kiện Sắp Diễn Ra</h2>
          <p>Tham gia cộng đồng, cập nhật xu hướng và kỹ năng mới.</p>
        </div>
        <div className="ld-events-grid">
          {eventsList.map(item => (
            <div key={item.id} className="ld-event-card">
              <div className="ld-event-image" style={{ backgroundImage: `url(${item.image})` }}>
                <span className="ld-event-type">{item.type}</span>
              </div>
              <div className="ld-event-info">
                <div className="ld-event-date"><i className="far fa-calendar-alt"></i> {item.date}</div>
                <h3>{item.title}</h3>
                <button className="ld-event-btn">Xem Chi Tiết <i className="fas fa-arrow-right"></i></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWS SECTION */}
      <section id="news" className="ld-news-section">
        <div className="ld-section-header">

          <h2>Cập Nhật Mới Nhất</h2>
          <p>Theo dõi tiến trình phát triển và các thông báo từ đội ngũ.</p>
        </div>
        <div className="ld-news-grid">
          {newsList.map(item => (
            <div key={item.id} className="ld-news-card">
              <div className="ld-news-image" style={{ backgroundImage: `url(${item.image})` }}>
                <span className="ld-news-category">{item.category}</span>
              </div>
              <div className="ld-news-info">
                <h3>{item.title}</h3>
                <button className="ld-news-link">Đọc thêm <i className="fas fa-arrow-right"></i></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ld-cta-section">
        <div className="cta-glow-bg"></div>
        <h2 className="reveal-text">Sẵn sàng làm việc rõ ràng hơn?</h2>
        <p>Tạo workspace đầu tiên và đưa cả đội vào cùng một luồng phối hợp.</p>
        <div className="ld-cta-actions">
          <button className="ld-btn-primary glow-btn" onClick={handleStartClick} type="button">Bắt đầu miễn phí</button>
          <button className="ld-btn-secondary glass-btn" type="button" onClick={() => navigate('/contact')}>Liên hệ</button>
        </div>
      </section>

      <footer className="ld-footer">
        <div className="ld-footer-left">
          <img className="ld-brand-logo footer-logo" src={logoImage} alt="CollabTask" />
          <p>Nền tảng quản lý dự án và cộng tác nhóm</p>
        </div>
        <div className="ld-footer-links">
          <span onClick={() => handleNavClick('#features')}>Tính năng</span>
          <span onClick={() => handleNavClick('#features')}>Quy trình</span>
          <span onClick={() => handleNavClick('#events')}>Sự kiện</span>
          <span onClick={() => handleNavClick('#news')}>Tin tức</span>
        </div>
        <div className="ld-footer-right">
          <p>{currentSettings.footerText}</p>
        </div>
      </footer>
    </main>
  );
};

export default InforLayout;