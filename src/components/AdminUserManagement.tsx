
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/admin-auth';
import { AdminPermission, defaultPermissions } from '@/contexts/admin-auth/types';

const AdminUserManagement = () => {
  const { currentUser } = useAuth();
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get available permissions from defaultPermissions
  const allPermissions: AdminPermission[] = Object.values(defaultPermissions)
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index) as AdminPermission[];

  useEffect(() => {
    // Fetch admin users
    const fetchAdminUsers = async () => {
      try {
        // This would fetch from your database in a real implementation
        setAdminUsers([
          { 
            id: '1', 
            name: 'Admin User',
            email: 'admin@example.com', 
            role: 'superadmin',
            permissions: defaultPermissions['superadmin']
          },
          { 
            id: '2', 
            name: 'Content Editor',
            email: 'editor@example.com', 
            role: 'editor',
            permissions: defaultPermissions['editor']
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin users:', error);
        setLoading(false);
      }
    };
    
    fetchAdminUsers();
  }, []);

  const handleAddUser = () => {
    // Implementation for adding a new admin user
    console.log('Add user functionality to be implemented');
  };

  const handleEditPermissions = (userId: string) => {
    // Implementation for editing user permissions
    console.log(`Edit permissions for user ${userId}`);
  };

  if (loading) {
    return <div className="p-4">Loading admin users...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admin User Management</h2>
      
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Admin Users ({adminUsers.length})</h3>
          <p className="text-muted-foreground text-sm">
            Manage access and permissions for admin users
          </p>
        </div>
        
        <button
          onClick={handleAddUser}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Add Admin User
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/20">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Permissions</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.slice(0, 3).map((permission: string) => (
                      <span 
                        key={permission}
                        className="bg-secondary/30 text-xs px-2 py-1 rounded"
                      >
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                    {user.permissions.length > 3 && (
                      <span className="bg-secondary/30 text-xs px-2 py-1 rounded">
                        +{user.permissions.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleEditPermissions(user.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;
