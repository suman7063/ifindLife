
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Toaster } from 'sonner';
import { UnifiedAuthProvider } from './contexts/auth/UnifiedAuthContext';
import { UserAuthProvider } from './contexts/auth/UserAuthProvider';
import { AdminAuthProvider } from './contexts/admin-auth/AdminAuthProvider';

const App: React.FC = () => {
  return (
    <Router>
      <UnifiedAuthProvider>
        <UserAuthProvider>
          <AdminAuthProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </AdminAuthProvider>
        </UserAuthProvider>
      </UnifiedAuthProvider>
    </Router>
  );
};

export default App;
