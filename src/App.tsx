
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/auth/AuthProvider';
import { UserAuthProvider } from './contexts/auth/UserAuthProvider';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <UserAuthProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </UserAuthProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
