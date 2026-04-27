import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RiderAuthProvider } from './context/RiderAuthContext';
import RiderNavbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('riderToken');
  return token ? children : <Navigate to="/rider/login" />;
};

const RiderApp = () => {
  return (
    <RiderAuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/rider/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/rider" element={
              <ProtectedRoute>
                <RiderNavbar />
                <Navigate to="/rider/dashboard" />
              </ProtectedRoute>
            } />
            
            <Route path="/rider/dashboard" element={
              <ProtectedRoute>
                <RiderNavbar />
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/rider/orders" element={
              <ProtectedRoute>
                <RiderNavbar />
                <Orders />
              </ProtectedRoute>
            } />
            
            <Route path="/rider/profile" element={
              <ProtectedRoute>
                <RiderNavbar />
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/rider/login" />} />
          </Routes>
        </div>
      </Router>
    </RiderAuthProvider>
  );
};

export default RiderApp;
