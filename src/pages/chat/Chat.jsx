import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useToast from '../../hooks/useToast';
import EmptyState from '../../components/emptyState/EmptyState';
import LoadingState from '../../components/loadingState/LoadingState';
import { ToastContainer } from '../../components/toast/Toast';
import { getSocket } from '../../services/socketService';
import projectCommentService from '../../services/projectCommentService';
import projectService from '../../services/projectService';
import { getLastName } from '../../utils/nameHelper';
import './Chat.css';

const Chat = () => {
  const { user } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const commentsEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadProjects();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      setupSocket();
      loadComments(selectedProjectId);
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setComments([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const res = await projectService.getMyProjects();
      if (res.success) {
        setProjects(res.data);
        if (res.data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(res.data[0].id);
        }
      }
    } catch (err) {
      addToast('Không thể tải danh sách dự án', 'danger');
    }
  };

  const loadComments = async (projectId) => {
    setLoading(true);
    try {
      const res = await projectCommentService.getProjectComments(projectId);
      if (res.success) {
        setComments(res.data);
        scrollToBottom();
      }
    } catch (err) {
      addToast('Không thể tải bình luận', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.removeAllListeners();
    }

    const socket = getSocket();
    if (!socket) {
      console.warn('Socket not available, will use API fallback');
      socketRef.current = null;
      return;
    }

    socketRef.current = socket;

    // Wait for socket to connect before joining project
    const joinProject = (projectId) => {
      console.log('Joining project room:', projectId);
      socket.emit('join-project', projectId);
    };

    if (socket.connected) {
      joinProject(selectedProjectId);
    } else {
      socket.once('connect', () => {
        console.log('Socket connected, joining project:', selectedProjectId);
        joinProject(selectedProjectId);
      });
    }

    socket.on('project-comment-received', (comment) => {
      console.log('Project comment received event:', comment);
      if (comment && comment.id) {
        // Check if comment already exists to avoid duplicates
        setComments(prev => {
          const exists = prev.some(c => c.id === comment.id);
          if (exists) {
            console.log('Comment already exists, skipping:', comment.id);
            return prev;
          }
          console.log('Adding new comment to list');
          return [...prev, comment];
        });
        scrollToBottom();
      } else {
        console.error('Invalid comment data received:', comment);
      }
    });

    socket.on('project-user-typing', (data) => {
      if (data.userId !== user.id) {
        if (data.isTyping) {
          setTypingUsers(prev => new Set([...prev, data.username]));
        } else {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.username);
            return newSet;
          });
        }
      }
    });

    socket.on('project-comment-error', (error) => {
      console.error('Project comment error:', error);
      addToast(error.message || 'Lỗi khi gửi bình luận', 'danger');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      addToast('Lỗi kết nối socket. Vui lòng thử lại.', 'danger');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    if (!isTyping && value.trim()) {
      setIsTyping(true);
      if (socketRef.current && selectedProjectId) {
        socketRef.current.emit('project-typing', { projectId: selectedProjectId, isTyping: true });
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socketRef.current && selectedProjectId) {
        socketRef.current.emit('project-typing', { projectId: selectedProjectId, isTyping: false });
      }
    }, 1000);
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    
    const commentText = newComment.trim();
    if (!commentText) {
      addToast('Vui lòng nhập nội dung bình luận', 'warning');
      return;
    }
    
    if (!selectedProjectId) {
      addToast('Vui lòng chọn dự án để gửi bình luận', 'warning');
      return;
    }

    setNewComment('');
    setIsTyping(false);
    
    if (socketRef.current && selectedProjectId) {
      socketRef.current.emit('project-typing', { projectId: selectedProjectId, isTyping: false });
    }

    try {
      // Try socket first if available and connected
      if (socketRef.current && socketRef.current.connected) {
        console.log('Sending project comment via socket:', { project_id: selectedProjectId, comment: commentText });
        socketRef.current.emit('new-project-comment', {
          project_id: selectedProjectId,
          comment: commentText
        });
      } else {
        // Fallback to API if socket not available or not connected
        console.log('Socket not available/connected, using API fallback');
        const res = await projectCommentService.create(selectedProjectId, commentText);
        if (res.success) {
          setComments(prev => [...prev, res.data]);
          scrollToBottom();
        } else {
          addToast(res.message || 'Không thể gửi bình luận', 'danger');
        }
      }
    } catch (err) {
      console.error('Error sending comment:', err);
      addToast(err?.response?.data?.message || err?.message || 'Lỗi khi gửi bình luận', 'danger');
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(msg => {
      const date = new Date(msg.created_at);
      const dateKey = date.toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(msg);
    });
    return grouped;
  };

  // Format time for message
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3036';
    return avatar.startsWith('http') 
      ? avatar 
      : `${API_BASE_URL}/uploads/avatars/${avatar}`;
  };

  // Filter projects by search
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
  );

  const selectedProject = projects.find(p => p.id === parseInt(selectedProjectId));
  const groupedMessages = groupMessagesByDate(comments);

  return (
    <div className="chat-chat-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* We don't need the top header bar since the mockup has the sidebar going all the way up, 
          or we can keep it hidden/integrated. The mockup shows the Chat list taking the full height 
          next to the red sidebar. */}


      <div className={`chat-content ${selectedProjectId ? 'chat-active' : ''}`}>
        {/* Left Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>Tin nhắn</h2>
            <button className="chat-edit-btn"><i className="far fa-edit"></i></button>
          </div>

          <div className="chat-sidebar-search">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm cuộc hội thoại..."
              value={sidebarSearchQuery}
              onChange={(e) => setSidebarSearchQuery(e.target.value)}
            />
          </div>

          <div className="chat-filters">
            <span className="chat-filter-pill active">Tất cả</span>
            <span className="chat-filter-pill">Chưa đọc</span>
            <span className="chat-filter-pill">Nhóm</span>
            <span className="chat-filter-pill">Cá nhân</span>
          </div>

          <div className="chat-chats-list">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div
                  key={project.id}
                  className={`chat-chat-item ${selectedProjectId === project.id ? 'active-project active' : ''}`}
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <div className="chat-chat-avatar group">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.name)}&background=random`} alt={project.name} />
                  </div>
                  <div className="chat-chat-info">
                    <div className="chat-chat-name-row">
                      <span className="chat-chat-name">{project.name}</span>
                      {/* Normally would show last message time here, using static "Hôm qua" or logic if available */}
                    </div>
                    <div className="chat-chat-msg-row">
                      <span className="chat-chat-msg">Nhấn để xem tin nhắn dự án</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="chat-empty-chats" style={{padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px'}}>
                <i className="fas fa-folder-open" style={{fontSize: '24px', marginBottom: '8px'}}></i>
                <div>Không tìm thấy đoạn chat nào</div>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {!selectedProjectId ? (
            <EmptyState
              icon="fa-comments"
              title="Chưa chọn đoạn chat"
              description="Vui lòng chọn một dự án để bắt đầu chat."
            />
          ) : (
            <>
              {/* Chat Header */}
              <div className="chat-chat-header">
                <div className="chat-chat-header-info">
                  <button 
                    className="chat-header-btn back-btn mobile-only" 
                    onClick={() => setSelectedProjectId(null)}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <div className="chat-chat-header-avatar group">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedProject?.name || 'Project')}&background=random`} alt={selectedProject?.name} />
                  </div>
                  <div className="chat-chat-header-title-box">
                    <h3>{selectedProject?.name}</h3>
                    <p className="status-text online">Đoạn chat dự án</p>
                  </div>
                </div>
                <div className="chat-chat-header-actions">
                  <button className="chat-header-btn"><i className="fas fa-phone-alt"></i></button>
                  <button className="chat-header-btn"><i className="fas fa-video"></i></button>
                  <button className="chat-header-btn"><i className="fas fa-search"></i></button>
                  <button className="chat-header-btn"><i className="fas fa-info-circle"></i></button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="chat-messages">
                <div className="chat-date-divider">
                  <span>HÔM NAY</span>
                </div>

                {/* Actual Real-time Messages from Database */}
                {loading ? (
                  <LoadingState message="Đang tải bình luận..." />
                ) : (
                  <>
                    {Object.keys(groupedMessages).map(dateKey => (
                      <div key={dateKey} className="chat-message-group">
                        <div className="chat-date-divider">
                          <span>{dateKey}</span>
                        </div>
                        {groupedMessages[dateKey].map(comment => (
                          <div
                            key={comment.id}
                            className={`chat-message ${comment.user_id === user.id ? 'own' : 'other'}`}
                          >
                            {comment.user_id !== user.id && (
                              <div className="chat-message-avatar">
                                {comment.avatar ? (
                                  <img src={getAvatarUrl(comment.avatar)} alt={comment.username} />
                                ) : (
                                  <span>{getLastName(comment.username || 'U').charAt(0).toUpperCase()}</span>
                                )}
                              </div>
                            )}
                            <div className="chat-message-content">
                              <div className="chat-message-bubble">
                                <div className="chat-message-text">{comment.comment}</div>
                              </div>
                              <span className="chat-message-time-inline">
                                {formatMessageTime(comment.created_at)}
                                {comment.user_id === user.id && <i className="fas fa-check-double" style={{color: '#b71c1c', marginLeft: '4px'}}></i>}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    <div ref={commentsEndRef} />
                  </>
                )}
              </div>

              {/* Input Area (New Mockup Design) */}
              <div className="chat-input-area new-design">
                <form className="chat-input-form" onSubmit={handleSendComment}>
                  <div className="chat-input-container">
                    <div className="chat-input-toolbar-top">
                      <div className="toolbar-icons">
                        <button type="button"><i className="fas fa-bold"></i></button>
                        <button type="button"><i className="fas fa-paperclip"></i></button>
                        <button type="button"><i className="far fa-image"></i></button>
                        <button type="button"><i className="far fa-smile"></i></button>
                      </div>
                      <button type="button" className="ai-assist-btn">
                        <i className="fas fa-robot"></i> AI Trợ giúp
                      </button>
                    </div>
                    <div className="chat-input-row">
                      <input
                        ref={inputRef}
                        type="text"
                        className="chat-input-field"
                        placeholder="Nhập tin nhắn..."
                        value={newComment}
                        onChange={handleCommentChange}
                      />
                      <button
                        type="submit"
                        className="chat-send-btn-new"
                        disabled={!newComment.trim()}
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                  <div className="chat-input-footer">
                    Nhấn Enter để gửi, Shift + Enter để xuống dòng
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
