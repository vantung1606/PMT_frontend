import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import './About.css'

const About = () => {
  return (
    <div className="container">
      {/* Background Image */}
      <div className="hero-bg">
          <div className="hero-bg-gradient"></div>
          <div className="hero-bg-grid"></div>
          <div className="hero-bg-orb hero-bg-orb-1"></div>
          <div className="hero-bg-orb hero-bg-orb-2"></div>
          <div className="hero-bg-orb hero-bg-orb-3"></div>
        </div>

      <Header />
      
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <p className="about-title">Về CogniSync</p>
            <p className="about-subtitle">
              Nền tảng quản lý dự án thông minh, giúp đội ngũ của bạn làm việc hiệu quả hơn
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-content-row">
              <div className="about-text-col">
                <h2 className="section-title">Sứ Mệnh Của Chúng Tôi</h2>
                <p className="section-text">
                  CogniSync được phát triển với mục tiêu đơn giản hóa quy trình quản lý dự án, 
                  giúp các đội nhóm từ nhỏ đến lớn có thể cộng tác hiệu quả, theo dõi tiến độ 
                  công việc một cách rõ ràng và đạt được mục tiêu nhanh chóng hơn.
                </p>
                <p className="section-text">
                  Chúng tôi tin rằng sự thành công của một dự án không chỉ nằm ở công cụ, 
                  mà còn ở cách thức giao tiếp và phối hợp giữa các thành viên trong nhóm. 
                  Đó là lý do tại sao CogniSync tích hợp đầy đủ các tính năng cần thiết để 
                  hỗ trợ toàn diện cho mọi khía cạnh của quản lý dự án.
                </p>
              </div>
              <div className="about-image-col">
                <div className="about-stats">
                  <div className="stat-card">
                    <h3 className="stat-number">1000+</h3>
                    <p className="stat-label">Dự Án Hoàn Thành</p>
                  </div>
                  <div className="stat-card">
                    <h3 className="stat-number">5000+</h3>
                    <p className="stat-label">Người Dùng</p>
                  </div>
                  <div className="stat-card">
                    <h3 className="stat-number">50+</h3>
                    <p className="stat-label">Tổ Chức Tin Dùng</p>
                  </div>
                  <div className="stat-card">
                    <h3 className="stat-number">24/7</h3>
                    <p className="stat-label">Hỗ Trợ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-section about-values">
          <div className="about-container">
            <h2 className="section-title-center">Giá Trị Cốt Lõi</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
                <h3 className="value-title">Đơn Giản</h3>
                <p className="value-text">
                  Giao diện trực quan, dễ sử dụng, giúp bạn tập trung vào công việc 
                  thay vì học cách sử dụng công cụ.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fa-solid fa-users"></i>
                </div>
                <h3 className="value-title">Cộng Tác</h3>
                <p className="value-text">
                  Tạo môi trường làm việc nhóm hiệu quả với các công cụ giao tiếp 
                  và chia sẻ thông tin linh hoạt.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3 className="value-title">Bảo Mật</h3>
                <p className="value-text">
                  Dữ liệu của bạn được bảo vệ với các tiêu chuẩn bảo mật cao nhất, 
                  đảm bảo an toàn tuyệt đối.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fa-solid fa-rocket"></i>
                </div>
                <h3 className="value-title">Hiệu Quả</h3>
                <p className="value-text">
                  Tối ưu hóa quy trình làm việc, giảm thiểu thời gian quản lý, 
                  tăng năng suất cho toàn đội ngũ.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-section">
          <div className="about-container">
            <h2 className="section-title-center">Đội Ngũ Phát Triển</h2>
            <p className="section-subtitle-center">
              Được xây dựng bởi đội ngũ có đam mê với quản lý dự án và công nghệ
            </p>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-avatar">
                  <i className="fa-solid fa-user"></i>
                </div>
                <h3 className="team-name">Product Team</h3>
                <p className="team-role">Nghiên cứu & Phát triển sản phẩm</p>
              </div>
              <div className="team-card">
                <div className="team-avatar">
                  <i className="fa-solid fa-code"></i>
                </div>
                <h3 className="team-name">Engineering Team</h3>
                <p className="team-role">Phát triển & Bảo trì hệ thống</p>
              </div>
              <div className="team-card">
                <div className="team-avatar">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <h3 className="team-name">Support Team</h3>
                <p className="team-role">Hỗ trợ khách hàng 24/7</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="about-container">
            <h2 className="cta-title">Sẵn Sàng Bắt Đầu?</h2>
            <p className="cta-text">
              Tham gia cùng hàng ngàn đội nhóm đang sử dụng CogniSync để quản lý dự án hiệu quả
            </p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => window.location.href = '/register'}>
                Dùng Thử Miễn Phí
              </button>
              <button className="btn-secondary" onClick={() => window.location.href = '/contact'}>
                Liên Hệ Tư Vấn
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default About

