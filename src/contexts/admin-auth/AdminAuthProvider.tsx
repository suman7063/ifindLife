
import React, { createContext, useContext, useState } from 'react';

// Define the context type
interface AdminAuthContextType {
  isAdmin: boolean;
  adminLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => Promise<boolean>;
}

// Create context with default values
const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdmin: false,
  adminLoading: false,
  adminLogin: async () => false,
  adminLogout: async () => false
});

// Export a hook for using the admin auth context
export const useAdminAuth = () => useContext(AdminAuthContext);

// Provider component
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState<boolean>(false);

  // Mock admin login function
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setAdminLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just check if the email contains "admin"
      const loginSuccess = email.includes('admin') && password.length > 5;
      
      if (loginSuccess) {
        setIsAdmin(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setAdminLoading(false);
    }
  };
  
  // Admin logout function
  const adminLogout = async (): Promise<boolean> => {
    setAdminLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsAdmin(false);
      return true;
    } catch (error) {
      console.error('Admin logout error:', error);
      return false;
    } finally {
      setAdminLoading(false);
    }
  };

  // Provide the admin auth context to children components
  return (
    <AdminAuthContext.Provider 
      value={{ 
        isAdmin, 
        adminLoading, 
        adminLogin, 
        adminLogout 
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
