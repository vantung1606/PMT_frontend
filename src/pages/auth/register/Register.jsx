import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./Register.css";

const Register = () => {
	const navigate = useNavigate();
	const { register } = useAuth();
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		role: "mb",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Auto-hide error notification after 5 seconds
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError("");
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Validation cơ bản cho mật khẩu xác nhận
		if (formData.password !== formData.confirmPassword) {
			setError("Mật khẩu xác nhận không khớp");
			setLoading(false);
			return;
		}

		try {
			// Loại bỏ confirmPassword trước khi gửi lên server
			const { confirmPassword, ...userData } = formData;
			await register(userData);
			// Đăng ký thành công, chuyển hướng về home
			navigate("/", { replace: true });
		} catch (error) {
			setError(error.message || "Có lỗi xảy ra khi đăng ký");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleRegister = () => {
		// Xử lý đăng ký Google
		console.log("Google register");
	};

	const handleFacebookRegister = () => {
		// Xử lý đăng ký Facebook
		console.log("Facebook register");
	};

	return (
		<div className="reg-container">
			{/* Error notification */}
			{error && (
				<div className="error-notification">
					<div className="error-content">
						<span className="error-icon">⚠️</span>
						<span className="error-message">{error}</span>
						<button className="error-close" onClick={() => setError("")}>
							✕
						</button>
					</div>
				</div>
			)}

			<div className="reg-card">
				<div className="reg-header">
					<h2>Đăng Ký</h2>
				</div>

				<form onSubmit={handleSubmit} className="reg-form">
					<div className="form-infor-user">
						<div className="reg-group">
							<label htmlFor="username">Tên người dùng</label>
							<input
								type="text"
								id="username"
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								placeholder="Nhập tên người dùng"
								required
							/>
						</div>

						<div className="reg-group">
							<label htmlFor="phone">Số điện thoại</label>
							<input
								type="tel"
								id="phone"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
								placeholder="Nhập số điện thoại"
							/>
						</div>
					</div>

					<div className="reg-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="Nhập email của bạn"
							required
						/>
					</div>
					<div className="reg-group">
						<label htmlFor="password">Mật khẩu</label>
						<div className="reg-password-container">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								placeholder="Nhập mật khẩu"
								required
							/>
							<button
								type="button"
								className="reg-password-toggle"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? "👁️" : "👁️‍🗨️"}
							</button>
						</div>
					</div>

					<div className="reg-group">
						<label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
						<div className="reg-password-container">
							<input
								type={showConfirmPassword ? "text" : "password"}
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleInputChange}
								placeholder="Nhập lại mật khẩu"
								required
							/>
							<button
								type="button"
								className="reg-password-toggle"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							>
								{showConfirmPassword ? "👁️" : "👁️‍🗨️"}
							</button>
						</div>
					</div>

					<div className="reg-group full-width">
						<button type="submit" className="reg-button" disabled={loading}>
							{loading ? "Đang đăng ký..." : "Đăng Ký"}
						</button>
					</div>
				</form>

				<div className="reg-divider">
					<span>Hoặc đăng ký bằng</span>
				</div>

				<div className="reg-social">
					<button
						type="button"
						className="reg-social-btn reg-google-btn"
						onClick={handleGoogleRegister}
					>
						<svg className="reg-social-icon" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Google
					</button>

					<button
						type="button"
						className="reg-social-btn reg-facebook-btn"
						onClick={handleFacebookRegister}
					>
						<svg className="reg-social-icon" viewBox="0 0 24 24">
							<path
								fill="#1877F2"
								d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
							/>
						</svg>
						Facebook
					</button>
				</div>

				<div className="reg-footer">
					<p>
						Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
