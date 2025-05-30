// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import AssetPage from './pages/AssetPage';
import ModelPage from './pages/ModelPage';
import UserPage from './pages/UserPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <AssetPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/models"
            element={
              <ProtectedRoute>
                <ModelPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requireSuperadmin={true}>
                <UserPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/assets" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
