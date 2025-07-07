import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings, Shield } from 'lucide-react';
import { useAdminAuthClean } from '@/contexts/AdminAuthClean';

const AdminUsersManagerPlaceholder: React.FC = () => {
  const adminAuth = useAdminAuthClean();
  const currentUser = adminAuth?.admin;

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage admin users and permissions</p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admin Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">+0 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Current: {currentUser?.role === 'superadmin' ? 'You' : 'Other'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Your session</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {currentUser?.name?.[0] || 'A'}
                </div>
                <div>
                  <p className="font-medium">{currentUser?.name || currentUser?.id}</p>
                  <p className="text-sm text-muted-foreground">{currentUser?.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 text-sm">● Active</span>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
            
            <div className="text-center p-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>User management functionality will be available soon.</p>
              <p className="text-sm">Currently using clean authentication system.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersManagerPlaceholder;