import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmailScan from './pages/EmailScan';
import UrlScan from './pages/UrlScan';
import RealTimeScan from './pages/RealTimeScan';
import Admin from './pages/Admin';
import { authService } from './services/api';

// Route protection wrapper for authenticated pages
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const user = authService.getCurrentUser();
  const token = authService.getToken();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100 selection:bg-cyan-500/30 selection:text-cyan-400">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Dashboard & Scanner Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/email-scan" 
              element={
                <ProtectedRoute>
                  <EmailScan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/url-scan" 
              element={
                <ProtectedRoute>
                  <UrlScan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/realtime-scan" 
              element={
                <ProtectedRoute>
                  <RealTimeScan />
                </ProtectedRoute>
              } 
            />

            {/* Admin-only Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              } 
            />

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
