import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home/Home';
// import LearnMore from '../pages/learnMore/LearnMore';
import NotFound from '../pages/notFound/NotFound';
import Login from '../pages/auth/login/Login';
import Register from '../pages/auth/register/Register';
import ProtectedRoute from '../components/protectedRoute/ProtectedRoute';
import Projects from '../pages/projects/Projects';
import Tasks from '../pages/tasks/Tasks';
import MyTasks from '../pages/myTasks/MyTasks';
import Team from '../pages/team/Team';
import Notifications from '../pages/notifications/Notifications';
import Reports from '../pages/reports/Reports';
import Chat from '../pages/chat/Chat';
import Profile from '../pages/profile/Profile';
import AIChat from '../pages/aiChat/AIChat';
import MainLayout from '../layouts/mainLayout/MainLayout';
import Workspaces from '../pages/workspaces/Workspaces';
import Admin from '../pages/admin/Admin';
import Events from '../pages/events/Events';
import News from '../pages/news/News';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<Navigate to="/#about" replace />} />
      <Route path="/services" element={<Navigate to="/#services" replace />} />
      <Route path="/contact" element={<Navigate to="/#contact" replace />} />
      {/* <Route path="/learn-more" element={<LearnMore />} /> */}
      
      {/* Admin Panel - Chỉ Admin */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <Admin />
        </ProtectedRoute>
      } />

      {/* Chọn / tạo không gian làm việc - layout riêng */}
      <Route path="/workspaces" element={
        <ProtectedRoute>
          <Workspaces />
        </ProtectedRoute>
      } />
      
      {/* Sự kiện và Tin tức - không cần đăng nhập */}
      <Route path="/events" element={<Events />} />
      <Route path="/news" element={<News />} />
      
      {/* Main Layout Routes - Quản lý dự án */}
      <Route path="/projects" element={
        <ProtectedRoute allowedRoles={['pm', 'tl', 'mb', 'clt']} requireWorkspace={true}>
          <MainLayout>
            <Projects />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Tasks - Tất cả role có thể xem */}
      <Route path="/tasks" element={
        <ProtectedRoute allowedRoles={['pm', 'tl', 'mb']} requireWorkspace={true}>
          <MainLayout>
            <Tasks />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* My Tasks - Tất cả role */}
      <Route path="/my-tasks" element={
        <ProtectedRoute allowedRoles={['pm', 'tl', 'mb']} requireWorkspace={true}>
          <MainLayout>
            <MyTasks />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Team - Chỉ TL, PM, Admin */}
      <Route path="/team" element={
        <ProtectedRoute requireLeaderOrAbove={true} requireWorkspace={true}>
          <MainLayout>
            <Team />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Notifications - Tất cả role */}
      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={['pm', 'tl', 'mb', 'clt']} requireWorkspace={true}>
          <MainLayout>
            <Notifications />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Reports - Chỉ TL, PM, Admin */}
      <Route path="/reports" element={
        <ProtectedRoute requireLeaderOrAbove={true} requireWorkspace={true}>
          <MainLayout>
            <Reports />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Chat - Tất cả role */}
      <Route path="/chat" element={
        <ProtectedRoute allowedRoles={['pm', 'tl', 'mb', 'clt']} requireWorkspace={true}>
          <MainLayout>
            <Chat />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* AI Chat - Tất cả role */}
      <Route path="/ai-chat" element={
        <ProtectedRoute allowedRoles={['pm', 'tl', 'mb', 'clt']} requireWorkspace={true}>
          <MainLayout>
            <AIChat />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Profile - Tất cả role */}
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['pm', 'tl', 'mb', 'clt']} requireWorkspace={true}>
          <MainLayout>
            <Profile />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Auth routes - Không cần đăng nhập */}
      <Route path="/login" element={
        <ProtectedRoute requireAuth={false}>
          <Login />
        </ProtectedRoute>
      } />
      <Route path="/register" element={
        <ProtectedRoute requireAuth={false}>
          <Register />
        </ProtectedRoute>
      } />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter; 
