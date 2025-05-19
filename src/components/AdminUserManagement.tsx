
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/admin-auth';
import { AdminPermissions } from '@/contexts/admin-auth/types';

// Default permissions to be used when creating a new admin
const initialPermissions: AdminPermissions = {
  canManageUsers: false,
  canManageExperts: false,
  canManageContent: false,
  canManageServices: false,
  canManagePrograms: false,
  canViewAnalytics: false,
  canDeleteContent: false,
  canApproveExperts: false,
  canManageBlog: false,
  canManageTestimonials: false
};

const AdminUserManagement: React.FC = () => {
  const { currentUser, adminUsers, isAuthenticated, hasPermission, isSuperAdmin } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  if (!isAuthenticated || !currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You must be logged in as an admin to manage users.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Check if user has permission to manage users
  if (!isSuperAdmin(currentUser) && !hasPermission(currentUser, 'canManageUsers')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have permission to manage users.</p>
        </CardContent>
      </Card>
    );
  }
  
  const handleAddUser = () => {
    if (!newUsername) return;
    setIsAddingUser(true);
    // Implementation would go here
    setIsAddingUser(false);
    setNewUsername('');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Current Admin Users</h3>
          <div className="space-y-2">
            {adminUsers.map(admin => (
              <div key={admin.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <span className="font-semibold">{admin.username}</span>
                  <span className="ml-2 text-sm text-muted-foreground">({admin.role})</span>
                </div>
                {admin.id !== currentUser.id && isSuperAdmin(currentUser) && (
                  <Button variant="destructive" size="sm">Remove</Button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {isSuperAdmin(currentUser) && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Add New Admin</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Username"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button onClick={handleAddUser} disabled={isAddingUser}>
                {isAddingUser ? 'Adding...' : 'Add User'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUserManagement;
