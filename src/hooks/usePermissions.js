import { useAuth } from '../contexts/AuthContext';
import { useWorkspace } from '../contexts/WorkspaceContext';

export const usePermissions = () => {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const workspaceRole = currentWorkspace?.role || null;
  const globalRole = user?.role ? String(user.role).toLowerCase() : null;
  const role = workspaceRole || globalRole || null;
  const inWorkspaceContext = Boolean(workspaceRole);

  // Trả về object rỗng khi chưa có role để tránh lỗi
  if (!role) {
    return {
      isAdmin: false,
      isPM: false,
      isTL: false,
      isMember: false,
      isClient: false,
      canView: false,
      canEdit: false,
      canManageMembers: false,
      canDelete: false,
      canCreateProject: false,
      canCreateTask: false,
      canViewProjects: false,
      canViewTasks: false,
      canViewMembers: false,
      canViewReports: false,
      canViewNotifications: false,
      canViewChat: false,
      canViewMyTasks: false,
      canViewTeam: false,
      hasRole: () => false,
      hasAnyRole: () => false,
      hasAllRoles: () => false,
      getRoleDisplayName: () => 'Unknown',
      getRoleColor: () => '#6c757d'
    };
  }

  // Kiểm tra user có role nào đó trong danh sách cho phép
  const resolveRoles = (allowedRoles, { requireWorkspace = false } = {}) => {
    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) return true;
    if (requireWorkspace) {
      return workspaceRole ? allowedRoles.includes(workspaceRole) : false;
    }
    const currentRole = workspaceRole || globalRole;
    return currentRole ? allowedRoles.includes(currentRole) : false;
  };

  return {
    // Kiểm tra role cụ thể của user
    isAdmin: !inWorkspaceContext && role === 'admin',
    isPM: role === 'pm',
    isTL: role === 'tl',
    isMember: role === 'mb',
    isClient: role === 'clt',

    // Quyền cơ bản theo role hierarchy
    canView: resolveRoles(['pm', 'tl', 'mb', 'clt'], { requireWorkspace: inWorkspaceContext }),
    canEdit: resolveRoles(inWorkspaceContext ? ['pm', 'tl'] : ['ad', 'pm', 'tl']),
    canManageMembers: resolveRoles(inWorkspaceContext ? ['pm'] : ['ad', 'pm', 'tl']),
    canDelete: resolveRoles(inWorkspaceContext ? ['pm'] : ['ad', 'pm', 'tl']),

    // Quyền quản lý project
    canCreateProject: resolveRoles(inWorkspaceContext ? ['pm', 'tl'] : ['ad', 'pm', 'tl']),
    canEditProject: resolveRoles(inWorkspaceContext ? ['pm', 'tl'] : ['ad', 'pm', 'tl']),
    canDeleteProject: resolveRoles(inWorkspaceContext ? ['pm'] : ['ad', 'pm']),
    canViewProjects: resolveRoles(['pm', 'tl', 'mb', 'clt'], { requireWorkspace: inWorkspaceContext }),

    // Quyền quản lý task
    canCreateTask: resolveRoles(inWorkspaceContext ? ['pm', 'tl'] : ['ad', 'pm', 'tl']),
    canEditTask: resolveRoles(inWorkspaceContext ? ['pm', 'tl'] : ['ad', 'pm', 'tl']),
    canDeleteTask: resolveRoles(inWorkspaceContext ? ['pm'] : ['ad', 'pm', 'tl']),
    canViewTasks: resolveRoles(['pm', 'tl', 'mb'], { requireWorkspace: inWorkspaceContext }),

    // Quyền quản lý thành viên
    canViewMembers: resolveRoles(['pm', 'tl', 'mb', 'clt'], { requireWorkspace: inWorkspaceContext }),
    canAddMembers: resolveRoles(['pm'], { requireWorkspace: inWorkspaceContext }),
    canRemoveMembers: resolveRoles(['pm'], { requireWorkspace: inWorkspaceContext }),
    canEditUserRole: resolveRoles(['pm'], { requireWorkspace: inWorkspaceContext }),

    // Quyền truy cập các tính năng
    canViewReports: resolveRoles(['pm', 'tl'], { requireWorkspace: inWorkspaceContext }),
    canViewNotifications: resolveRoles(['pm', 'tl', 'mb', 'clt'], { requireWorkspace: inWorkspaceContext }),
    canViewChat: resolveRoles(['pm', 'tl', 'mb', 'clt'], { requireWorkspace: inWorkspaceContext }),
    canViewMyTasks: resolveRoles(['pm', 'tl', 'mb'], { requireWorkspace: inWorkspaceContext }),
    canViewTeam: resolveRoles(['pm', 'tl'], { requireWorkspace: inWorkspaceContext }),

    // Quyền admin chỉ có hiệu lực ở cấp toàn hệ thống
    canManageUsers: !inWorkspaceContext && resolveRoles(['ad', 'pm']),
    canDeleteUsers: !inWorkspaceContext && resolveRoles(['ad']),
    canViewAllUsers: !inWorkspaceContext && resolveRoles(['ad', 'pm']),
    
    // Hàm tiện ích để kiểm tra role
    hasRole: (roles) => resolveRoles(Array.isArray(roles) ? roles : [roles]),
    hasAnyRole: (roles) => roles.some(roleName => resolveRoles([roleName])),
    hasAllRoles: (roles) => roles.every(roleName => resolveRoles([roleName])),

    // Lấy tên hiển thị của role
    getRoleDisplayName: () => {
      const roleNames = {
        'ad': 'Admin',
        'pm': 'Project Manager',
        'tl': 'Team Leader',
        'mb': 'Member',
        'clt': 'Client'
      };
      return roleNames[role] || 'Unknown';
    },

    // Lấy màu sắc tương ứng với role cho UI
    getRoleColor: () => {
      const roleColors = {
        'ad': '#dc3545', // Red
        'pm': '#007bff', // Blue
        'tl': '#28a745', // Green
        'mb': '#6c757d', // Gray
        'clt': '#8a2be2' // Purple
      };
      return roleColors[role] || '#6c757d';
    }
  };
};

export default usePermissions;
