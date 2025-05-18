
import React from 'react';
import DashboardOverview from './sections/DashboardOverview';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/admin-auth';

const AdminOverview: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="space-y-6 w-full">
      {/* Removed duplicate h1 title since it's already in the parent component */}
      
      <DashboardOverview />
      
      <div className="grid gap-4 md:grid-cols-2 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Admin Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Logged in as: {currentUser?.username}</p>
            <p>Role: {currentUser?.role}</p>
            <p>Last login: {currentUser?.lastLogin ? new Date(currentUser.lastLogin).toLocaleString() : 'First login'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p>System Version: 1.0.0</p>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            <p>Storage Used: 24%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
