import React from 'react';

import {
  BrowserRouter
} from 'react-router-dom';

import {
  AuthProvider
} from './contexts/AuthContext';

import {
  NotificationProvider
} from './contexts/NotificationContext';

import {
  AppRoutes
} from './routes/AppRoutes';

import {
  ChatWidget
} from './components/citizen/ChatWidget';

export const App: React.FC = () => {

  return (
    <BrowserRouter>

      <AuthProvider>

        <NotificationProvider>

          <AppRoutes />

          {/* =================================================
              CitizenAssist

              Guest:
              Generic help

              Citizen:
              Personal complaint assistance

              Officer/Admin:
              Component automatically returns null
          ================================================= */}

          <ChatWidget />

        </NotificationProvider>

      </AuthProvider>

    </BrowserRouter>
  );
};

export default App;