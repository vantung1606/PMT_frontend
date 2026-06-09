import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import usePermissions from '../../hooks/usePermissions';
import useToast from '../../hooks/useToast';
import PageHeader from '../../components/pageHeader/PageHeader';
import LoadingState from '../../components/loadingState/LoadingState';
import { ToastContainer } from '../../components/toast/Toast';
import reportService from '../../services/reportService';
import './Reports.css';

const BarChart = ({ title, data, max = 100 }) => {
  const height = 200;
  const barWidth = 40;
  const gap = 16;
  const width = data.length * (barWidth + gap) + gap;
  const maxValue = Math.max(max, ...data.map(d => d.value || 0));

  return (
    <div className="chart-card">
      <div className="chart-header">{title}</div>
      <div className="chart-body">
        <svg width={width} height={height} className="bar-chart">
          {data.map((d, i) => {
            const h = maxValue > 0 ? Math.max(4, Math.round(((d.value || 0) / maxValue) * (height - 40))) : 4;
            const x = gap + i * (barWidth + gap);
            const y = height - h - 20;
            return (
              <g key={d.label || i}>
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={h} 
                  rx="8" 
                  className="bar"
                  fill="url(#barGradient)"
                />
                <text 
                  x={x + barWidth / 2} 
                  y={height - 4} 
                  textAnchor="middle" 
                  className="bar-label"
                >
                  {d.label}
                </text>
                <text 
                  x={x + barWidth / 2} 
                  y={y - 6} 
                  textAnchor="middle" 
                  className="bar-value"
                >
                  {d.value || 0}
                </text>
              </g>
            );
          })}
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

const PieChart = ({ title, value, total, colors = ['#667eea', '#e5e7eb'] }) => {
  const size = 180;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? Math.min(1, Math.max(0, value / total)) : 0;
  const dash = `${(progress * circumference).toFixed(2)} ${circumference.toFixed(2)}`;

  return (
    <div className="chart-card">
      <div className="chart-header">{title}</div>
      <div className="chart-body pie-wrap">
        <svg width={size} height={size} className="pie-chart">
          <g transform={`translate(${size / 2}, ${size / 2})`}>
            <circle 
              r={radius} 
              cx="0" 
              cy="0" 
              fill="transparent" 
              stroke={colors[1]} 
              strokeWidth={stroke} 
            />
            <circle 
              r={radius} 
              cx="0" 
              cy="0" 
              fill="transparent" 
              stroke={colors[0]} 
              strokeWidth={stroke} 
              strokeDasharray={dash} 
              transform="rotate(-90)" 
              strokeLinecap="round" 
            />
            <text 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="pie-center"
            >
              {Math.round(progress * 100)}%
            </text>
          </g>
        </svg>
        <div className="pie-legend">
          <div className="legend-item">
            <span className="legend-dot primary" />
            Giá trị: {value}
          </div>
          <div className="legend-item">
            <span className="legend-dot muted" />
            Tổng: {total}
          </div>
        </div>
      </div>
    </div>
  );
};

const Reports = () => {
  const { user } = useAuth();
  const permissions = usePermissions();
  const { toasts, addToast, removeToast } = useToast();
  const canView = permissions.canViewReports;

  const [projectStats, setProjectStats] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [taskProgressByProject, setTaskProgressByProject] = useState([]);
  const [tasksByMonth, setTasksByMonth] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  // Status icons mapping
  const statusIcons = {
    'Not Started': { icon: 'fa-pause-circle', color: '#94a3b8' },
    'In Progress': { icon: 'fa-spinner', color: '#3b82f6' },
    'Completed': { icon: 'fa-check-circle', color: '#22c55e' },
    'Pending': { icon: 'fa-clock', color: '#f59e0b' },
    'Planned': { icon: 'fa-calendar-alt', color: '#8b5cf6' },
    'Cancelled': { icon: 'fa-times-circle', color: '#ef4444' },
    'Testing': { icon: 'fa-flask', color: '#14b8a6' },
    'In Review': { icon: 'fa-search', color: '#06b6d4' },
    'Delayed': { icon: 'fa-exclamation-triangle', color: '#f97316' }
  };

  useEffect(() => {
    if (canView) {
      loadReports();
    }
  }, [canView]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [projectRes, taskRes, progressRes, monthRes, activityRes] = await Promise.all([
        reportService.getProjectStats(),
        reportService.getTaskStats(),
        reportService.getTaskProgressByProject(),
        reportService.getTasksByMonth(),
        reportService.getUserActivityStats()
      ]);

      if (projectRes.success) setProjectStats(projectRes.data);
      if (taskRes.success) setTaskStats(taskRes.data);
      if (progressRes.success) setTaskProgressByProject(progressRes.data);
      if (monthRes.success) setTasksByMonth(monthRes.data);
      if (activityRes.success) setUserActivity(activityRes.data);
    } catch (err) {
      addToast('Không thể tải báo cáo', 'danger');
    } finally {
      setLoading(false);
    }
  };

  if (!canView) {
    return (
      <div className="reports-page">
        <PageHeader
          icon="fa-chart-bar"
          title="BÁO CÁO"
          subtitle="Bạn không có quyền xem báo cáo."
        />
      </div>
    );
  }

  const monthChartData = tasksByMonth.map(item => ({
    label: item.month.substring(5), // Get MM from YYYY-MM
    value: parseInt(item.count)
  }));

  const progressChartData = taskProgressByProject.slice(0, 6).map(item => ({
    label: item.name.substring(0, 8),
    value: Math.round(parseFloat(item.avg_progress) || 0)
  }));

  return (
    <div className="reports-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <PageHeader
        icon="fa-chart-bar"
        title="BÁO CÁO TỔNG QUAN"
        subtitle="Thống kê và phân tích tiến độ dự án và công việc."
        actions={[
          {
            label: 'Làm mới',
            icon: 'fa-sync-alt',
            className: 'secondary',
            onClick: loadReports
          }
        ]}
      />

      {loading ? (
        <LoadingState message="Đang tải báo cáo..." />
      ) : (
        <div className="reports-content">
          <div className="reports-grid">
            {/* Project Stats */}
            {projectStats && (
              <div className="stats-card">
                <div className="stats-header">
                  <i className="fas fa-folder-open"></i>
                  <h3>📊 Thống kê dự án</h3>
                </div>
                <div className="stats-body">
                  <div className="stat-item">
                    <span className="stat-label">
                      <i className="fas fa-layer-group" style={{marginRight: '8px', color: '#667eea'}}></i>
                      Tổng số dự án
                    </span>
                    <span className="stat-value">{projectStats.total || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">
                      <i className="fas fa-pause-circle" style={{marginRight: '8px', color: '#94a3b8'}}></i>
                      Chưa bắt đầu
                    </span>
                    <span className="stat-value">{projectStats.not_started || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">
                      <i className="fas fa-spinner" style={{marginRight: '8px', color: '#3b82f6'}}></i>
                      Đang thực hiện
                    </span>
                    <span className="stat-value">{projectStats.in_progress || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">
                      <i className="fas fa-check-circle" style={{marginRight: '8px', color: '#22c55e'}}></i>
                      Hoàn thành
                    </span>
                    <span className="stat-value">{projectStats.completed || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Task Stats */}
            {taskStats && (
              <div className="stats-card">
                <div className="stats-header">
                  <i className="fas fa-tasks"></i>
                  <h3>✅ Thống kê công việc</h3>
                </div>
                <div className="stats-body">
                  <div className="stat-item">
                    <span className="stat-label">
                      <i className="fas fa-list-ul" style={{marginRight: '8px', color: '#667eea'}}></i>
                      Tổng số công việc
                    </span>
                    <span className="stat-value">{taskStats.total || 0}</span>
                  </div>
                  
                  {/* Dynamically render all statuses */}
                  {taskStats.statuses && taskStats.statuses.map((status) => {
                    const statusConfig = statusIcons[status] || { icon: 'fa-circle', color: '#64748b' };
                    const count = taskStats[status] || 0;
                    
                    return (
                      <div className="stat-item" key={status}>
                        <span className="stat-label">
                          <i className={`fas ${statusConfig.icon}`} style={{marginRight: '8px', color: statusConfig.color}}></i>
                          {status}
                        </span>
                        <span className="stat-value">{count}</span>
                      </div>
                    );
                  })}
                  
                  <div className="stat-item">
                    <span className="stat-label">
                      <i className="fas fa-chart-line" style={{marginRight: '8px', color: '#8b5cf6'}}></i>
                      Tiến độ trung bình
                    </span>
                    <span className="stat-value">{Math.round(parseFloat(taskStats.avg_progress) || 0)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Charts */}
            {monthChartData.length > 0 && (
              <BarChart title="📅 Công việc theo tháng" data={monthChartData} />
            )}

            {progressChartData.length > 0 && (
              <BarChart title="📈 Tiến độ theo dự án" data={progressChartData} max={100} />
            )}

            {taskStats && (
              <>
                <PieChart 
                  title="⏳ Tasks đang thực hiện" 
                  value={parseInt(taskStats['In Progress']) || 0} 
                  total={parseInt(taskStats.total) || 1} 
                />
                <PieChart 
                  title="🎯 Tasks hoàn thành" 
                  value={parseInt(taskStats['Completed']) || 0} 
                  total={parseInt(taskStats.total) || 1} 
                  colors={["#22c55e", "#e5e7eb"]} 
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
