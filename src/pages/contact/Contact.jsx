import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import './Contact.css'
import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement actual form submission to backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    }, 3000)
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
      
      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <p className="contact-title">Liên Hệ Với Chúng Tôi</p>
            <p className="contact-subtitle">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy để lại thông tin, chúng tôi sẽ phản hồi sớm nhất!
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="contact-section">
          <div className="contact-container">
            <div className="contact-grid">
              
              {/* Contact Information */}
              <div className="contact-info">
                <h2 className="info-title">Thông Tin Liên Hệ</h2>
                <p className="info-description">
                  Liên hệ với chúng tôi qua các kênh dưới đây hoặc điền form bên phải
                </p>

                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="method-icon">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div className="method-content">
                      <h3 className="method-title">Địa Chỉ</h3>
                      <p className="method-text">
                        02 Đường Hòa An 10, phường An Khuê<br />
                        TP. Đà Nẵng, Việt Nam
                      </p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="method-icon">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="method-content">
                      <h3 className="method-title">Điện Thoại</h3>
                      <p className="method-text">
                        Hotline: +84 354 301 301<br />
                        Support: +84 354 301 301<br />
                        (8:00 - 22:00 mỗi ngày)
                      </p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="method-icon">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="method-content">
                      <h3 className="method-title">Email</h3>
                      <p className="method-text">
                        Info: tungnv.backend@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="method-icon">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <div className="method-content">
                      <h3 className="method-title">Giờ Làm Việc</h3>
                      <p className="method-text">
                        Thứ 2 - Thứ 6: 8:00 - 18:00<br />
                        Thứ 7: 8:00 - 12:00<br />
                        Chủ Nhật: Nghỉ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="social-section">
                  <h3 className="social-title">Kết Nối Với Chúng Tôi</h3>
                  <div className="social-links">
                    <a href="#" className="social-link">
                      <i className="fa-brands fa-facebook"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-wrapper">
                <div className="contact-form-card">
                  <h2 className="form-title">Gửi Tin Nhắn</h2>
                  
                  {submitted ? (
                    <div className="success-message">
                      <i className="fa-solid fa-circle-check"></i>
                      <h3>Gửi Thành Công!</h3>
                      <p>Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                    </div>
                  ) : (
                    <form className="contact-form" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          Họ và Tên <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-input"
                          placeholder="Nhập họ và tên của bạn"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="email" className="form-label">
                            Email <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="phone" className="form-label">
                            Số Điện Thoại
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="form-input"
                            placeholder="0123456789"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="subject" className="form-label">
                          Chủ Đề <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          className="form-input"
                          placeholder="Tiêu đề tin nhắn"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="message" className="form-label">
                          Nội Dung <span className="required">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          className="form-textarea"
                          rows="6"
                          placeholder="Nhập nội dung tin nhắn của bạn..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>

                      <button type="submit" className="form-submit">
                        <i className="fa-solid fa-paper-plane"></i>
                        Gửi Tin Nhắn
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="contact-container">
            <h2 className="section-title-center">Câu Hỏi Thường Gặp</h2>
            <div className="faq-grid">
              <div className="faq-card">
                <div className="faq-icon">
                  <i className="fa-solid fa-circle-question"></i>
                </div>
                <h3 className="faq-question">CogniSync có miễn phí không?</h3>
                <p className="faq-answer">
                  Chúng tôi cung cấp gói dùng thử miễn phí 30 ngày với đầy đủ tính năng. 
                  Sau đó bạn có thể chọn gói phù hợp với nhu cầu.
                </p>
              </div>

              <div className="faq-card">
                <div className="faq-icon">
                  <i className="fa-solid fa-circle-question"></i>
                </div>
                <h3 className="faq-question">Có giới hạn số thành viên không?</h3>
                <p className="faq-answer">
                  Tùy vào gói sử dụng, bạn có thể mời từ 10 đến không giới hạn thành viên 
                  vào workspace của mình.
                </p>
              </div>

              <div className="faq-card">
                <div className="faq-icon">
                  <i className="fa-solid fa-circle-question"></i>
                </div>
                <h3 className="faq-question">Dữ liệu có được bảo mật không?</h3>
                <p className="faq-answer">
                  Tất cả dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế. 
                  Chúng tôi cam kết không chia sẻ thông tin của bạn.
                </p>
              </div>

              <div className="faq-card">
                <div className="faq-icon">
                  <i className="fa-solid fa-circle-question"></i>
                </div>
                <h3 className="faq-question">Làm sao để bắt đầu?</h3>
                <p className="faq-answer">
                  Đơn giản chỉ cần đăng ký tài khoản, tạo workspace và mời thành viên. 
                  Chúng tôi có hướng dẫn chi tiết cho người mới.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className="map-section">
          <div className="map-container">
            <iframe
              title="CogniSync Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.144967111796!2d108.17492627416863!3d16.057965384619912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142191abe321c91%3A0x6bb1db7fe9abc543!2zSMOyYSBBbiAxMCwgSMOyYSBBbiwgQ-G6qW0gTOG7hywgxJDDoCBO4bq1bmcgNTUwMDAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1765074897252!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default Contact

