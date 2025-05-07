
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/contexts/admin-auth';
import { AdminUser, AdminPermissions, defaultPermissions } from '@/contexts/admin-auth/types';
import { canManageUser, formatPermissionName } from '../utils/permissionUtils';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';

const AdminUsersManager: React.FC = () => {
  const { 
    adminUsers, 
    addAdmin, 
    removeAdmin,
    updateAdminPermissions, 
    currentUser,
  } = useAuth();
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  // New admin user form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPermissions, setNewPermissions] = useState<AdminPermissions>(defaultPermissions);
  
  // Load admin users
  useEffect(() => {
    setUsers(adminUsers);
    setLoading(false);
  }, [adminUsers]);
  
  // Handle form submission for adding a new admin user
  const handleAddUser = () => {
    if (!newUsername || !newPassword) {
      toast.error('Username and password are required');
      return;
    }
    
    try {
      addAdmin(newUsername, newPassword, newPermissions);
      setOpenDialog(false);
      resetForm();
      toast.success('Admin user added successfully');
    } catch (error) {
      toast.error('Failed to add admin user');
      console.error('Error adding admin user:', error);
    }
  };
  
  // Handle updating an existing admin user
  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    try {
      updateAdminPermissions(selectedUser.username, newPermissions);
      setOpenDialog(false);
      resetForm();
      toast.success('Admin user updated successfully');
    } catch (error) {
      toast.error('Failed to update admin user');
      console.error('Error updating admin user:', error);
    }
  };
  
  // Handle deleting an admin user
  const handleDeleteUser = (username: string) => {
    if (window.confirm(`Are you sure you want to delete admin user "${username}"?`)) {
      try {
        removeAdmin(username);
        toast.success('Admin user deleted successfully');
      } catch (error) {
        toast.error('Failed to delete admin user');
        console.error('Error deleting admin user:', error);
      }
    }
  };
  
  // Open the edit dialog for an existing user
  const openEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setNewPermissions(user.permissions as AdminPermissions);
    setEditMode(true);
    setOpenDialog(true);
  };
  
  // Open the dialog for adding a new user
  const openAddDialog = () => {
    resetForm();
    setEditMode(false);
    setOpenDialog(true);
  };
  
  // Reset the form
  const resetForm = () => {
    setNewUsername('');
    setNewPassword('');
    setNewPermissions(defaultPermissions);
    setSelectedUser(null);
  };
  
  // Handle permission checkbox change
  const handlePermissionChange = (permission: keyof AdminPermissions, checked: boolean) => {
    setNewPermissions(prev => ({
      ...prev,
      [permission]: checked
    }));
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading admin users...</span>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Admin Users</CardTitle>
        <Button variant="outline" onClick={openAddDialog}>Add New Admin</Button>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center p-8 bg-muted/30 rounded-md">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No admin users found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.username}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.permissions && Object.entries(user.permissions)
                      .filter(([_, value]) => value === true)
                      .map(([key, _]) => key)
                      .slice(0, 3)
                      .join(', ')}
                    {user.permissions && 
                      Object.values(user.permissions).filter(value => value === true).length > 3 && 
                      '...'}
                  </TableCell>
                  <TableCell className="text-right">
                    {canManageUser(currentUser, user) ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>Edit</Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteUser(user.username)}
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">Cannot manage</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {/* Add/Edit User Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Admin User' : 'Add New Admin User'}</DialogTitle>
              <DialogDescription>
                {editMode 
                  ? `Update permissions for ${selectedUser?.username}` 
                  : 'Create a new admin user with custom permissions'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Username and Password fields - only shown in Add mode */}
              {!editMode && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={newUsername} 
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter username" 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter password" 
                    />
                  </div>
                </>
              )}
              
              {/* Permissions section */}
              <div className="grid gap-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(defaultPermissions).map((permission) => (
                    <div className="flex items-center space-x-2" key={permission}>
                      <Checkbox 
                        id={permission}
                        checked={newPermissions[permission as keyof AdminPermissions]}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(
                            permission as keyof AdminPermissions, 
                            !!checked
                          )
                        }
                      />
                      <Label htmlFor={permission} className="cursor-pointer">
                        {formatPermissionName(permission)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editMode ? handleUpdateUser : handleAddUser}
              >
                {editMode ? 'Update' : 'Add'} User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminUsersManager;
