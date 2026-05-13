import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import VerifyOTPPage from './pages/auth/VerifyOTPPage';

import DashboardOverview from './pages/dashboard/DashboardOverview';
import CreateCertificationPage from './pages/dashboard/CreateCertification';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes wrapped in standard Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
        </Route>

        {/* Dashboard Routes wrapped in Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="create-certification" element={<CreateCertificationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
