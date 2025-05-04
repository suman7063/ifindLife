
import React, { useState, useEffect } from 'react';
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
        // Use a different approach to check connection since "check_connection" table doesn't exist
        const { data, error } = await supabase.from('users').select('count(*)').limit(1);
        
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
      <AuthProvider>
        <UserAuthProvider>
          <AppRoutes />
          <Toaster position="top-right" closeButton />
        </UserAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
