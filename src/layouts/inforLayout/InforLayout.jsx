import "../inforLayout/InforLayout.css";
import imgBgr from "../../assets/img/ai-5202865_1920.jpg";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const InforLayout = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const featuresSectionRef = useRef(null);
	const isScrollingRef = useRef(false);

	const handleStartClick = () => {
		if (isAuthenticated) {
			navigate('/projects');
		} else {
			navigate('/login');
		}
	};

	useEffect(() => {
		const handleScroll = (e) => {
			if (isScrollingRef.current) return;

			const scrollDirection = e.deltaY > 0 ? "down" : "up";
			const scrollPosition = window.scrollY;
			const windowHeight = window.innerHeight;

			if (scrollDirection === "down") {
				isScrollingRef.current = true;
				if (scrollPosition < windowHeight * 0.5) {
					featuresSectionRef.current?.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}
				setTimeout(() => {
					isScrollingRef.current = false;
				}, 1000);
			}
		};

		window.addEventListener("wheel", handleScroll, { passive: false });

		return () => {
			window.removeEventListener("wheel", handleScroll);
		};
	}, []);

	return (
		<div>
			<div className="container-inforLayout">
				<div className="img_bgr">
					<img src={imgBgr} alt="logo"/>
				</div>

				{/* Hero Content */}
				<div className="hero-content">
					<p className="hero-title">TASK HUB</p>
					<p className="hero-description">
						Hệ thống quản lý công việc chuyên nghiệp dành cho nhóm freelancer.
						Tối ưu hóa quy trình làm việc, tăng cường hiệu quả cộng tác và theo
						dõi tiến độ dự án một cách dễ dàng.
					</p>
					<div className="hero-buttons">
						<button className="btn_start" onClick={handleStartClick}>BẮT ĐẦU NGAY</button>
						<button className="btn_learn" onClick={() => navigate('/learn-more')}>TÌM HIỂU THÊM</button>
					</div>
				</div>

				{/* Features Section */}
				<section ref={featuresSectionRef} className="features-section">
					{/* Content Overlay */}
					<div className="features-content">
						<h2 className="features-title">Tính Năng Nổi Bật</h2>
						<div className="features-grid">
							<div className="feature-card">
								<div className="feature-icon">📊</div>
								<h3 className="feature-title">Quản Lý Dự Án</h3>
								<p className="feature-description">
									Tổ chức và theo dõi tất cả các dự án của bạn một cách hiệu
									quả. Phân chia công việc, đặt deadline và theo dõi tiến độ
									hoàn thành một cách trực quan.
								</p>
							</div>

							<div className="feature-card">
								<div className="feature-icon">✅</div>
								<h3 className="feature-title">Quản Lý Task</h3>
								<p className="feature-description">
									Tạo, phân công và quản lý các task một cách chi tiết. Thiết
									lập mức độ ưu tiên, thời gian hoàn thành và theo dõi tình
									trạng thực hiện.
								</p>
							</div>

							<div className="feature-card">
								<div className="feature-icon">💬</div>
								<h3 className="feature-title">Chat Team Task</h3>
								<p className="feature-description">
									Trao đổi thông tin nhanh chóng với đội nhóm. Thảo luận về công
									việc, chia sẻ file và phối hợp làm việc hiệu quả ngay trong hệ
									thống.
								</p>
							</div>

							<div className="feature-card">
								<div className="feature-icon">👥</div>
								<h3 className="feature-title">Phân Quyền Thành Viên</h3>
								<p className="feature-description">
									Thiết lập quyền truy cập phù hợp cho từng thành viên. Quản lý
									vai trò, phân quyền chỉnh sửa và đảm bảo tính bảo mật cho dự
									án.
								</p>
							</div>

							<div className="feature-card">
								<div className="feature-icon">🔔</div>
								<h3 className="feature-title">Thông Báo Realtime</h3>
								<p className="feature-description">
									Nhận thông báo tức thì về các thay đổi quan trọng. Cập nhật
									realtime về tiến độ công việc, tin nhắn mới và các sự kiện
									trong dự án.
								</p>
							</div>

							<div className="feature-card">
								<div className="feature-icon">📈</div>
								<h3 className="feature-title">Báo Cáo Thống Kê</h3>
								<p className="feature-description">
									Theo dõi hiệu suất làm việc qua các biểu đồ và báo cáo chi
									tiết. Phân tích năng suất, thời gian hoàn thành và chất lượng
									công việc.
								</p>
							</div>
						</div>
					</div>
				</section>

				<div className="features-cta-section">
					<div className="cta-section">
						<h2 className="cta-title">
							Sẵn sàng tối ưu hóa quy trình làm việc?
						</h2>
						<p className="cta-description">
							Tham gia TASK HUB ngay hôm nay và trải nghiệm cách quản lý công
							việc hiệu quả nhất cho nhóm freelancer của bạn.
						</p>
						<div className="cta-buttons">
							<button className="btn_start" onClick={handleStartClick}>BẮT ĐẦU NGAY</button>
							<button className="btn_learn" onClick={() => navigate('/learn-more')}>TÌM HIỂU THÊM</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InforLayout;
