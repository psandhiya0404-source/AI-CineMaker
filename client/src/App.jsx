import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProjectsListPage } from './pages/projects/ProjectsListPage';
import { CreateProjectPage } from './pages/projects/CreateProjectPage';
import { StoryStudioPage } from './pages/studio/StoryStudioPage';
import { CharactersPage } from './pages/studio/CharactersPage';
import { SceneStudioPage } from './pages/studio/SceneStudioPage';
import { AiGenerationStudioPage } from './pages/studio/AiGenerationStudioPage';
import { VoiceStudioPage } from './pages/studio/VoiceStudioPage';
import { VideoEditorPage } from './pages/studio/VideoEditorPage';
import { FinalExportPage } from './pages/studio/FinalExportPage';
import { GenerationHistoryPage } from './pages/studio/GenerationHistoryPage';
import { SettingsPage } from './pages/settings/SettingsPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cine-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cine-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Filmmaking Application */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsListPage />} />
        <Route path="projects/new" element={<CreateProjectPage />} />
        <Route path="studio/story" element={<StoryStudioPage />} />
        <Route path="studio/characters" element={<CharactersPage />} />
        <Route path="studio/scenes" element={<SceneStudioPage />} />
        <Route path="studio/ai" element={<AiGenerationStudioPage />} />
        <Route path="studio/voice" element={<VoiceStudioPage />} />
        <Route path="studio/editor" element={<VideoEditorPage />} />
        <Route path="studio/export" element={<FinalExportPage />} />
        <Route path="history" element={<GenerationHistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default App;
