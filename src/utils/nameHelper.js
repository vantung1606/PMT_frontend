/**
 * Lấy tên cuối cùng (tên riêng) từ tên đầy đủ
 * Chỉ áp dụng khi tên có 3 từ trở lên
 * @param {string} fullName - Tên đầy đủ
 * @returns {string} - Tên cuối cùng hoặc tên đầy đủ nếu có ít hơn 3 từ
 */
export const getLastName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') {
    return fullName || '';
  }
  
  const nameParts = fullName.trim().split(/\s+/);
  
  if (nameParts.length >= 3) {
    return nameParts[nameParts.length - 1];
  }
  
  return fullName;
};

