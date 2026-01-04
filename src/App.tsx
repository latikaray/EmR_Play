import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ProfilePage from "./pages/ProfilePage";
import ParentLoginPage from "./pages/ParentLoginPage";
import ChildLoginPage from "./pages/ChildLoginPage";
import ParentSignUpPage from "./pages/ParentSignUpPage";
import ChildSignUpPage from "./pages/ChildSignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import StoryPage from "./pages/StoryPage";
import BreathingPage from "./pages/BreathingPage";
import GratitudeJournalPage from "./pages/GratitudeJournalPage";
import EmojiMatchPage from "./pages/EmojiMatchPage";
import EmotionWheelPage from "./pages/EmotionWheelPage";
import DrawMoodPage from "./pages/DrawMoodPage";
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
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-gradient-background flex items-center justify-center">
      <div className="text-2xl font-comic">Loading...</div>
    </div>;
  }

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/welcome" element={<LandingPage />} />
        
        {/* Separate login pages */}
        <Route path="/parent/login" element={!user ? <ParentLoginPage /> : <Navigate to="/parent" replace />} />
        <Route path="/child/login" element={!user ? <ChildLoginPage /> : <Navigate to="/child" replace />} />
        <Route path="/parent/signup" element={!user ? <ParentSignUpPage /> : <Navigate to="/parent" replace />} />
        <Route path="/child/signup" element={!user ? <ChildSignUpPage /> : <Navigate to="/child" replace />} />
        
        {/* OTP and password routes */}
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Role-based home routes */}
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to={role === 'parent' ? '/parent' : '/child'} replace />} />
        
        {/* Child routes - only accessible by children */}
        <Route path="/child" element={user && role === 'child' ? <HomePage /> : <Navigate to="/child/login" replace />} />
        <Route path="/activities" element={user && role === 'child' ? <ActivitiesPage /> : <Navigate to="/child/login" replace />} />
        <Route path="/activities/story" element={user && role === 'child' ? <StoryPage /> : <Navigate to="/child/login" replace />} />
        <Route path="/activities/draw" element={user && role === 'child' ? <DrawMoodPage /> : <Navigate to="/child/login" replace />} />
        <Route path="/activities/breathing" element={user && role === 'child' ? <BreathingPage /> : <Navigate to="/child/login" replace />} />
        <Route path="/activities/gratitude" element={user && role === 'child' ? <GratitudeJournalPage /> : <Navigate to="/child/login" replace />} />
        <Route path="/activities/emoji-match" element={user && role === 'child' ? <EmojiMatchPage /> : <Navigate to="/child/login" replace />} />
        <Route path="/activities/emotion-wheel" element={user && role === 'child' ? <EmotionWheelPage /> : <Navigate to="/child/login" replace />} />
        <Route path="/child-progress" element={user && role === 'child' ? <ChildProgressPage /> : <Navigate to="/child/login" replace />} />
        
        {/* Parent routes - only accessible by parents */}
        <Route path="/parent" element={user && role === 'parent' ? <ParentHomePage /> : <Navigate to="/parent/login" replace />} />
        <Route path="/parent/role-play" element={user && role === 'parent' ? <ParentRolePlayPage /> : <Navigate to="/parent/login" replace />} />
        <Route path="/parent/quizzes" element={user && role === 'parent' ? <ParentQuizzesPage /> : <Navigate to="/parent/login" replace />} />
        <Route path="/parent/journal" element={user && role === 'parent' ? <ParentJournalPage /> : <Navigate to="/parent/login" replace />} />
        <Route path="/parent/child-progress" element={user && role === 'parent' ? <ChildProgressPage /> : <Navigate to="/parent/login" replace />} />
        
        {/* Shared routes */}
        <Route path="/progress" element={user ? <ChildProgressPage /> : <Navigate to="/welcome" replace />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/welcome" replace />} />
        
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