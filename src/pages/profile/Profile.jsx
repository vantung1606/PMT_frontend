import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import usePermissions from '../../hooks/usePermissions';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    id_card: '',
    address: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    ethnicity: '',
    occupation: ''
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (user) {
      // Xử lý date format
      let formattedDate = '';
      if (user.date_of_birth) {
        // Nếu date có format ISO (có T), lấy phần date
        if (user.date_of_birth.includes('T')) {
          formattedDate = user.date_of_birth.split('T')[0];
        } else {
          // Nếu đã là format YYYY-MM-DD
          formattedDate = user.date_of_birth;
        }
      }

      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        id_card: user.id_card || '',
        address: user.address || '',
        date_of_birth: formattedDate,
        gender: user.gender || '',
        marital_status: user.marital_status || '',
        ethnicity: user.ethnicity || '',
        occupation: user.occupation || ''
      });

      // Set avatar preview nếu có
      if (user.avatar) {
        // Tạo URL đầy đủ cho avatar
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3036';
        const avatarUrl = user.avatar.startsWith('http') 
          ? user.avatar 
          : `${API_BASE_URL}/uploads/avatars/${user.avatar}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Chuẩn bị dữ liệu để gửi (loại bỏ các trường rỗng)
      const submitData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          // Xử lý đặc biệt cho date_of_birth
          if (key === 'date_of_birth' && formData[key]) {
            // Đảm bảo format đúng cho date
            const date = new Date(formData[key]);
            if (!isNaN(date.getTime())) {
              submitData[key] = formData[key]; // YYYY-MM-DD format
            }
          } else {
            submitData[key] = formData[key];
          }
        }
      });

      console.log('Submitting profile data:', submitData);
      console.log('Date of birth value:', submitData.date_of_birth);
      
      await updateProfile(submitData);
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Xử lý date format
    let formattedDate = '';
    if (user.date_of_birth) {
      if (user.date_of_birth.includes('T')) {
        formattedDate = user.date_of_birth.split('T')[0];
      } else {
        formattedDate = user.date_of_birth;
      }
    }

    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      id_card: user.id_card || '',
      address: user.address || '',
      date_of_birth: formattedDate,
      gender: user.gender || '',
      marital_status: user.marital_status || '',
      ethnicity: user.ethnicity || '',
      occupation: user.occupation || ''
    });
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  const handleAvatarClick = () => {
    if (avatarPreview) {
      setShowAvatarModal(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    // Reset file input để có thể chọn lại file cùng tên
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh (jpeg, jpg, png, gif, webp)');
      return;
    }

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    // Lưu avatar cũ để khôi phục nếu có lỗi
    const oldAvatarPreview = avatarPreview;

    // Tạo preview tạm thời từ file để hiển thị ngay
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.onerror = () => {
      console.error('Lỗi khi đọc file ảnh');
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setLoading(true);
      const result = await uploadAvatar(file);
      
      if (result.success && result.data?.user) {
        // Cập nhật avatar preview từ user object trong response
        // Đảm bảo sử dụng avatar từ user object, không phải từ avatarUrl
        const uploadedUser = result.data.user;
        if (uploadedUser.avatar) {
          const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3036';
          const avatarUrl = uploadedUser.avatar.startsWith('http') 
            ? uploadedUser.avatar 
            : `${API_BASE_URL}/uploads/avatars/${uploadedUser.avatar}`;
          setAvatarPreview(avatarUrl);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Avatar preview updated:', {
              avatar: uploadedUser.avatar,
              avatarUrl: avatarUrl
            });
          }
        }
        
        // Mở modal sau khi upload thành công để user có thể xem và chọn ảnh khác
        setShowAvatarModal(true);
      } else {
        throw new Error(result.message || 'Upload thất bại');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Khôi phục avatar cũ
      if (oldAvatarPreview) {
        setAvatarPreview(oldAvatarPreview);
      } else if (user?.avatar) {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3036';
        const avatarUrl = user.avatar.startsWith('http') 
          ? user.avatar 
          : `${API_BASE_URL}/uploads/avatars/${user.avatar}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(null);
      }
      
      alert('Có lỗi xảy ra khi cập nhật avatar: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleCloseModal = () => {
    setShowAvatarModal(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-back-button">
        <button onClick={handleBack} className="back-btn" title="Quay lại">
          <i className="fa-solid fa-arrow-left"></i>
          <span>Quay lại</span>
        </button>
      </div>
      
      <div className="profile-header">
        <div 
          className={`profile-avatar ${avatarPreview ? 'has-avatar' : ''}`}
          onClick={handleAvatarClick}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          {avatarPreview ? (
            <img 
              src={avatarPreview} 
              alt="Avatar" 
              className="avatar-image"
              onError={(e) => {
                console.error('Error loading avatar image');
                setAvatarPreview(null);
              }}
            />
          ) : (
            <span className="avatar-initial">
              {(user?.username || "U").slice(0, 1).toUpperCase()}
            </span>
          )}
          {!avatarPreview && (
            <div className="avatar-upload-hint">
              <i className="fa-solid fa-camera"></i>
              <span>Tải ảnh lên</span>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <div className="profile-info">
          <h1>{user?.username || "Người dùng"}</h1>
          <p className="profile-role" style={{ color: permissions.getRoleColor() }}>
            {permissions.getRoleDisplayName()}
          </p>
        </div>
        <button 
          className={`edit-btn ${isEditing ? 'cancel' : 'edit'}`}
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
        >
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Thông tin cơ bản</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Tên người dùng *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="form-group">
              <label htmlFor="id_card">Căn cước công dân</label>
              <input
                type="text"
                id="id_card"
                name="id_card"
                value={formData.id_card}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Nhập số căn cước công dân"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Nhập địa chỉ"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Thông tin cá nhân</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date_of_birth">Ngày sinh</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth ? formData.date_of_birth.split('T')[0] : ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="dd/mm/yyyy"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Không muốn tiết lộ">Không muốn tiết lộ</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="marital_status">Tình trạng hôn nhân</label>
              <select
                id="marital_status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Chọn tình trạng hôn nhân</option>
                <option value="Độc thân">Độc thân</option>
                <option value="Đã kết hôn">Đã kết hôn</option>
                <option value="Đã ly hôn">Đã ly hôn</option>
                <option value="Góa chồng">Góa chồng</option>
                <option value="Góa vợ">Góa vợ</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ethnicity">Dân tộc</label>
              <input
                type="text"
                id="ethnicity"
                name="ethnicity"
                value={formData.ethnicity}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Nhập dân tộc"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="occupation">Nghề nghiệp</label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Nhập nghề nghiệp"
            />
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Hủy
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        )}
      </form>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="avatar-modal-overlay" onClick={handleCloseModal}>
          <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="avatar-modal-header">
              <h3>Ảnh đại diện</h3>
              <button className="avatar-modal-close" onClick={handleCloseModal}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="avatar-modal-body">
              {avatarPreview && (
                <img 
                  src={avatarPreview} 
                  alt="Avatar" 
                  className="avatar-modal-image"
                />
              )}
            </div>
            <div className="avatar-modal-footer">
              <button 
                className="btn-change-avatar" 
                onClick={handleChangeAvatar}
                disabled={loading}
              >
                <i className="fa-solid fa-camera"></i>
                {loading ? 'Đang tải...' : 'Chọn ảnh khác'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
