
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/admin-auth';
import { Plus, Trash2, Edit, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import PermissionManager from './PermissionManager';
import { AdminUser, AdminPermissions, AdminRole } from '@/contexts/admin-auth/types';
import { isSuperAdmin } from '@/components/admin/utils/permissionUtils';

// Default permissions for new admin users
const DEFAULT_ADMIN_PERMISSIONS: AdminPermissions = {
  canManageUsers: false,
  canManageExperts: true,
  canManageContent: true,
  canManageServices: true,
  canManagePrograms: true,
  canViewAnalytics: true,
  canDeleteContent: false,
  canApproveExperts: false,
  canManageBlog: true,
  canManageTestimonials: true
};

const AdminUsersManager: React.FC = () => {
  const { 
    adminUsers, 
    addAdmin, 
    removeAdmin, 
    isSuperAdmin: currentUserIsSuperAdmin, 
    currentUser,
    updateAdminPermissions
  } = useAuth();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [viewingPermissions, setViewingPermissions] = useState(false);

  const handleAddAdmin = () => {
    if (!newUsername || !newPassword) {
      toast.error('Username and password are required');
      return;
    }
    
    try {
      // Create a complete admin user object with all required properties
      addAdmin({
        username: newUsername,
        email: `${newUsername.toLowerCase()}@ifindlife.com`,
        role: 'admin' as AdminRole,
        permissions: DEFAULT_ADMIN_PERMISSIONS,
        lastLogin: new Date().toISOString()
      });
      
      setNewUsername('');
      setNewPassword('');
      setIsAddDialogOpen(false);
      toast.success(`Admin user '${newUsername}' added successfully`);
    } catch (error) {
      toast.error('Failed to add admin user');
      console.error('Error adding admin:', error);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    
    try {
      removeAdmin(userToDelete);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      toast.success(`Admin user removed successfully`);
    } catch (error) {
      toast.error('Failed to remove admin user');
      console.error('Error removing admin:', error);
    }
  };

  const openPermissionsView = (user: AdminUser) => {
    setSelectedUser(user);
    setViewingPermissions(true);
  };

  const handleUpdatePermissions = (userId: string, permissions: AdminPermissions) => {
    updateAdminPermissions(userId, permissions);
  };

  // Check if the current user is a super admin
  const userIsSuperAdmin = currentUser ? currentUserIsSuperAdmin(currentUser) : false;

  // Cannot delete self or superadmin accounts
  const canDeleteUser = (user: AdminUser): boolean => {
    return !!userIsSuperAdmin && !isSuperAdmin(user) && 
           user.username !== 'admin' && currentUser?.id !== user.id;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Admin Users</h2>
        {userIsSuperAdmin && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Admin
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.username}
                    {currentUser?.id === user.id && (
                      <Badge variant="outline" className="ml-2">You</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={isSuperAdmin(user) ? 'default' : 'secondary'}
                    >
                      {isSuperAdmin(user) ? 'Super Admin' : 'Admin'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isSuperAdmin(user) ? (
                      <span className="text-xs text-muted-foreground">All permissions</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {user.permissions && Object.entries(user.permissions).filter(([_, v]) => v).slice(0, 3).map(([key]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}
                          </Badge>
                        ))}
                        {user.permissions && Object.entries(user.permissions).filter(([_, v]) => v).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{Object.entries(user.permissions).filter(([_, v]) => v).length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => openPermissionsView(user)}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      {canDeleteUser(user) && (
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
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
        </CardContent>
      </Card>

      {/* Add Admin Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin User</DialogTitle>
            <DialogDescription>
              Create a new admin user with default permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                value={newUsername} 
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter password" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAdmin}>Add Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this admin user.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permissions Management Dialog */}
      <Dialog open={viewingPermissions} onOpenChange={setViewingPermissions}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>
              Configure access rights for this admin user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <PermissionManager 
              user={selectedUser}
              onSave={handleUpdatePermissions}
              isSuperAdmin={userIsSuperAdmin}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersManager;
