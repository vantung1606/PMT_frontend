import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import './Services.css'
import imgBgr from '../../assets/img/ai-5202865_1920.jpg'

const Services = () => {
  return (
    <div className="container">
      {/* Background Image */}
      <div className="page-bgr">
        <img src={imgBgr} alt="background"/>
      </div>

      <Header />
      
      <div className="services-page">
        {/* Hero Section */}
        <section className="services-hero">
          <div className="services-hero-content">
            <p className="services-title">Dịch Vụ Của Chúng Tôi</p>
            <p className="services-subtitle">
              Giải pháp toàn diện cho quản lý dự án và cộng tác nhóm hiệu quả
            </p>
          </div>
        </section>

        {/* Main Features */}
        <section className="services-section">
          <div className="services-container">
            <h2 className="section-title-center">Tính Năng Chính</h2>
            <div className="features-grid">
              
              {/* Project Management */}
              <div className="feature-card feature-card-large">
                <div className="feature-icon">
                  <i className="fa-solid fa-diagram-project"></i>
                </div>
                <h3 className="feature-title">Quản Lý Dự Án</h3>
                <p className="feature-description">
                  Tạo, theo dõi và quản lý dự án một cách có tổ chức. Phân chia công việc 
                  thành các task nhỏ, thiết lập deadline và ưu tiên công việc hiệu quả.
                </p>
                <ul className="feature-list">
                  <li><i className="fa-solid fa-check"></i> Tạo và quản lý nhiều dự án</li>
                  <li><i className="fa-solid fa-check"></i> Theo dõi tiến độ thời gian thực</li>
                  <li><i className="fa-solid fa-check"></i> Phân loại theo trạng thái</li>
                  <li><i className="fa-solid fa-check"></i> Báo cáo chi tiết</li>
                </ul>
              </div>

              {/* Task Management */}
              <div className="feature-card feature-card-large">
                <div className="feature-icon">
                  <i className="fa-solid fa-list-check"></i>
                </div>
                <h3 className="feature-title">Quản Lý Task</h3>
                <p className="feature-description">
                  Phân công nhiệm vụ cho từng thành viên, thiết lập deadline và theo dõi 
                  tiến độ hoàn thành công việc một cách rõ ràng và minh bạch.
                </p>
                <ul className="feature-list">
                  <li><i className="fa-solid fa-check"></i> Phân công task linh hoạt</li>
                  <li><i className="fa-solid fa-check"></i> Đặt mức độ ưu tiên</li>
                  <li><i className="fa-solid fa-check"></i> Nhận xét và feedback</li>
                  <li><i className="fa-solid fa-check"></i> Thông báo tự động</li>
                </ul>
              </div>

              {/* Team Collaboration */}
              <div className="feature-card">
                <div className="feature-icon-small">
                  <i className="fa-solid fa-users-line"></i>
                </div>
                <h3 className="feature-title-small">Cộng Tác Nhóm</h3>
                <p className="feature-description-small">
                  Chat trực tiếp, chia sẻ file và cập nhật thông tin nhanh chóng 
                  giữa các thành viên trong team.
                </p>
              </div>

              {/* Real-time Notifications */}
              <div className="feature-card">
                <div className="feature-icon-small">
                  <i className="fa-solid fa-bell"></i>
                </div>
                <h3 className="feature-title-small">Thông Báo Thời Gian Thực</h3>
                <p className="feature-description-small">
                  Nhận thông báo ngay lập tức về mọi thay đổi quan trọng trong dự án 
                  và task được giao.
                </p>
              </div>

              {/* Reports & Analytics */}
              <div className="feature-card">
                <div className="feature-icon-small">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <h3 className="feature-title-small">Báo Cáo & Phân Tích</h3>
                <p className="feature-description-small">
                  Xem báo cáo chi tiết về tiến độ dự án, hiệu suất làm việc của team 
                  và các số liệu quan trọng.
                </p>
              </div>

              {/* AI Assistant */}
              <div className="feature-card">
                <div className="feature-icon-small">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <h3 className="feature-title-small">Trợ Lý AI</h3>
                <p className="feature-description-small">
                  Chatbot AI thông minh hỗ trợ trả lời câu hỏi, đưa ra gợi ý và 
                  giúp bạn làm việc hiệu quả hơn.
                </p>
              </div>

              {/* Document Management */}
              <div className="feature-card">
                <div className="feature-icon-small">
                  <i className="fa-solid fa-folder-open"></i>
                </div>
                <h3 className="feature-title-small">Quản Lý Tài Liệu</h3>
                <p className="feature-description-small">
                  Lưu trữ và quản lý tài liệu dự án tập trung, dễ dàng tìm kiếm 
                  và chia sẻ với team.
                </p>
              </div>

              {/* Role Management */}
              <div className="feature-card">
                <div className="feature-icon-small">
                  <i className="fa-solid fa-user-shield"></i>
                </div>
                <h3 className="feature-title-small">Phân Quyền Linh Hoạt</h3>
                <p className="feature-description-small">
                  Quản lý quyền truy cập và vai trò của từng thành viên trong 
                  workspace và dự án.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Workspace Features */}
        <section className="services-section services-workspace">
          <div className="services-container">
            <h2 className="section-title-center">Không Gian Làm Việc (Workspace)</h2>
            <p className="section-subtitle-center">
              Tạo nhiều workspace độc lập cho từng tổ chức, phòng ban hoặc dự án lớn
            </p>
            <div className="workspace-features">
              <div className="workspace-card">
                <div className="workspace-number">01</div>
                <h3 className="workspace-title">Tách Biệt Hoàn Toàn</h3>
                <p className="workspace-text">
                  Mỗi workspace có dữ liệu, thành viên và quyền hạn riêng biệt, 
                  đảm bảo bảo mật và tổ chức tốt nhất.
                </p>
              </div>
              <div className="workspace-card">
                <div className="workspace-number">02</div>
                <h3 className="workspace-title">Quản Lý Thành Viên</h3>
                <p className="workspace-text">
                  Mời thành viên, phân quyền (Admin, PM, Team Leader, Member) và 
                  quản lý access một cách dễ dàng.
                </p>
              </div>
              <div className="workspace-card">
                <div className="workspace-number">03</div>
                <h3 className="workspace-title">Tùy Biến Theo Nhu Cầu</h3>
                <p className="workspace-text">
                  Tùy chỉnh workflow, status task và cấu hình phù hợp với 
                  quy trình làm việc của tổ chức bạn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="services-section">
          <div className="services-container">
            <div className="security-content">
              <div className="security-text">
                <h2 className="section-title">Bảo Mật & Hiệu Suất</h2>
                <p className="section-text">
                  Chúng tôi cam kết bảo vệ dữ liệu của bạn với các tiêu chuẩn bảo mật cao nhất
                </p>
                <div className="security-list">
                  <div className="security-item">
                    <i className="fa-solid fa-lock"></i>
                    <div>
                      <h4>Mã Hóa Dữ Liệu</h4>
                      <p>Tất cả dữ liệu được mã hóa end-to-end</p>
                    </div>
                  </div>
                  <div className="security-item">
                    <i className="fa-solid fa-database"></i>
                    <div>
                      <h4>Backup Tự Động</h4>
                      <p>Sao lưu dữ liệu tự động hàng ngày</p>
                    </div>
                  </div>
                  <div className="security-item">
                    <i className="fa-solid fa-gauge-high"></i>
                    <div>
                      <h4>Hiệu Suất Cao</h4>
                      <p>Hệ thống tối ưu, phản hồi nhanh chóng</p>
                    </div>
                  </div>
                  <div className="security-item">
                    <i className="fa-solid fa-cloud"></i>
                    <div>
                      <h4>Cloud Infrastructure</h4>
                      <p>Hạ tầng đám mây ổn định và mở rộng linh hoạt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="services-cta">
          <div className="services-container">
            <h2 className="cta-title">Bắt Đầu Ngay Hôm Nay</h2>
            <p className="cta-text">
              Dùng thử miễn phí 30 ngày với đầy đủ tính năng, không cần thẻ tín dụng
            </p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => window.location.href = '/register'}>
                Đăng Ký Miễn Phí
              </button>
              <button className="btn-secondary" onClick={() => window.location.href = '/contact'}>
                Liên Hệ Sales
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default Services

