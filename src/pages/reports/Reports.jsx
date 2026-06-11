import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import usePermissions from '../../hooks/usePermissions';
import useToast from '../../hooks/useToast';
import { ToastContainer } from '../../components/toast/Toast';
import reportService from '../../services/reportService';
import { getLastName } from '../../utils/nameHelper';
import './Reports.css';

const DonutChart = ({ value, total, color, label }) => {
  const size = 160;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? Math.min(1, Math.max(0, value / total)) : 0;
  const dash = `${(progress * circumference).toFixed(2)} ${circumference.toFixed(2)}`;

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} className="donut-svg">
        <circle 
          r={radius} 
          cx={size/2} 
          cy={size/2} 
          fill="transparent" 
          stroke="#f1f5f9" 
          strokeWidth={stroke} 
        />
        {progress > 0 && (
          <circle 
            r={radius} 
            cx={size/2} 
            cy={size/2} 
            fill="transparent" 
            stroke={color} 
            strokeWidth={stroke} 
            strokeDasharray={dash} 
            transform={`rotate(-90 ${size/2} ${size/2})`} 
            strokeLinecap="round" 
          />
        )}
        <text 
          x="50%" 
          y="45%" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          className="donut-percent"
        >
          {Math.round(progress * 100)}%
        </text>
        <text 
          x="50%" 
          y="65%" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          className="donut-label"
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

const Reports = () => {
  const { user } = useAuth();
  const permissions = usePermissions();
  const { toasts, addToast, removeToast } = useToast();
  const canView = permissions.canViewReports;

  const [projectStats, setProjectStats] = useState({ total: 0, not_started: 0, in_progress: 0, completed: 0 });
  const [taskStats, setTaskStats] = useState({ total: 0, 'Completed': 0, 'Pending': 0, avg_progress: 0, 'In Progress': 0 });
  const [taskProgressByProject, setTaskProgressByProject] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (canView) {
      loadReports();
    }
  }, [canView]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [projectRes, taskRes, progressRes] = await Promise.all([
        reportService.getProjectStats(),
        reportService.getTaskStats(),
        reportService.getTaskProgressByProject()
      ]);

      if (projectRes.success) setProjectStats(projectRes.data);
      if (taskRes.success) setTaskStats(taskRes.data);
      if (progressRes.success) setTaskProgressByProject(progressRes.data);
    } catch (err) {
      addToast('Không thể tải báo cáo', 'danger');
    } finally {
      setLoading(false);
    }
  };

  if (!canView) {
    return (
      <div className="reports-page-wrapper">
        <div className="reports-no-access">
          <h1>Bạn không có quyền xem báo cáo.</h1>
        </div>
      </div>
    );
  }

  // Derive top project
  const topProject = taskProgressByProject.length > 0 ? taskProgressByProject[0] : { name: 'Chưa có dự án', avg_progress: 0 };
  const topProjectProgress = Math.round(parseFloat(topProject.avg_progress) || 0);

  return (
    <div className="reports-page-wrapper">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* TOP NAV BAR - Global Nav */}
      <div className="team-top-nav">
        <div className="nav-left">
          <div className="nav-brand">
            <div className="nav-icon reports-icon"><i className="fas fa-th-large"></i></div>
            <span className="nav-title">BÁO CÁO TỔNG QUAN</span>
          </div>
        </div>
        <div className="nav-right">
          <span className="nav-link">Dashboard</span>
          <span className="nav-link active">Overview</span>
          <i className="far fa-bell icon-btn" style={{ marginLeft: '16px' }}></i>
          <i className="fas fa-cog icon-btn"></i>
          {user?.avatar ? (
             <img src={user.avatar} alt="User" className="nav-avatar" />
          ) : (
             <div className="nav-avatar-placeholder">
               {getLastName(user?.username || 'U').charAt(0).toUpperCase()}
             </div>
          )}
        </div>
      </div>

      <div className="reports-main-content">
        {/* HEADER */}
        <div className="reports-header-section">
          <div className="reports-supertitle">ANALYTICS DASHBOARD / BÁO CÁO</div>
          <h1 className="reports-title">Phân tích tiến độ dự án và công việc</h1>
        </div>

        {/* GRID LAYOUT */}
        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Đang tải báo cáo...</p>
          </div>
        ) : (
          <div className="reports-masonry">
            {/* ROW 1: Two cards */}
            <div className="reports-row row-2-cols">
              {/* Card 1: Project Stats */}
              <div className="r-card">
                <div className="r-card-header">
                  <div className="r-card-title">
                    <div className="r-icon-box folder-icon"><i className="fas fa-folder"></i></div>
                    <h3>Thống kê dự án</h3>
                  </div>
                  <i className="fas fa-ellipsis-v dots-icon"></i>
                </div>
                <div className="r-card-body list-body">
                  <div className="r-list-item">
                    <div className="r-list-left">
                      <i className="fas fa-layer-group"></i>
                      <span>Tổng số dự án</span>
                    </div>
                    <div className="r-list-right text-red">{projectStats.total || 0}</div>
                  </div>
                  <div className="r-list-item">
                    <div className="r-list-left">
                      <i className="fas fa-pause-circle"></i>
                      <span>Chưa bắt đầu</span>
                    </div>
                    <div className="r-list-right text-red">{projectStats.not_started || 0}</div>
                  </div>
                  <div className="r-list-item">
                    <div className="r-list-left">
                      <i className="fas fa-sync-alt"></i>
                      <span>Đang thực hiện</span>
                    </div>
                    <div className="r-list-right">{projectStats.in_progress || 0}</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Task Stats */}
              <div className="r-card">
                <div className="r-card-header">
                  <div className="r-card-title">
                    <div className="r-icon-box task-icon"><i className="fas fa-check-double"></i></div>
                    <h3>Thống kê công việc</h3>
                  </div>
                  <i className="fas fa-ellipsis-v dots-icon"></i>
                </div>
                <div className="r-card-body grid-body">
                  <div className="r-grid-item">
                    <div className="r-grid-top">
                      <i className="fas fa-clipboard-list"></i>
                      <span>Tổng số</span>
                    </div>
                    <div className="r-grid-bottom text-red">{taskStats.total || 0}</div>
                  </div>
                  <div className="r-grid-item">
                    <div className="r-grid-top">
                      <i className="fas fa-check-circle text-red"></i>
                      <span>Hoàn thành</span>
                    </div>
                    <div className="r-grid-bottom text-red">{taskStats['Completed'] || 0}</div>
                  </div>
                  <div className="r-grid-item">
                    <div className="r-grid-top">
                      <i className="far fa-clock"></i>
                      <span>Pending</span>
                    </div>
                    <div className="r-grid-bottom">0</div>
                  </div>
                  <div className="r-grid-item">
                    <div className="r-grid-top">
                      <i className="fas fa-chart-line"></i>
                      <span>Tiến độ TB</span>
                    </div>
                    <div className="r-grid-bottom text-red">{Math.round(parseFloat(taskStats.avg_progress) || 0)}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Two cards, uneven widths */}
            <div className="reports-row row-60-40">
              {/* Card 3: Project Progress Bar */}
              <div className="r-card progress-card">
                <div className="r-card-header">
                  <div className="r-card-title">
                    <i className="fas fa-chart-bar text-red" style={{ fontSize: '18px' }}></i>
                    <h3>Tiến độ theo dự án</h3>
                  </div>
                  <div className="month-badge">Tháng này</div>
                </div>
                <div className="r-card-body progress-body">
                  <div className="prog-labels">
                    <span className="prog-name">DỰ ÁN</span>
                    <span className="prog-val-label">TIẾN ĐỘ</span>
                  </div>
                  <div className="prog-values">
                    <span className="prog-title">{topProject.name.substring(0, 15)}{topProject.name.length > 15 ? '...' : ''}</span>
                    <span className="prog-percent text-red">{topProjectProgress}%</span>
                  </div>
                  <div className="prog-bar-bg">
                    <div className="prog-bar-fill" style={{ width: `${Math.max(1, topProjectProgress)}%` }}></div>
                  </div>
                </div>
                <div className="chart-bg-graphic">
                  <i className="fas fa-chart-bar"></i>
                </div>
              </div>

              {/* Card 4: AI Analysis */}
              <div className="r-card ai-analysis-card">
                <div className="ai-icon-circle">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Phân tích chuyên sâu</h3>
                <p>Hãy cập nhật trạng thái công việc để hệ thống AI có thể phân tích hiệu suất của bạn.</p>
                <a href="/aichat" className="ai-link">Xem chi tiết &rarr;</a>
              </div>
            </div>

            {/* ROW 3: Donut Charts */}
            <div className="reports-row row-2-cols">
              {/* Card 5: In Progress Tasks */}
              <div className="r-card donut-card">
                <div className="r-card-header">
                  <div className="r-card-title">
                    <i className="fas fa-hourglass-half"></i>
                    <h3>Tasks đang thực hiện</h3>
                  </div>
                  <i className="far fa-info-circle info-icon"></i>
                </div>
                <div className="r-card-body center-body">
                  <DonutChart 
                    value={parseInt(taskStats['In Progress']) || 0} 
                    total={taskStats.total || 0} 
                    color="#c62828" 
                    label="Tiến độ" 
                  />
                  <div className="donut-legend">
                    <div className="d-legend-item">
                      <div className="d-legend-label">
                        <span className="dot dot-red"></span>Giá trị
                      </div>
                      <div className="d-legend-val">{parseInt(taskStats['In Progress']) || 0}</div>
                    </div>
                    <div className="d-legend-item">
                      <div className="d-legend-label">
                        <span className="dot dot-gray"></span>Tổng cộng
                      </div>
                      <div className="d-legend-val">{taskStats.total || 0}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6: Completed Tasks */}
              <div className="r-card donut-card">
                <div className="r-card-header">
                  <div className="r-card-title">
                    <i className="far fa-check-circle text-red"></i>
                    <h3>Tasks hoàn thành</h3>
                  </div>
                  <i className="far fa-info-circle info-icon"></i>
                </div>
                <div className="r-card-body center-body">
                  <DonutChart 
                    value={parseInt(taskStats['Completed']) || 0} 
                    total={taskStats.total || 0} 
                    color="#22c55e" 
                    label="Thành công" 
                  />
                  <div className="donut-legend">
                    <div className="d-legend-item">
                      <div className="d-legend-label">
                        <span className="dot dot-green"></span>Giá trị
                      </div>
                      <div className="d-legend-val">{parseInt(taskStats['Completed']) || 0}</div>
                    </div>
                    <div className="d-legend-item">
                      <div className="d-legend-label">
                        <span className="dot dot-gray"></span>Tổng cộng
                      </div>
                      <div className="d-legend-val">{taskStats.total || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating AI Button */}
      <button className="floating-ai-btn">
        <i className="fas fa-robot"></i> Gợi ý AI
      </button>
    </div>
  );
};

export default Reports;
