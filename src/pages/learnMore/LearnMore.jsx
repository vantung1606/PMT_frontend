import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import './LearnMore.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const LearnMore = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate('/projects')
    } else {
      navigate('/register')
    }
  }

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
      
      <div className="learn-more-page">
        {/* Hero Section */}
        <section className="learn-hero">
          <div className="learn-hero-content">
            <p className="learn-title">CogniSync - Quản Lý Dự Án Thông Minh</p>
            <p className="learn-subtitle">
              Giải pháp toàn diện cho các nhóm freelancer và doanh nghiệp
            </p>
          </div>
        </section>

        {/* Why CogniSync */}
        <section className="learn-section why-section">
          <div className="learn-container">
            <h2 className="section-title-center">Tại Sao Chọn CogniSync?</h2>
            <div className="why-grid">
              <div className="why-card">
                <div className="why-icon">
                  <i className="fa-solid fa-check-double"></i>
                </div>
                <h3 className="why-title">Quản Lý Tập Trung</h3>
                <p className="why-text">
                  Tất cả dự án, task, thành viên và tài liệu được quản lý tập trung 
                  trong một nền tảng duy nhất, giúp bạn tiết kiệm thời gian và công sức.
                </p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <h3 className="why-title">Tăng Năng Suất 3X</h3>
                <p className="why-text">
                  Các nhóm sử dụng CogniSync báo cáo tăng năng suất lên đến 300% nhờ 
                  quy trình làm việc được tối ưu hóa và tự động hóa.
                </p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <i className="fa-solid fa-eye"></i>
                </div>
                <h3 className="why-title">Minh Bạch Tuyệt Đối</h3>
                <p className="why-text">
                  Mọi thành viên đều thấy rõ tiến độ dự án, công việc được giao 
                  và trách nhiệm của từng người một cách rõ ràng.
                </p>
              </div>

              <div className="why-card">
                <div className="why-icon">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </div>
                <h3 className="why-title">Theo Dõi Thời Gian Thực</h3>
                <p className="why-text">
                  Cập nhật và nhận thông báo ngay lập tức về mọi thay đổi trong 
                  dự án, đảm bảo không bỏ lỡ thông tin quan trọng.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="learn-section how-section">
          <div className="learn-container">
            <h2 className="section-title-center">Cách Hoạt Động</h2>
            <div className="how-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3 className="step-title">Tạo Workspace</h3>
                  <p className="step-text">
                    Đăng ký tài khoản và tạo workspace cho tổ chức hoặc nhóm của bạn. 
                    Bạn có thể tạo nhiều workspace cho các mục đích khác nhau.
                  </p>
                </div>
              </div>

              <div className="step-arrow">
                <i className="fa-solid fa-arrow-down"></i>
              </div>

              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3 className="step-title">Mời Thành Viên</h3>
                  <p className="step-text">
                    Mời các thành viên trong nhóm tham gia workspace. Phân quyền phù hợp 
                    (Admin, Project Manager, Team Leader, Member) cho từng người.
                  </p>
                </div>
              </div>

              <div className="step-arrow">
                <i className="fa-solid fa-arrow-down"></i>
              </div>

              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3 className="step-title">Tạo Dự Án</h3>
                  <p className="step-text">
                    Tạo các dự án mới, đặt mô tả, thời gian bắt đầu và kết thúc. 
                    Gán thành viên vào dự án và thiết lập vai trò của họ.
                  </p>
                </div>
              </div>

              <div className="step-arrow">
                <i className="fa-solid fa-arrow-down"></i>
              </div>

              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3 className="step-title">Quản Lý Task</h3>
                  <p className="step-text">
                    Chia nhỏ dự án thành các task cụ thể. Phân công cho từng thành viên, 
                    đặt deadline, mức độ ưu tiên và theo dõi tiến độ hoàn thành.
                  </p>
                </div>
              </div>

              <div className="step-arrow">
                <i className="fa-solid fa-arrow-down"></i>
              </div>

              <div className="step-item">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h3 className="step-title">Theo Dõi & Báo Cáo</h3>
                  <p className="step-text">
                    Theo dõi tiến độ thông qua dashboard và báo cáo chi tiết. 
                    Xem biểu đồ thống kê về hiệu suất làm việc của nhóm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Details */}
        <section className="learn-section features-detail-section">
          <div className="learn-container">
            <h2 className="section-title-center">Tính Năng Nổi Bật</h2>
            
            <div className="feature-detail">
              <div className="feature-detail-content">
                <div className="feature-detail-icon">
                  <i className="fa-solid fa-diagram-project"></i>
                </div>
                <h3 className="feature-detail-title">Quản Lý Dự Án Chuyên Nghiệp</h3>
                <ul className="feature-detail-list">
                  <li><i className="fa-solid fa-check"></i> Tạo và quản lý không giới hạn dự án</li>
                  <li><i className="fa-solid fa-check"></i> Phân loại dự án theo trạng thái: Planning, In Progress, Completed, On Hold</li>
                  <li><i className="fa-solid fa-check"></i> Gắn thành viên và phân quyền cho từng dự án</li>
                  <li><i className="fa-solid fa-check"></i> Theo dõi tiến độ qua thanh progress bar trực quan</li>
                  <li><i className="fa-solid fa-check"></i> Comment và thảo luận trực tiếp trên dự án</li>
                </ul>
              </div>
              <div className="feature-detail-visual">
                <div className="visual-box">
                  <i className="fa-solid fa-folder-open"></i>
                  <p>Dự Án</p>
                </div>
              </div>
            </div>

            <div className="feature-detail reverse">
              <div className="feature-detail-visual">
                <div className="visual-box">
                  <i className="fa-solid fa-list-check"></i>
                  <p>Task</p>
                </div>
              </div>
              <div className="feature-detail-content">
                <div className="feature-detail-icon">
                  <i className="fa-solid fa-tasks"></i>
                </div>
                <h3 className="feature-detail-title">Quản Lý Task Chi Tiết</h3>
                <ul className="feature-detail-list">
                  <li><i className="fa-solid fa-check"></i> Tạo task với mô tả chi tiết và deadline rõ ràng</li>
                  <li><i className="fa-solid fa-check"></i> Phân công nhiều thành viên cho một task</li>
                  <li><i className="fa-solid fa-check"></i> Đặt mức độ ưu tiên: High, Medium, Low</li>
                  <li><i className="fa-solid fa-check"></i> Trạng thái linh hoạt: Todo, In Progress, Review, Done</li>
                  <li><i className="fa-solid fa-check"></i> Comment, đính kèm file và cập nhật tiến độ</li>
                </ul>
              </div>
            </div>

            <div className="feature-detail">
              <div className="feature-detail-content">
                <div className="feature-detail-icon">
                  <i className="fa-solid fa-comments"></i>
                </div>
                <h3 className="feature-detail-title">Giao Tiếp & Cộng Tác</h3>
                <ul className="feature-detail-list">
                  <li><i className="fa-solid fa-check"></i> Chat realtime giữa các thành viên trong team</li>
                  <li><i className="fa-solid fa-check"></i> Comment trực tiếp trên task và dự án</li>
                  <li><i className="fa-solid fa-check"></i> Thông báo tức thì về mọi thay đổi quan trọng</li>
                  <li><i className="fa-solid fa-check"></i> Chia sẻ file và tài liệu dễ dàng</li>
                  <li><i className="fa-solid fa-check"></i> AI Assistant hỗ trợ 24/7</li>
                </ul>
              </div>
              <div className="feature-detail-visual">
                <div className="visual-box">
                  <i className="fa-solid fa-users"></i>
                  <p>Cộng Tác</p>
                </div>
              </div>
            </div>

            <div className="feature-detail reverse">
              <div className="feature-detail-visual">
                <div className="visual-box">
                  <i className="fa-solid fa-chart-line"></i>
                  <p>Báo Cáo</p>
                </div>
              </div>
              <div className="feature-detail-content">
                <div className="feature-detail-icon">
                  <i className="fa-solid fa-chart-pie"></i>
                </div>
                <h3 className="feature-detail-title">Báo Cáo & Phân Tích</h3>
                <ul className="feature-detail-list">
                  <li><i className="fa-solid fa-check"></i> Dashboard tổng quan về tất cả dự án</li>
                  <li><i className="fa-solid fa-check"></i> Biểu đồ thống kê task theo trạng thái</li>
                  <li><i className="fa-solid fa-check"></i> Báo cáo hiệu suất làm việc của từng thành viên</li>
                  <li><i className="fa-solid fa-check"></i> Phân tích thời gian hoàn thành công việc</li>
                  <li><i className="fa-solid fa-check"></i> Export báo cáo chi tiết</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="learn-section comparison-section">
          <div className="learn-container">
            <h2 className="section-title-center">So Sánh Trước & Sau CogniSync</h2>
            <div className="comparison-table">
              <div className="comparison-column before">
                <div className="comparison-header">
                  <i className="fa-solid fa-xmark"></i>
                  <h3>Trước Khi Dùng CogniSync</h3>
                </div>
                <ul className="comparison-list">
                  <li>
                    <i className="fa-solid fa-circle-xmark"></i>
                    <span>Dùng nhiều công cụ khác nhau, khó quản lý</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-xmark"></i>
                    <span>Thông tin rải rác, khó tìm kiếm</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-xmark"></i>
                    <span>Không rõ ai đang làm gì</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-xmark"></i>
                    <span>Thường xuyên bỏ lỡ deadline</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-xmark"></i>
                    <span>Giao tiếp qua email, chat riêng lẻ</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-xmark"></i>
                    <span>Khó theo dõi tiến độ dự án</span>
                  </li>
                </ul>
              </div>

              <div className="comparison-arrow">
                <i className="fa-solid fa-arrow-right"></i>
              </div>

              <div className="comparison-column after">
                <div className="comparison-header">
                  <i className="fa-solid fa-check"></i>
                  <h3>Sau Khi Dùng CogniSync</h3>
                </div>
                <ul className="comparison-list">
                  <li>
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Tất cả trong một nền tảng duy nhất</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Thông tin tập trung, dễ tìm kiếm</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Minh bạch tuyệt đối về công việc</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Thông báo kịp thời, không bỏ lỡ</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Giao tiếp tập trung trong hệ thống</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Theo dõi tiến độ thời gian thực</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="learn-section testimonials-section">
          <div className="learn-container">
            <h2 className="section-title-center">Khách Hàng Nói Gì Về Chúng Tôi</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="testimonial-text">
                  "CogniSync đã thay đổi hoàn toàn cách nhóm chúng tôi làm việc. 
                  Năng suất tăng gấp đôi và không còn bỏ lỡ deadline nào nữa!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="author-info">
                    <h4>Nguyễn Văn A</h4>
                    <p>Team Leader - ABC Tech</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="testimonial-text">
                  "Giao diện đơn giản, dễ sử dụng nhưng đầy đủ tính năng. 
                  Đội ngũ support nhiệt tình, phản hồi nhanh chóng!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="author-info">
                    <h4>Trần Thị B</h4>
                    <p>Project Manager - XYZ Studio</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="testimonial-text">
                  "Tính năng báo cáo rất chi tiết, giúp tôi dễ dàng đánh giá 
                  hiệu suất làm việc của team. Đáng đồng tiền bát gạo!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="author-info">
                    <h4>Lê Văn C</h4>
                    <p>CEO - StartUp DEF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="learn-cta">
          <div className="learn-container">
            <h2 className="cta-title">Bắt Đầu Hành Trình Của Bạn</h2>
            <p className="cta-text">
              Tham gia cùng hàng ngàn đội nhóm đang sử dụng CogniSync để quản lý dự án hiệu quả hơn
            </p>
            <div className="cta-features">
              <div className="cta-feature">
                <i className="fa-solid fa-check"></i>
                <span>Dùng thử miễn phí 30 ngày</span>
              </div>
              <div className="cta-feature">
                <i className="fa-solid fa-check"></i>
                <span>Không cần thẻ tín dụng</span>
              </div>
              <div className="cta-feature">
                <i className="fa-solid fa-check"></i>
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={handleStartClick}>
                <i className="fa-solid fa-rocket"></i>
                Bắt Đầu Ngay
              </button>
              <button className="btn-secondary" onClick={() => navigate('/contact')}>
                <i className="fa-solid fa-phone"></i>
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

export default LearnMore

