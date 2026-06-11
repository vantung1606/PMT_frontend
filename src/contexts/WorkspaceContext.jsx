import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import workspaceService from '../services/workspaceService';
import { disconnectSocket } from '../services/socketService';

const WorkspaceContext = createContext();

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return ctx;
};

export const WorkspaceProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tải danh sách workspace khi user đăng nhập thành công
  useEffect(() => {
    const load = async () => {
      // Đợi AuthContext load xong mới quyết định trạng thái workspace
      if (authLoading) return;

      if (!isAuthenticated) {
        setWorkspaces([]);
        setCurrentWorkspace(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await workspaceService.getMyWorkspaces();
        if (res.success) {
          const list = res.data || [];
          setWorkspaces(list);

          // Tự động chọn workspace đã lưu hoặc workspace đầu tiên
          const savedId = localStorage.getItem('currentWorkspaceId');
          const saved = list.find(ws => String(ws.id) === savedId);

          if (saved) {
            setCurrentWorkspace(saved);
          } else if (list.length > 0) {
            setCurrentWorkspace(list[0]);
            localStorage.setItem('currentWorkspaceId', String(list[0].id));
          } else {
            setCurrentWorkspace(null);
            localStorage.removeItem('currentWorkspaceId');
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Load workspaces error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated, authLoading]);

  const selectWorkspace = (workspace) => {
    if (!workspace) {
      setCurrentWorkspace(null);
      localStorage.removeItem('currentWorkspaceId');
      // Ngắt kết nối socket khi rời khỏi workspace
      disconnectSocket();
      return;
    }
    
    const previousWorkspaceId = currentWorkspace?.id;
    const newWorkspaceId = workspace.id;
    
    setCurrentWorkspace(workspace);
    localStorage.setItem('currentWorkspaceId', String(workspace.id));
    
    // Socket cần reconnect với role mới khi đổi workspace
    if (previousWorkspaceId !== newWorkspaceId) {
      disconnectSocket();
      // Socket sẽ tự kết nối lại với workspace_id mới khi được sử dụng
    }
  };

  const createWorkspace = async ({ name, description }) => {
    const res = await workspaceService.createWorkspace({ name, description });
    if (res.success && res.data?.workspace) {
      const { workspace, member } = res.data;
      const fullWorkspace = {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        owner_id: workspace.owner_id,
        created_at: workspace.created_at,
        role: member?.role || 'pm'
      };
      setWorkspaces(prev => [fullWorkspace, ...prev]);
      selectWorkspace(fullWorkspace);
      return fullWorkspace;
    }
    throw new Error(res.message || 'Không thể tạo workspace');
  };

  const value = {
    workspaces,
    currentWorkspace,
    loading,
    selectWorkspace,
    createWorkspace
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};


