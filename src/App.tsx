
import React, { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { UserAuthProvider } from '@/contexts/auth/UserAuthProvider';
import { BrowserRouter } from 'react-router-dom';

// Import Tailwind base styles
import './App.css';

const App: React.FC = () => {
  // Log that the app is rendering
  useEffect(() => {
    console.log('App component rendering with AuthProvider');
  }, []);

  return (
    <AuthProvider>
      <UserAuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UserAuthProvider>
    </AuthProvider>
  );
};

export default App;
