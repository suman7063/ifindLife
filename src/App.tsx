
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/auth/AuthProvider';
import { UserAuthProvider } from './contexts/auth/UserAuthProvider';
import { AdminAuthProvider } from './contexts/admin-auth/AdminAuthProvider';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <UserAuthProvider>
          <AdminAuthProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </AdminAuthProvider>
        </UserAuthProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
