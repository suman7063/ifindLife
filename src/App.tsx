
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { UserAuthProvider } from '@/contexts/auth/UserAuthProvider';

// Import Tailwind base styles
import './App.css';

const App: React.FC = () => {
  // Log that the app is rendering
  useEffect(() => {
    console.log('App component rendering with AuthProvider');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <UserAuthProvider>
          <AppRoutes />
        </UserAuthProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
