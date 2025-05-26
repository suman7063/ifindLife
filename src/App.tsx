
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth';
import SimpleNavbar from '@/components/SimpleNavbar';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <SimpleNavbar />
          <main className="pt-20">
            <AppRoutes />
          </main>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
