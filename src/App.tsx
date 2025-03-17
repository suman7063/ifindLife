
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MigrateData from './pages/MigrateData';
import { UserAuthProvider } from '@/contexts/UserAuthContext';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Login } from './pages/Login';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <UserAuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/migrate-data" element={<MigrateData />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </Router>
    </UserAuthProvider>
  );
}

export default App;
