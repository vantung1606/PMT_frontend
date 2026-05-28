import "../inforLayout/InforLayout.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const InforLayout = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [contactForm, setContactForm] = useState({
		name: "",
		email: "",
		phone: "",
		message: ""
	});
	const [submitted, setSubmitted] = useState(false);

	const handleStartClick = () => {
		if (isAuthenticated) {
			navigate('/projects');
		} else {
			navigate('/login');
		}
	};

	useEffect(() => {
		if (window.location.hash) {
			const sectionId = window.location.hash.replace("#", "");
			setTimeout(() => scrollToSection(sectionId), 100);
		}
	}, []);

	const scrollToSection = (sectionId) => {
		document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const handleContactChange = (event) => {
		const { name, value } = event.target;
		setContactForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleContactSubmit = (event) => {
		event.preventDefault();
		setSubmitted(true);
		setContactForm({ name: "", email: "", phone: "", message: "" });
		setTimeout(() => setSubmitted(false), 3000);
	};

	return (
		<main className="landing-page">
			<section id="home" className="landing-hero">
				<div className="landing-container landing-hero-inner">
					<p className="landing-eyebrow">COLLABTASK</p>
					<h1 className="landing-hero-title">Quản lý công việc rõ ràng cho đội nhóm freelancer</h1>
					<p className="landing-hero-description">
						Tổ chức dự án, phân công task, trao đổi realtime và theo dõi tiến độ trong một
						workspace thống nhất. CollabTask giúp đội nhóm làm việc mạch lạc hơn từ lúc lên
						kế hoạch đến khi bàn giao.
					</p>
					<div className="landing-hero-actions">
						<button className="landing-btn landing-btn-primary" onClick={handleStartClick}>
							Bắt đầu ngay
						</button>
						<button className="landing-btn landing-btn-secondary" onClick={() => scrollToSection("services")}>
							Xem tính năng
						</button>
					</div>
				</div>
			</section>

			<section id="about" className="landing-section landing-about">
				<div className="landing-container landing-split">
					<div>
						<p className="landing-section-label">Giới thiệu</p>
						<h2 className="landing-section-title">Một nơi để đội nhóm nhìn rõ toàn bộ công việc</h2>
					</div>
					<div className="landing-copy">
						<p>
							CollabTask được xây dựng để giảm sự rời rạc khi quản lý dự án: kế hoạch nằm
							một nơi, task nằm một nơi, trao đổi nằm một nơi khác. Tất cả được đưa về cùng
							một workspace để nhóm dễ phối hợp và ra quyết định.
						</p>
						<p>
							Sản phẩm phù hợp với nhóm freelancer, team nhỏ và các đơn vị cần theo dõi nhiều
							dự án song song nhưng vẫn muốn giữ quy trình nhẹ, rõ quyền và dễ sử dụng.
						</p>
					</div>
				</div>
				<div className="landing-container landing-stats">
					<div>
						<strong>Workspace</strong>
						<span>Tách riêng dữ liệu và thành viên theo từng nhóm làm việc.</span>
					</div>
					<div>
						<strong>Realtime</strong>
						<span>Bình luận, thông báo và cập nhật tiến độ được đồng bộ nhanh.</span>
					</div>
					<div>
						<strong>Role-based</strong>
						<span>Phân quyền PM, TL, member và client theo đúng trách nhiệm.</span>
					</div>
				</div>
			</section>

			<section id="services" className="landing-section landing-services">
				<div className="landing-container">
					<div className="landing-section-heading">
						<p className="landing-section-label">Dịch vụ</p>
						<h2 className="landing-section-title">Tính năng phục vụ toàn bộ vòng đời dự án</h2>
						<p className="landing-section-description">
							Từ tạo workspace, quản lý project, phân công task đến báo cáo và hỗ trợ AI,
							CollabTask giữ cho mọi việc có trạng thái rõ ràng.
						</p>
					</div>

					<div className="landing-service-grid">
						<div className="landing-service-card">
							<i className="fa-solid fa-diagram-project"></i>
							<h3>Quản lý dự án</h3>
							<p>Tạo project, đặt trạng thái, deadline, thành viên phụ trách và theo dõi tiến độ tổng thể.</p>
						</div>
						<div className="landing-service-card">
							<i className="fa-solid fa-list-check"></i>
							<h3>Quản lý task</h3>
							<p>Chia nhỏ công việc, phân công người thực hiện, cập nhật tiến độ và trạng thái task.</p>
						</div>
						<div className="landing-service-card">
							<i className="fa-solid fa-comments"></i>
							<h3>Trao đổi realtime</h3>
							<p>Bình luận theo task hoặc project, hỗ trợ typing indicator và cập nhật tức thời.</p>
						</div>
						<div className="landing-service-card">
							<i className="fa-solid fa-users-gear"></i>
							<h3>Phân quyền thành viên</h3>
							<p>Quản lý vai trò trong workspace để kiểm soát quyền xem, chỉnh sửa và quản lý nhóm.</p>
						</div>
						<div className="landing-service-card">
							<i className="fa-solid fa-bell"></i>
							<h3>Thông báo</h3>
							<p>Nhận nhắc nhở và cập nhật quan trọng khi có thay đổi liên quan đến công việc.</p>
						</div>
						<div className="landing-service-card">
							<i className="fa-solid fa-chart-line"></i>
							<h3>Báo cáo</h3>
							<p>Theo dõi hiệu suất dự án, task theo tháng, hoạt động người dùng và tiến độ theo project.</p>
						</div>
						<div className="landing-service-card">
							<i className="fa-solid fa-robot"></i>
							<h3>AI Assistant</h3>
							<p>Hỗ trợ hỏi đáp, gợi ý task và giúp nhóm xử lý thông tin dự án nhanh hơn.</p>
						</div>
					</div>
				</div>
			</section>

			<section id="contact" className="landing-section landing-contact">
				<div className="landing-container landing-contact-grid">
					<div>
						<p className="landing-section-label">Liên hệ</p>
						<h2 className="landing-section-title">Trao đổi với CollabTask</h2>
						<p className="landing-section-description">
							Bạn cần triển khai cho nhóm, muốn góp ý sản phẩm hoặc cần hỗ trợ kỹ thuật?
							Gửi thông tin, chúng tôi sẽ phản hồi sớm nhất.
						</p>
						<div className="landing-contact-list">
							<p><i className="fa-solid fa-location-dot"></i> 02 Đường Hòa An 10, An Khê, Đà Nẵng</p>
							<p><i className="fa-solid fa-phone"></i> +84 354 301 301</p>
							<p><i className="fa-solid fa-envelope"></i> tungnv.backend@gmail.com</p>
							<p><i className="fa-solid fa-clock"></i> Thứ 2 - Thứ 6, 8:00 - 18:00</p>
						</div>
					</div>

					<form className="landing-contact-form" onSubmit={handleContactSubmit}>
						{ submitted && <div className="landing-form-success">Đã ghi nhận thông tin liên hệ.</div> }
						<label>
							Họ và tên
							<input name="name" value={contactForm.name} onChange={handleContactChange} required />
						</label>
						<label>
							Email
							<input name="email" type="email" value={contactForm.email} onChange={handleContactChange} required />
						</label>
						<label>
							Số điện thoại
							<input name="phone" value={contactForm.phone} onChange={handleContactChange} />
						</label>
						<label>
							Nội dung
							<textarea name="message" rows="5" value={contactForm.message} onChange={handleContactChange} required />
						</label>
						<button type="submit">Gửi thông tin</button>
					</form>
				</div>
			</section>
		</main>
	);
};

export default InforLayout;
