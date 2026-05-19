import { io } from 'socket.io-client';

let socket = null;
let currentSocketWorkspaceId = null;

const getSocket = () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('No token found for socket connection');
    return null;
  }

  // Kiểm tra workspace có thay đổi để tạo lại kết nối
  const currentWorkspaceId = localStorage.getItem('currentWorkspaceId');
  const newWorkspaceId = currentWorkspaceId ? parseInt(currentWorkspaceId) : null;
  
  // Socket cần được tạo lại khi chuyển workspace để role đúng
  if (socket && socket.connected) {
    // Workspace thay đổi, cần kết nối lại với workspace mới
    if (currentSocketWorkspaceId !== newWorkspaceId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Workspace changed, reconnecting socket. Old:', currentSocketWorkspaceId, 'New:', newWorkspaceId);
      }
      socket.disconnect();
      socket = null;
      currentSocketWorkspaceId = null;
    } else {
      // Workspace không thay đổi, tái sử dụng socket hiện tại
      return socket;
    }
  }

  // Socket bị mất kết nối, thử kết nối lại
  if (socket && !socket.connected) {
    console.log('Socket exists but not connected, attempting to reconnect...');
    socket.connect();
    return socket;
  }

  // Tạo kết nối WebSocket mới với xác thực và workspace context
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3036';
  
  // Gửi workspace_id để server biết role của user trong workspace
  const workspaceId = localStorage.getItem('currentWorkspaceId');
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Socket connecting with workspace_id:', workspaceId);
  }
  
  const workspaceIdForSocket = workspaceId ? parseInt(workspaceId) : null;
  currentSocketWorkspaceId = workspaceIdForSocket;
  
  socket = io(API_BASE_URL, {
    auth: {
      token: token,
      workspace_id: workspaceIdForSocket
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 3,
    timeout: 20000
  });

  socket.on('connect', () => {
    console.log('Socket connected, ID:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server chủ động ngắt kết nối, cần kết nối lại thủ công
      socket.connect();
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_error', (error) => {
    console.error('Socket reconnection error:', error);
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket reconnection failed');
  });

  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentSocketWorkspaceId = null;
  }
};

export { getSocket, disconnectSocket };

