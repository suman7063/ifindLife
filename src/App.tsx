
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/auth/AuthContext';
import { UserAuthProvider } from './contexts/auth/UserAuthProvider';
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from './components/theme/theme-provider';
import { supabase } from './lib/supabase';

function App() {
  const [isDbConnected, setIsDbConnected] = useState<boolean | null>(null);
  
  // Check Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('check_connection').select('*');
        
        if (error) {
          console.error("Supabase connection error:", error);
          setIsDbConnected(false);
          return;
        }
        
        console.log("Connected to Supabase!");
        setIsDbConnected(true);
      } catch (err) {
        console.error("Error checking DB connection:", err);
        setIsDbConnected(false);
      }
    };
    
    checkConnection();
  }, []);
  
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <AuthProvider>
          <UserAuthProvider>
            <AppRoutes />
            <Toaster position="top-right" closeButton />
          </UserAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
