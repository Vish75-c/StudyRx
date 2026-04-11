import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedLayout from "@/components/Common/ProtectedLayout";
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import CollectionPage from "@/pages/CollectionPage";
import CollectionDetailPage from "@/pages/CollectionDetailPage";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import QuizPage from "@/pages/QuizPage";
import QuizGeneratePage from "@/pages/QuizGeneratePage";
import QuizAttemptPage from "@/pages/QuizAttemptPage";
import QuizResultPage from "@/pages/QuizResultPage";
import QuizHistoryPage from "@/pages/QuizHistoryPage";
import useAuthStore from "@/stores/authStore";

/* Redirects logged-in users away from public/auth pages */
function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          },
        }}
      />
      <Routes>
        {/* Public Routes — redirect to dashboard if already logged in */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard"       element={<DashboardPage />} />
          <Route path="/collections"     element={<CollectionPage />} />
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
          <Route path="/chats"           element={<ChatPage />} />
          <Route path="/chats/:id"       element={<ChatPage />} />
          <Route path="/profile"         element={<ProfilePage />} />
          <Route path="/quiz"                          element={<QuizPage />} />
          <Route path="/quiz/history"                  element={<QuizHistoryPage />} />
          <Route path="/quiz/generate/:collectionId"   element={<QuizGeneratePage />} />
          <Route path="/quiz/:id/attempt"              element={<QuizAttemptPage />} />
          <Route path="/quiz/:id/result"               element={<QuizResultPage />} />
          <Route path="/quiz/:id/attempts/:attemptId"  element={<QuizResultPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}