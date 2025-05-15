
import React, { useState } from 'react';
import { AdminUser, AdminPermissions } from '@/contexts/admin-auth/types';
import { defaultPermissionSet } from '@/components/admin/utils/permissionUtils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { isSuperAdmin } from '@/components/admin/utils/permissionUtils';
import { toast } from 'sonner';

interface PermissionManagerProps {
  user: AdminUser;
  onSave: (userId: string, permissions: AdminPermissions) => void;
  isSuperAdmin: boolean;
}

const PermissionManager: React.FC<PermissionManagerProps> = ({
  user,
  onSave,
  isSuperAdmin: currentUserIsSuperAdmin
}) => {
  const [permissions, setPermissions] = useState<AdminPermissions>(
    user.permissions || { ...defaultPermissionSet }
  );
  
  const [loading, setLoading] = useState(false);
  
  // Group permissions by category
  const permissionGroups = {
    'User Management': ['canManageUsers'],
    'Expert Management': ['canManageExperts', 'canApproveExperts'],
    'Content Management': ['canManageContent', 'canDeleteContent', 'canManageBlog', 'canManageTestimonials'],
    'Service Management': ['canManageServices', 'canManagePrograms'],
    'Analytics': ['canViewAnalytics']
  };
  
  const handleTogglePermission = (key: string) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Don't allow editing permissions for super admins
      if (isSuperAdmin(user)) {
        toast.error("Super admin permissions cannot be modified");
        return;
      }
      
      // Can only modify permissions if current user is super admin
      if (!currentUserIsSuperAdmin) {
        toast.error("Only super admins can modify permissions");
        return;
      }
      
      onSave(user.id, permissions);
      toast.success("Permissions updated successfully");
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error("Failed to update permissions");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectAll = () => {
    const newPermissions = { ...permissions };
    Object.keys(defaultPermissionSet).forEach(key => {
      newPermissions[key] = true;
    });
    setPermissions(newPermissions);
  };
  
  const handleSelectNone = () => {
    const newPermissions = { ...permissions };
    Object.keys(defaultPermissionSet).forEach(key => {
      newPermissions[key] = false;
    });
    setPermissions(newPermissions);
  };
  
  // If user is super admin, show all permissions as enabled and read-only
  const isUserSuperAdmin = user.role === 'superadmin' || user.role === 'super_admin';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">
            Permissions for {user.username || user.email}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isUserSuperAdmin 
              ? "Super admins have all permissions by default" 
              : "Configure what this admin user can access and modify"}
          </p>
        </div>
        
        {!isUserSuperAdmin && currentUserIsSuperAdmin && (
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={handleSelectNone}>
              Select None
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(permissionGroups).map(([groupName, permissionKeys]) => (
          <div key={groupName} className="space-y-3">
            <h4 className="font-medium">{groupName}</h4>
            
            {permissionKeys.map(key => (
              <div key={key} className="flex items-center justify-between space-x-3 py-1">
                <Label htmlFor={key} className="flex-1 cursor-pointer">
                  {formatPermissionName(key)}
                </Label>
                <Switch
                  id={key}
                  checked={isUserSuperAdmin ? true : Boolean(permissions[key])}
                  onCheckedChange={() => handleTogglePermission(key)}
                  disabled={isUserSuperAdmin || !currentUserIsSuperAdmin || loading}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {!isUserSuperAdmin && currentUserIsSuperAdmin && (
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading}
          >
            Save Permissions
          </Button>
        </div>
      )}
    </div>
  );
};

// Helper function to format permission name for display
const formatPermissionName = (key: string): string => {
  // Remove 'can' prefix and add spaces before capital letters
  return key
    .replace(/^can/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
};

export default PermissionManager;
