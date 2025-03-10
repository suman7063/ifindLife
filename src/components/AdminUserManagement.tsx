
import React, { useState } from 'react';
import { UserPlus, Shield, UserX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';

const AdminUserManagement = () => {
  const { adminUsers, addAdmin, removeAdmin, isSuperAdmin, currentUser } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Only super admins can access this component
  if (!isSuperAdmin) {
    return null;
  }

  const handleAddAdmin = () => {
    // Validate inputs
    if (!newUsername.trim()) {
      alert('Username cannot be empty');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Add new admin
    const success = addAdmin(newUsername, newPassword);
    if (success) {
      // Reset form
      setNewUsername('');
      setNewPassword('');
      setConfirmPassword('');
      setIsOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-ifind-teal" />
          Admin User Management
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ifind-aqua hover:bg-ifind-teal">
              <UserPlus className="mr-2 h-4 w-4" /> Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <Input 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input 
                  type="password"
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <Input 
                  type="password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  className="bg-ifind-aqua hover:bg-ifind-teal"
                  onClick={handleAddAdmin}
                >
                  Add Admin
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Admin Users</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminUsers.map((user) => (
                <tr key={user.username}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.username}
                    {currentUser?.username === user.username && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role !== 'superadmin' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeAdmin(user.username)}
                      >
                        <UserX className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
