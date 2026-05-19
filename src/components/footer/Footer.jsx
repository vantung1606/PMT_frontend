import "../../components/footer/Footer.css";

const Footer = () => {
	return (
		<div className="footer-container">
			
			<footer className="footer-section">
				<div className="footer-content">
					{/* Company Info */}
					<div className="footer-column">
						<h3 className="footer-brand">TASK HUB</h3>
						<p className="footer-description">
							Hệ thống quản lý công việc chuyên nghiệp dành cho nhóm freelancer.
						</p>
						<div className="footer-contact">
							<p>Email: 19102003kien@gmail.com</p>
							<p>Số điện thoại: 0905731260</p>
						</div>
					</div>

					{/* Links */}
					<div className="footer-column">
						<h4 className="footer-heading">Liên Kết</h4>
						<ul className="footer-links">
							<li>
								<a href="/">Trang Chủ</a>
							</li>
							<li>
								<a href="/">Tính Năng</a>
							</li>
							<li>
								<a href="/">Vai Trò</a>
							</li>
							<li>
								<a href="/">Công Nghệ</a>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div className="footer-column">
						<h4 className="footer-heading">Hỗ Trợ</h4>
						<ul className="footer-links">
							<li>
								<a href="/learn-more">Hướng Dẫn</a>
							</li>
							<li>
								<a href="/contact">Liên Hệ</a>
							</li>
							<li>
								<a href="/contact">Trợ Giúp</a>
							</li>
						</ul>
					</div>

					{/* Social Media */}
					<div className="footer-column">
						<h4 className="footer-heading">Liên Hệ</h4>
						<ul className="footer-links">
							<li>
								<a href="https://www.facebook.com/abc.abcxz/">Facebook</a>
							</li>
							<li>
								<a href="https://zalo.me/0905731260">Zalo</a>
							</li>
							<li>
								<a href="https://www.instagram.com/_n.v.k.03/">Instagram</a>
							</li>
							<li>
								<a href="/">WhatsApp</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className="footer-copyright">
					<p>Copyright ©2025 - Bản quyền thuộc về Nguyễn Văn Kiện - キエン</p>
				</div>
			</footer>
		</div>
	);
};

export default Footer;
