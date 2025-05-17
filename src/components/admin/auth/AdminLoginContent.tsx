
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLoginForm from './AdminLoginForm';

interface AdminLoginContentProps {
  onLoginSuccess: () => void;
  onLogin?: (username: string, password: string) => Promise<boolean>;
  isLoggingIn?: boolean;
}

const AdminLoginContent: React.FC<AdminLoginContentProps> = ({ 
  onLoginSuccess, 
  onLogin,
  isLoggingIn = false
}) => {
  return (
    <Card className="border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Admin Login</CardTitle>
        <CardDescription>
          Access your administrator account to manage website content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminLoginForm 
          onLoginSuccess={onLoginSuccess} 
          onLogin={onLogin}
          isLoading={isLoggingIn}
        />
      </CardContent>
    </Card>
  );
};

export default AdminLoginContent;
