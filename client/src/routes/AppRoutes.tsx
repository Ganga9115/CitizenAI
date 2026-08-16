import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Common Components / Pages
import { ProfilePage } from '../components/common/ProfilePage';
import { Notification } from '../components/common/Notification';

// Pages
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DepartmentScoreboardPage } from '../pages/scoreboard/DepartmentScoreboardPage';

// Citizen Pages
import { CitizenDashboard } from '../pages/citizen/CitizenDashboard';
import { RaiseComplaintPage } from '../pages/citizen/RaiseComplaintPage';
import { ComplaintDetailsPage } from '../pages/citizen/ComplaintDetailsPage';

// Officer Pages
import { OfficerDashboard } from '../pages/officer/OfficerDashboard';
import { OfficerAnalysis } from '../pages/officer/OfficerAnalysis';
import { OfficerHistory } from '../pages/officer/OfficerHistory';
import { OfficerMapPage } from '../pages/officer/OfficerMapPage';
// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { SystemLogsPage } from '../pages/admin/SystemLogsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/scoreboard" element={<DepartmentScoreboardPage />} />

      {/* Shared Authenticated Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN', 'OFFICER', 'ADMIN']}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN', 'OFFICER', 'ADMIN']}>
            <Notification />
          </ProtectedRoute>
        }
      />

      {/* Citizen Protected Routes */}
      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/raise"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <RaiseComplaintPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/complaint/:id"
        element={
          <ProtectedRoute allowedRoles={['CITIZEN']}>
            <ComplaintDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Officer Protected Routes */}
      <Route
        path="/officer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/analysis"
        element={
          <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
            <OfficerAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/history"
        element={
          <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
            <OfficerHistory />
          </ProtectedRoute>
        }
      />
       <Route
  path="/officer/map"
  element={
    <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
      <OfficerMapPage />
    </ProtectedRoute>
  }
/>
      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <SystemLogsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};