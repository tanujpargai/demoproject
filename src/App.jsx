import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/UI/Toast';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Portfolio } from './pages/Portfolio';
import { Loader2 } from 'lucide-react';

// Loading screen helper
const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      <p className="text-sm text-slate-400">Loading TaskFlow...</p>
    </div>
  </div>
);

// Protected Route Guard (Redirects unauthenticated users to login)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Guard (Redirects authenticated users to dashboard)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Dashboard (Protected) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Profile (Protected) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Portfolio (Protected) */}
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              }
            />

            {/* Login (Public Only) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Sign Up (Public Only) */}
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
