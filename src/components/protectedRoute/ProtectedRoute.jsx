import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowedRoles = [], 
  requireAdmin = false,
  requirePMOrAdmin = false,
  requireLeaderOrAbove = false,
  requireWorkspace = false
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const workspaceRole = currentWorkspace?.role || null;
  // Chuẩn hóa global role về lowercase để tránh lệ thuộc vào chữ hoa/thường
  const globalRole = user?.role ? String(user.role).toLowerCase() : null;
  const location = useLocation();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Đang tải...
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu không yêu cầu đăng nhập (login/register) nhưng đã đăng nhập -> chuyển vào trang chọn workspace
  if (!requireAuth && isAuthenticated) {
    // Admin global -> đưa vào dashboard, user thường -> workspaces
    const target = globalRole === 'admin' ? '/admin' : '/workspaces';
    return <Navigate to={target} replace />;
  }

  // Với các route yêu cầu phải chọn workspace
  if (requireWorkspace && isAuthenticated && !currentWorkspace) {
    return <Navigate to="/workspaces" state={{ from: location }} replace />;
  }

  const getRoleForCheck = (options = {}) => {
    if (options.globalOnly) {
      return globalRole;
    }
    if (options.forceWorkspace) {
      return workspaceRole;
    }
    return workspaceRole || globalRole;
  };

  const roleMatches = (roles, options = {}) => {
    if (!roles || roles.length === 0) return true;
    const role = getRoleForCheck(options);
    if (!role) return false;
    return roles.includes(role);
  };

  // Kiểm tra quyền truy cập dựa trên role (ưu tiên role trong workspace)
  if (isAuthenticated) {
    // Kiểm tra quyền Admin (global)
    if (requireAdmin && globalRole !== 'admin') {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: 'red'
        }}>
          Bạn không có quyền truy cập trang này. Chỉ Admin mới có quyền.
        </div>
      );
    }

    // Kiểm tra quyền PM hoặc Admin
    if (requirePMOrAdmin) {
      const hasWorkspacePM = workspaceRole === 'pm';
      const hasGlobalAdmin = globalRole === 'admin';
      const hasGlobalPM = !workspaceRole && globalRole === 'pm';
      if (!(hasWorkspacePM || hasGlobalAdmin || hasGlobalPM)) {
        return (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '18px',
            color: 'red'
          }}>
            Bạn không có quyền truy cập trang này. Chỉ Project Manager hoặc Admin mới có quyền.
          </div>
        );
      }
    }

    // Kiểm tra quyền Team Leader trở lên (ưu tiên workspace role)
    if (requireLeaderOrAbove) {
      if (!roleMatches(['pm', 'tl'], { forceWorkspace: requireWorkspace })) {
        return (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '18px',
            color: 'red'
          }}>
            Bạn không có quyền truy cập trang này. Chỉ Team Leader hoặc Project Manager mới có quyền.
          </div>
        );
      }
    }

    // Kiểm tra danh sách role được phép
    if (allowedRoles.length > 0 && !roleMatches(allowedRoles, { forceWorkspace: requireWorkspace })) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: 'red'
        }}>
          Bạn không có quyền truy cập trang này.
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;

