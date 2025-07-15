import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import StoryPage from "./pages/StoryPage";
import BreathingPage from "./pages/BreathingPage";
import GratitudeJournalPage from "./pages/GratitudeJournalPage";
import EmojiMatchPage from "./pages/EmojiMatchPage";
import EmotionWheelPage from "./pages/EmotionWheelPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/story" element={<StoryPage />} />
            <Route path="/activities/breathing" element={<BreathingPage />} />
            <Route path="/activities/gratitude" element={<GratitudeJournalPage />} />
            <Route path="/activities/emoji-match" element={<EmojiMatchPage />} />
            <Route path="/activities/emotion-wheel" element={<EmotionWheelPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
