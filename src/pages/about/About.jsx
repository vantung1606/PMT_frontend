import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import './About.css'

const About = () => {
  return (
    <div className="container">
      <Header />

      <main className="about-page">
        <section className="about-hero">
          <div className="about-container">
            <p className="about-kicker">COLLABTASK</p>
            <h1 className="about-title">Quản lý dự án rõ ràng cho đội nhóm freelancer</h1>
            <p className="about-subtitle">
              CollabTask là nền tảng quản lý công việc giúp đội nhóm tổ chức dự án,
              phân công nhiệm vụ và theo dõi tiến độ rõ ràng hơn trong một không gian
              làm việc thống nhất.
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="about-container about-intro">
            <div>
              <p className="section-label">Sứ mệnh</p>
              <h2>Giúp đội nhóm làm việc mạch lạc hơn</h2>
            </div>
            <div className="about-copy">
              <p>
                Chúng tôi xây dựng CollabTask để giảm sự rời rạc trong quá trình quản
                lý dự án: thông tin nằm nhiều nơi, tiến độ khó kiểm soát và thành viên
                không luôn nhìn thấy việc cần ưu tiên.
              </p>
              <p>
                Với workspace, project, task, phân quyền, bình luận realtime và báo
                cáo, CollabTask giúp nhóm tập trung vào kết quả thay vì mất thời gian
                ghép nối thông tin thủ công.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section about-band">
          <div className="about-container">
            <div className="about-stats">
              <div>
                <strong>1K+</strong>
                <span>Dự án hoàn thành</span>
              </div>
              <div>
                <strong>5K+</strong>
                <span>Người dùng</span>
              </div>
              <div>
                <strong>50+</strong>
                <span>Tổ chức tin dùng</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Hỗ trợ</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-container">
            <div className="section-heading">
              <p className="section-label">Giá trị cốt lõi</p>
              <h2>Những nguyên tắc định hình sản phẩm</h2>
            </div>

            <div className="values-list">
              <div className="value-item">
                <span>01</span>
                <div>
                  <h3>Đơn giản để sử dụng mỗi ngày</h3>
                  <p>Giao diện tập trung vào thao tác chính, tránh làm người dùng mất thời gian học công cụ.</p>
                </div>
              </div>
              <div className="value-item">
                <span>02</span>
                <div>
                  <h3>Minh bạch trong phối hợp</h3>
                  <p>Task, người phụ trách, tiến độ và trao đổi được đặt đúng ngữ cảnh để cả nhóm dễ theo dõi.</p>
                </div>
              </div>
              <div className="value-item">
                <span>03</span>
                <div>
                  <h3>Phân quyền rõ ràng</h3>
                  <p>Vai trò PM, TL, member và client giúp kiểm soát quyền truy cập phù hợp với từng workspace.</p>
                </div>
              </div>
              <div className="value-item">
                <span>04</span>
                <div>
                  <h3>Tối ưu cho hiệu quả</h3>
                  <p>Báo cáo, thông báo và hỗ trợ AI giúp nhóm phát hiện rủi ro sớm và ra quyết định nhanh hơn.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section about-team-section">
          <div className="about-container about-team">
            <div>
              <p className="section-label">Đội ngũ</p>
              <h2>Xây dựng bởi nhóm hiểu bài toán vận hành dự án</h2>
            </div>
            <div className="team-list">
              <div>
                <h3>Product</h3>
                <p>Nghiên cứu luồng làm việc và trải nghiệm người dùng.</p>
              </div>
              <div>
                <h3>Engineering</h3>
                <p>Phát triển hệ thống, dữ liệu và tính năng realtime.</p>
              </div>
              <div>
                <h3>Support</h3>
                <p>Tiếp nhận phản hồi và hỗ trợ đội nhóm triển khai.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="about-container">
            <h2>Sẵn sàng quản lý dự án rõ ràng hơn?</h2>
            <p>Tạo workspace đầu tiên và đưa công việc của nhóm về cùng một nơi.</p>
            <div className="cta-actions">
              <button onClick={() => window.location.href = '/register'}>Bắt đầu ngay</button>
              <button onClick={() => window.location.href = '/contact'}>Liên hệ</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
