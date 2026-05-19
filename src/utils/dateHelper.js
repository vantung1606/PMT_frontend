/**
 * Định dạng ngày cho input HTML type="date" (cần format YYYY-MM-DD)
 * @param {string|Date|null|undefined} dateString - Chuỗi ngày, đối tượng Date, hoặc null/undefined
 * @returns {string} Chuỗi ngày ở định dạng YYYY-MM-DD, hoặc chuỗi rỗng nếu không hợp lệ
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Định dạng ngày cho mục đích hiển thị (ví dụ: DD/MM/YYYY)
 * @param {string|Date|null|undefined} dateString - Chuỗi ngày, đối tượng Date, hoặc null/undefined
 * @param {string} locale - Chuỗi locale (mặc định: 'vi-VN')
 * @returns {string} Chuỗi ngày đã được định dạng để hiển thị
 */
export const formatDateForDisplay = (dateString, locale = 'vi-VN') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString(locale);
};

/**
 * Định dạng ngày thành khoảng cách tương đối với thời điểm hiện tại (ví dụ: "2 giờ trước", "3 ngày trước")
 * @param {string|Date|null|undefined} dateString - Chuỗi ngày, đối tượng Date, hoặc null/undefined
 * @returns {string} Chuỗi thời gian tương đối
 */
export const formatDistanceToNow = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'vừa xong';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm trước`;
};
