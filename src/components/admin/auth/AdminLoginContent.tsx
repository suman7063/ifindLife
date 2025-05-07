
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLoginForm from './AdminLoginForm';

interface AdminLoginContentProps {
  onLoginSuccess: () => void;
}

const AdminLoginContent: React.FC<AdminLoginContentProps> = ({ onLoginSuccess }) => {
  return (
    <Card className="border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Admin Login</CardTitle>
        <CardDescription>
          Access your administrator account to manage website content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminLoginForm onLoginSuccess={onLoginSuccess} />
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Default admin credentials:</p>
          <ul className="list-disc list-inside">
            <li>Superadmin: IFLsuperadmin</li>
            <li>Admin: admin</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLoginContent;
