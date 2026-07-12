import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import ResumePage from './pages/ResumePage';
import RecommendationsPage from './pages/RecommendationsPage';
import RoadmapPage from './pages/RoadmapPage';
import SkillGapsPage from './pages/SkillGapsPage';
import InterviewsPage from './pages/InterviewsPage';
import MarketPage from './pages/MarketPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import NotificationsPage from './pages/NotificationsPage';
import LearningPage from './pages/LearningPage';
import AdminPage from './pages/AdminPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(0, 0%, 7.8%)',
            color: 'hsl(0, 0%, 98%)',
            border: '1px solid hsl(0, 0%, 14.9%)',
            borderRadius: '0.75rem',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="skill-gaps" element={<SkillGapsPage />} />
          <Route path="interviews" element={<InterviewsPage />} />
          <Route path="market" element={<MarketPage />} />
          <Route path="knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="admin/users" element={<AdminPage />} />
          <Route path="admin/analytics" element={<AdminPage />} />
          <Route path="admin/resources" element={<AdminPage />} />
          <Route path="admin/settings" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
