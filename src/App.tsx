
import React from 'react';
import { AuthProvider } from './contexts/auth/AuthContext';
import AppRoutes from './AppRoutes';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
