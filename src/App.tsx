import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import StoryPage from "./pages/StoryPage";
import BreathingPage from "./pages/BreathingPage";
import GratitudeJournalPage from "./pages/GratitudeJournalPage";
import EmojiMatchPage from "./pages/EmojiMatchPage";
import EmotionWheelPage from "./pages/EmotionWheelPage";
import ParentHomePage from "./pages/ParentHomePage";
import ParentRolePlayPage from "./pages/ParentRolePlayPage";
import ParentQuizzesPage from "./pages/ParentQuizzesPage";
import ParentJournalPage from "./pages/ParentJournalPage";
import ChildProgressPage from "./pages/ChildProgressPage";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

// Router component that handles role-based routing
const AppRouter = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-gradient-background flex items-center justify-center">
      <div className="text-2xl font-comic">Loading...</div>
    </div>;
  }

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={profile?.role === 'parent' ? '/parent' : '/'} replace />} />
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to={profile?.role === 'parent' ? '/parent' : '/'} replace />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Protected routes - Child */}
        <Route path="/" element={<HomePage />} />
        <Route path="/activities" element={user && profile?.role === 'child' ? <ActivitiesPage /> : !user ? <ActivitiesPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/story" element={user && profile?.role === 'child' ? <StoryPage /> : !user ? <StoryPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/breathing" element={user && profile?.role === 'child' ? <BreathingPage /> : !user ? <BreathingPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/gratitude" element={user && profile?.role === 'child' ? <GratitudeJournalPage /> : !user ? <GratitudeJournalPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/emoji-match" element={user && profile?.role === 'child' ? <EmojiMatchPage /> : !user ? <EmojiMatchPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/emotion-wheel" element={user && profile?.role === 'child' ? <EmotionWheelPage /> : !user ? <EmotionWheelPage /> : <Navigate to="/login" replace />} />
        
        {/* Protected routes - Parent */}
        <Route path="/parent" element={<ParentHomePage />} />
        <Route path="/parent/role-play" element={user && profile?.role === 'parent' ? <ParentRolePlayPage /> : !user ? <ParentRolePlayPage /> : <Navigate to="/login" replace />} />
        <Route path="/parent/quizzes" element={user && profile?.role === 'parent' ? <ParentQuizzesPage /> : !user ? <ParentQuizzesPage /> : <Navigate to="/login" replace />} />
        <Route path="/parent/journal" element={user && profile?.role === 'parent' ? <ParentJournalPage /> : !user ? <ParentJournalPage /> : <Navigate to="/login" replace />} />
        <Route path="/parent/child-progress" element={user && profile?.role === 'parent' ? <ChildProgressPage /> : !user ? <ChildProgressPage /> : <Navigate to="/login" replace />} />
        
        {/* Shared routes */}
        <Route path="/progress" element={<ChildProgressPage />} />
        <Route path="/child-progress" element={user && profile?.role === 'child' ? <ChildProgressPage /> : !user ? <ChildProgressPage /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
