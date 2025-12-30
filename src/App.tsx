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
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import StoryPage from "./pages/StoryPage";
import BreathingPage from "./pages/BreathingPage";
import GratitudeJournalPage from "./pages/GratitudeJournalPage";
import EmojiMatchPage from "./pages/EmojiMatchPage";
import EmotionWheelPage from "./pages/EmotionWheelPage";
import DrawMoodPage from "./pages/DrawMoodPage";
import ChildProgressPage from "./pages/ChildProgressPage";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

// Router component that handles routing
const AppRouter = () => {
  const { user, loading } = useAuth();

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
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/child" replace />} />
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/child" replace />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Home route */}
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/child" replace />} />
        <Route path="/child" element={user ? <HomePage /> : <Navigate to="/login" replace />} />
        
        {/* Protected routes */}
        <Route path="/activities" element={user ? <ActivitiesPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/story" element={user ? <StoryPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/draw" element={user ? <DrawMoodPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/breathing" element={user ? <BreathingPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/gratitude" element={user ? <GratitudeJournalPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/emoji-match" element={user ? <EmojiMatchPage /> : <Navigate to="/login" replace />} />
        <Route path="/activities/emotion-wheel" element={user ? <EmotionWheelPage /> : <Navigate to="/login" replace />} />
        
        {/* Progress and profile */}
        <Route path="/progress" element={user ? <ChildProgressPage /> : <Navigate to="/login" replace />} />
        <Route path="/child-progress" element={user ? <ChildProgressPage /> : <Navigate to="/login" replace />} />
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
