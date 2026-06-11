import React, { useState, useEffect, useRef } from 'react';
import aiService from '../../services/aiService';
import projectService from '../../services/projectService';
import taskService from '../../services/taskService';
import useToast from '../../hooks/useToast';
import { ToastContainer } from '../../components/toast/Toast';
import './AIChat.css';

const AIChat = () => {
  const { toasts, addToast, removeToast } = useToast();
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedProjectName, setSelectedProjectName] = useState('');
  const [addingTasks, setAddingTasks] = useState(new Set());
  const messagesEndRef = useRef(null);

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await projectService.getMyProjects();
        if (res.success) {
          setProjects(res.data);
          if (res.data.length > 0 && !selectedProjectId) {
            setSelectedProjectId(res.data[0].id);
            setSelectedProjectName(res.data[0].name);
          }
        }
      } catch (err) {
        addToast('Không thể tải danh sách dự án', 'danger');
      }
    };
    loadProjects();
  }, []);

  // Update selected project name when project changes
  useEffect(() => {
    const project = projects.find(p => p.id === parseInt(selectedProjectId));
    if (project) {
      setSelectedProjectName(project.name);
    } else {
      setSelectedProjectName('');
    }
  }, [selectedProjectId, projects]);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, aiLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMessage = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setAiLoading(true);

    try {
      const userProjects = projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || ''
      }));
      
      const res = await aiService.chat(
        [...aiMessages, { role: 'user', content: userMessage }],
        selectedProjectName || null,
        userProjects
      );
      
      if (res.success && res.data) {
        const aiResponse = {
          role: res.data.role || 'assistant', 
          content: res.data.content || res.data.message || res.data,
          type: res.data.type,
          export_data: res.data.export_data
        };
        
        setAiMessages(prev => [...prev, aiResponse]);
        
        if (res.data.export_data) {
          addToast('Đã xuất danh sách tasks dạng JSON. Bạn có thể copy để sử dụng.', 'success');
        }
      } else {
        addToast('Không thể nhận phản hồi từ AI', 'danger');
      }
    } catch (err) {
      console.error('AI Chat Error:', err);
      if (err?.response?.status === 429) {
        const errorData = err.response.data;
        if (errorData.error === 'QUOTA_EXCEEDED') {
          addToast('Đã vượt quá giới hạn requests của AI. Vui lòng thử lại sau vài phút.', 'warning');
        } else if (errorData.error === 'RATE_LIMIT_EXCEEDED') {
          addToast('Bạn gửi tin nhắn quá nhanh. Vui lòng chờ một chút.', 'warning');
        } else {
          addToast('Quá nhiều requests. Vui lòng thử lại sau.', 'warning');
        }
      } else {
        addToast(err?.response?.data?.message || 'Lỗi khi gửi tin nhắn', 'danger');
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện?')) {
      setAiMessages([]);
      setAiInput('');
    }
  };

  // Parse AI suggestions from message content
  const parseSuggestions = (content) => {
    if (!content) return [];
    
    const suggestions = [];
    const seen = new Set();
    
    const lines = content.split('\n');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Parsing AI content for suggestions:', content.substring(0, 500));
    }
    
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('danh sách các dự án') || 
        lowerContent.includes('danh sách dự án') ||
        lowerContent.includes('dự án hiện có của bạn') ||
        lowerContent.includes('các dự án hiện có')) {
      return [];
    }
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;
      
      if (line.toLowerCase().includes('ví dụ') || 
          line.toLowerCase().includes('lưu ý') ||
          line.toLowerCase().includes('chú ý') ||
          line.toLowerCase().includes('vui lòng') ||
          line.toLowerCase().includes('danh sách') ||
          line.toLowerCase().includes('dự án') && line.toLowerCase().includes('chọn') ||
          line.toLowerCase().startsWith('bạn') ||
          line.toLowerCase().startsWith('tôi') ||
          line.toLowerCase().startsWith('chúng ta')) {
        continue;
      }
      
      let taskName = '';
      let description = '';

      const taskMatchWithDesc1 = line.match(/^[\d\-\•\*]\s+(.+?)\s*[:：]\s*(.+)$/);
      if (taskMatchWithDesc1) {
        taskName = taskMatchWithDesc1[1].trim();
        description = taskMatchWithDesc1[2].trim();
      } else {
        const taskMatchWithDesc2 = line.match(/^[\d\-\•\*]\s+(.+?)\s+-\s+(.+)$/);
        if (taskMatchWithDesc2 && taskMatchWithDesc2[2].length > 5) {
          taskName = taskMatchWithDesc2[1].trim();
          description = taskMatchWithDesc2[2].trim();
        }
      }
      
      if (taskName && description && description.length > 3) {
        taskName = taskName.replace(/^[:\-]\s*/, '').trim();
        description = description.trim();
        description = description.replace(/^[.!?]\s*/, '').trim();
        
        if (taskName.length > 3 && taskName.length < 100 && 
            description.length > 3 && 
            !seen.has(taskName.toLowerCase())) {
          seen.add(taskName.toLowerCase());
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Parsed suggestion with description:', { name: taskName, description });
          }
          
          suggestions.push({
            name: taskName,
            description: description,
            originalLine: line
          });
        }
        continue;
      }
      
      const taskMatch = line.match(/^[\d\-\•\*]\s+(.+?)(?:[:：]|$)/);
      if (taskMatch) {
        let taskName = taskMatch[1].trim();
        taskName = taskName.replace(/^[:\-]\s*/, '').trim();
        let description = '';
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine && !/^[\d\-\•\*]/.test(nextLine) && nextLine.length > 10 && nextLine.length < 200) {
            description = nextLine;
          }
        }
        
        if (taskName.length > 3 && taskName.length < 100 && !seen.has(taskName.toLowerCase())) {
          seen.add(taskName.toLowerCase());
          suggestions.push({
            name: taskName,
            description: description,
            originalLine: line
          });
        }
        continue;
      }
      
      if (line.length > 10 && line.length < 150 && 
          /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(line)) {
        if (!line.includes('?') && 
            !line.toLowerCase().includes('là gì') &&
            !line.toLowerCase().includes('như thế nào') &&
            !line.toLowerCase().includes('tại sao')) {

          let taskName = line.replace(/[.!?]$/, '').trim();
          
          if (taskName.length > 5 && taskName.length < 100 && 
              !seen.has(taskName.toLowerCase())) {
            seen.add(taskName.toLowerCase());
            suggestions.push({
              name: taskName,
              description: '',
              originalLine: line
            });
          }
        }
      }
    }
    
    return suggestions.slice(0, 10); 
  };

  const handleAddTask = async (suggestion) => {
    if (!selectedProjectId) {
      addToast('Vui lòng chọn dự án trước khi thêm task', 'warning');
      return;
    }

    const taskId = `suggestion-${Date.now()}-${Math.random()}`;
    setAddingTasks(prev => new Set(prev).add(taskId));

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Adding task with suggestion:', suggestion);
      }

      const res = await taskService.create({
        project_id: selectedProjectId,
        name: suggestion.name,
        description: suggestion.description || '',
        status: 'To Do',
        progress: 0
      });

      if (res.success) {
        const descMsg = suggestion.description ? ' (có mô tả)' : ' (không có mô tả)';
        addToast(`Đã thêm task "${suggestion.name}" vào dự án${descMsg}`, 'success');
      } else {
        addToast('Không thể thêm task', 'danger');
      }
    } catch (err) {
      addToast(err?.response?.data?.message || 'Lỗi khi thêm task', 'danger');
    } finally {
      setAddingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };
  const renderMessageContent = (content, messageData) => {
    if (!content) return null;
    if (messageData?.type === 'export' && messageData?.export_data) {
      const jsonString = JSON.stringify(messageData.export_data, null, 2);
      
      return (
        <div className="ai-message-text">
          <div className="export-message">
            <p>Đây là danh sách tasks theo SDLC dạng JSON:</p>
            <div className="json-export-container">
              <pre className="json-export">{jsonString}</pre>
              <button 
                className="copy-json-btn"
                onClick={() => {
                  navigator.clipboard.writeText(jsonString);
                  addToast('Đã copy JSON vào clipboard', 'success');
                }}
                title="Copy JSON"
              >
                <i className="fas fa-copy"></i> Copy JSON
              </button>
            </div>
            <p className="export-hint">Bạn có thể copy JSON này để import vào hệ thống hoặc sử dụng cho mục đích khác.</p>
          </div>
        </div>
      );
    }
    
    const suggestions = parseSuggestions(content);
    
    if (suggestions.length === 0) {
      return <div className="ai-message-text">{content}</div>;
    }

    return (
      <div className="ai-message-text">
        <div className="message-main-content">
          {content.split('\n').map((line, lineIdx) => {
            const suggestion = suggestions.find(s => 
              line.includes(s.originalLine) || line.includes(s.name)
            );
            
            if (suggestion) {
              const isAdding = Array.from(addingTasks).some(id => id.includes(suggestion.name));
              return (
                <div key={`line-${lineIdx}`} className="ai-suggestion-item">
                  <div className="suggestion-content">
                    <span className="suggestion-text">{suggestion.name}</span>
                    {suggestion.description && (
                      <span className="suggestion-description">{suggestion.description}</span>
                    )}
                  </div>
                  <button
                    className="add-task-btn"
                    onClick={() => handleAddTask(suggestion)}
                    disabled={isAdding || !selectedProjectId}
                    title={!selectedProjectId ? 'Chọn dự án trước' : suggestion.description ? `Thêm task với mô tả: ${suggestion.description}` : 'Thêm vào tasks'}
                  >
                    <i className={`fas ${isAdding ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
                  </button>
                </div>
              );
            }
            return <div key={`line-${lineIdx}`}>{line || '\u00A0'}</div>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="ai-chat-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="ai-chat-header">
        <div className="ai-chat-header-content">
          <div className="ai-chat-header-info">
            <div className="ai-chat-header-icon">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h1>TRỢ LÝ AI</h1>
              <p className="ai-chat-subtitle">Hỗ trợ quản lý dự án và đề xuất mô hình phát triển</p>
            </div>
          </div>
          <button 
            className="clear-chat-button"
            onClick={handleClearChat}
            title="Xóa cuộc trò chuyện"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      <div className="ai-chat-container">
        <div className="ai-chat-messages">
          {aiMessages.length === 0 && !aiLoading ? (
            <div className="ai-welcome-message">
              <div className="ai-avatar-large">
                <i className="fas fa-robot"></i>
              </div>
              <div className="welcome-content">
                <h4>Xin chào! Tôi là AI Assistant</h4>
                <p>Tôi có thể giúp bạn:</p>
                <ul>
                  <li>Trò chuyện và tư vấn về dự án phần mềm</li>
                  <li>Gợi ý các bước phát triển theo SDLC</li>
                  <li>Đề xuất tasks chi tiết cho từng giai đoạn</li>
                  <li>Xuất danh sách tasks dạng JSON (gõ <code>/export</code>)</li>
                </ul>
                <div className="welcome-examples">
                  <p><strong>Ví dụ câu hỏi:</strong></p>
                  <ul>
                    <li>"Tôi muốn tạo project mới"</li>
                    <li>"Hệ thống quản lý đơn hàng"</li>
                    <li>"Gợi ý tasks chi tiết cho tôi"</li>
                    <li>"<code>/export</code>" - Xuất tasks dạng JSON</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            aiMessages.map((msg, idx) => (
              <div key={idx} className={`ai-message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                {msg.role === 'assistant' && (
                  <div className="ai-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                )}
                <div className="ai-message-content">
                  {msg.role === 'assistant' ? renderMessageContent(msg.content, idx, msg) : (
                    <div className="ai-message-text">{msg.content}</div>
                  )}
                  <div className="ai-message-time">
                    {msg.role === 'user' ? 'Bạn' : 'Trợ lý AI'}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
            ))
          )}
          {aiLoading && (
            <div className="ai-message assistant">
              <div className="ai-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="ai-message-content">
                <div className="ai-message-text">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form 
          className="ai-chat-input-form"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            className="ai-chat-input"
            placeholder="Nhập câu hỏi hoặc mô tả dự án của bạn..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            disabled={aiLoading}
          />
          <button
            type="submit"
            className="ai-chat-send-btn"
            disabled={!aiInput.trim() || aiLoading}
          >
            <i className={`fas ${aiLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;

