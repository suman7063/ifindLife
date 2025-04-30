
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/admin-auth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AdminPermissions, defaultPermissions } from '@/contexts/admin-auth/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, UserPlus, Edit } from 'lucide-react';

const AdminUserManagement = () => {
  const { adminUsers, addAdmin, removeAdmin, isSuperAdmin, updateAdminPermissions } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<AdminPermissions>({...defaultPermissions});
  
  const handleAddUser = () => {
    if (newUsername && newPassword) {
      addAdmin(newUsername, newPassword, permissions);
      setNewUsername('');
      setNewPassword('');
      setPermissions({...defaultPermissions});
      setIsAddDialogOpen(false);
    } else {
      toast.error('Username and password are required');
    }
  };
  
  const handleRemoveUser = (username: string) => {
    if (confirm(`Are you sure you want to remove admin user '${username}'?`)) {
      removeAdmin(username);
    }
  };
  
  const openEditDialog = (username: string) => {
    const user = adminUsers.find(user => user.username === username);
    if (user) {
      setEditingUser(username);
      setPermissions({...user.permissions});
      setIsEditDialogOpen(true);
    }
  };
  
  const handleUpdatePermissions = () => {
    if (editingUser) {
      updateAdminPermissions(editingUser, permissions);
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  };
  
  const permissionItems = [
    { id: 'experts', label: 'Experts Management' },
    { id: 'expertApprovals', label: 'Expert Approvals' },
    { id: 'services', label: 'Services Management' },
    { id: 'herosection', label: 'Hero Section Editor' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'programs', label: 'Programs' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'referrals', label: 'Referrals' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact Submissions' },
    { id: 'adminUsers', label: 'Admin Users Management' },
    { id: 'settings', label: 'Admin Settings' }
  ];
  
  const handlePermissionChange = (permission: keyof AdminPermissions, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: checked
    }));
  };
  
  // Reset permissions to all false for new admin
  const resetPermissions = () => {
    const emptyPermissions = {...defaultPermissions};
    Object.keys(emptyPermissions).forEach(key => {
      emptyPermissions[key as keyof AdminPermissions] = false;
    });
    return emptyPermissions;
  };
  
  // Open add dialog with reset permissions
  const handleOpenAddDialog = () => {
    setPermissions(resetPermissions());
    setIsAddDialogOpen(true);
  };
  
  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You do not have permission to manage admin users. Please contact a super administrator.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admin User Management</CardTitle>
          <Button 
            onClick={handleOpenAddDialog}
            className="bg-ifind-aqua hover:bg-ifind-teal"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Add Admin
          </Button>
        </CardHeader>
        <CardContent>
          {adminUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {Object.entries(user.permissions)
                        .filter(([_, value]) => value)
                        .map(([key]) => key)
                        .slice(0, 3)
                        .join(", ")}
                      {Object.values(user.permissions).filter(Boolean).length > 3 && "..."}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(user.username)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Permissions
                        </Button>
                        {user.role !== 'superadmin' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveUser(user.username)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No admin users found.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Add Admin Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Admin User</DialogTitle>
            <DialogDescription>
              Create a new admin user with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-2">
              <h4 className="font-medium">Permissions</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Select the specific access rights for this admin user:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {permissionItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`add-${item.id}`}
                      checked={permissions[item.id as keyof AdminPermissions]}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(
                          item.id as keyof AdminPermissions, 
                          checked === true
                        )
                      }
                    />
                    <Label htmlFor={`add-${item.id}`}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-ifind-aqua hover:bg-ifind-teal" 
              onClick={handleAddUser}
            >
              Add Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Permissions Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Admin Permissions</DialogTitle>
            <DialogDescription>
              Update permissions for admin user: {editingUser}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {permissionItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`edit-${item.id}`}
                      checked={permissions[item.id as keyof AdminPermissions]}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(
                          item.id as keyof AdminPermissions, 
                          checked === true
                        )
                      }
                      disabled={editingUser === 'admin' || editingUser === 'IFLsuperadmin'}
                    />
                    <Label htmlFor={`edit-${item.id}`}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-ifind-aqua hover:bg-ifind-teal" 
              onClick={handleUpdatePermissions}
              disabled={editingUser === 'admin' || editingUser === 'IFLsuperadmin'}
            >
              Update Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
