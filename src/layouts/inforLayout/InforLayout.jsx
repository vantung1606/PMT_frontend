import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./InforLayout.css";
import Slide1 from "../../assets/img/hero_slide_1.png";
import Slide2 from "../../assets/img/hero_slide_2.png";
import Slide3 from "../../assets/img/hero_slide_3.png";
import logoImage from "../../assets/img/logo.png";

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

const InforLayout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const userMenuRef = React.useRef(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const heroSlides = [Slide1, Slide2, Slide3];

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
    navigate(isAuthenticated ? '/workspaces' : '/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const headerLinks = [
    { label: 'TRANG CHỦ', active: true, path: '/' },
    { label: 'DỰ ÁN', active: false, path: '/workspaces' },
    { label: 'SỰ KIỆN', active: false, path: '/events' },
    { label: 'TIN TỨC', active: false, path: '/news' }
  ];

  return (
    <main className="landing-page">
      <div className="landing-pill-nav">
        <div className="ld-nav-left">
          <img className="ld-brand-logo" src={logoImage} alt="CollabTask" />
        </div>
        <div className="ld-nav-center">
          {headerLinks.map((link) => (
            <span
              key={link.label}
              className={`ld-nav-link ${link.active ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </span>
          ))}
        </div>
        <div className="ld-nav-right">
          {isAuthenticated ? (
            <div className="ld-user-profile" onClick={() => setShowUserMenu(!showUserMenu)} ref={userMenuRef}>
              <div className="ld-avatar">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="User" />
                ) : (
                  <span>{(user?.username || user?.full_name || 'A').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="ld-nav-username">{user?.full_name || user?.username || 'Admin Account'}</span>
              {showUserMenu && (
                <div className="ld-user-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="ld-user-info">
                    <div className="ld-user-name">{user?.username || user?.full_name || 'Admin Account'}</div>
                    <div className="ld-user-email">{user?.email}</div>
                  </div>
                  <div className="ld-dropdown-divider"></div>
                  {user?.role === 'admin' && (
                    <button className="ld-admin-btn" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); navigate('/admin'); }} type="button">
                      <i className="fas fa-shield-alt"></i> Admin Dashboard
                    </button>
                  )}
                  <button className="ld-logout-btn" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); handleLogout(); }} type="button">
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="ld-btn-start glow-btn" onClick={handleStartClick}>Đăng nhập</button>
          )}
        </div>
      </div>

      <section className="ld-hero-section">
        <div className="hero-glow-orb orb-1"></div>
        <div className="hero-glow-orb orb-2"></div>

        <div className="ld-hero-left">
          <h1 className="ld-hero-title">
            Quản lý dự án<br />
            <span className="ld-hero-highlight">rõ ràng cho cả đội.</span>
          </h1>
          <p className="ld-hero-desc">
            CollabTask giúp bạn tạo workspace, phân công task, trao đổi realtime và theo dõi tiến độ trong một nơi duy nhất.
          </p>
          <div className="ld-hero-actions">
            <button className="ld-btn-primary glow-btn" onClick={handleStartClick} type="button">
              Dùng thử miễn phí <i className="fas fa-arrow-right"></i>
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
          <h2 className="reveal-text">CollabTask làm được gì?</h2>
          <p>Những khối chức năng cần có để một đội nhóm làm việc gọn hơn, rõ hơn và ít đứt mạch hơn.</p>
        </div>

        <div className="ld-features-grid">
          {featureCards.map((card, index) => (
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
          <h3>500+</h3>
          <p>WORKSPACE</p>
        </div>
        <div className="ld-stat-item">
          <h3>99.9%</h3>
          <p>THỜI GIAN HOẠT ĐỘNG</p>
        </div>
        <div className="ld-stat-item">
          <h3>24/7</h3>
          <p>HỖ TRỢ</p>
        </div>
        <div className="ld-stat-item">
          <h3>15M</h3>
          <p>TASK ĐÃ XỬ LÝ</p>
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
          <span onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Tính năng</span>
          <span onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Quy trình</span>
          <span onClick={() => navigate('/events')}>Sự kiện</span>
          <span onClick={() => navigate('/news')}>Tin tức</span>
        </div>
        <div className="ld-footer-right">
          <p>© 2026 COLLABTASK. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </main>
  );
};

export default InforLayout;