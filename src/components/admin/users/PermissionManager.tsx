
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AdminUser, AdminPermissions } from '@/contexts/admin-auth/types';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';

interface PermissionManagerProps {
  user: AdminUser;
  onSave: (username: string, permissions: AdminPermissions) => void;
  isSuperAdmin: boolean;
}

interface PermissionGroupProps {
  title: string;
  permissions: string[];
  currentPermissions: AdminPermissions;
  onChange: (key: string, value: boolean) => void;
  disabled?: boolean;
}

const PermissionGroup: React.FC<PermissionGroupProps> = ({ 
  title, 
  permissions, 
  currentPermissions, 
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2 mb-4">
      <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {permissions.map((permission) => (
          <div key={permission} className="flex items-center space-x-2">
            <Checkbox 
              id={`permission-${permission}`}
              checked={!!currentPermissions[permission]} 
              onCheckedChange={(checked) => onChange(permission, !!checked)}
              disabled={disabled}
            />
            <label 
              htmlFor={`permission-${permission}`}
              className={`text-sm ${disabled ? 'text-muted-foreground' : ''}`}
            >
              {permission.charAt(0).toUpperCase() + permission.slice(1)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const PermissionManager: React.FC<PermissionManagerProps> = ({ user, onSave, isSuperAdmin }) => {
  const [permissions, setPermissions] = useState<AdminPermissions>({ ...user.permissions });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Group permissions by category
  const contentPermissions = ['herosection', 'testimonials', 'blog'];
  const userPermissions = ['experts', 'expertApprovals'];
  const programPermissions = ['programs', 'sessions'];
  const communicationPermissions = ['contact', 'referrals'];
  const systemPermissions = ['settings', 'services'];

  const handlePermissionChange = (key: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      onSave(user.id, permissions);
      toast.success(`Permissions updated for ${user.username}`);
    } catch (error) {
      toast.error('Failed to update permissions');
      console.error('Error updating permissions:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if this is a superadmin (cannot edit their own permissions)
  const isSuperAdminUser = user.role === 'superadmin';
  const isDisabled = isSuperAdminUser || isSubmitting;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex flex-row justify-between items-center">
          <div>
            Permissions for <span className="font-bold">{user.username}</span>
            {isSuperAdminUser && (
              <span className="ml-2 text-sm text-ifind-teal">(Super Admin)</span>
            )}
          </div>
          <Button 
            onClick={handleSave} 
            size="sm" 
            variant="outline" 
            disabled={isDisabled}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSuperAdminUser && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
            Super admin users have all permissions by default and cannot be modified.
          </div>
        )}
        
        <PermissionGroup 
          title="Content Management" 
          permissions={contentPermissions}
          currentPermissions={permissions}
          onChange={handlePermissionChange}
          disabled={isDisabled}
        />
        
        <Separator className="my-4" />
        
        <PermissionGroup 
          title="User Management" 
          permissions={userPermissions}
          currentPermissions={permissions}
          onChange={handlePermissionChange}
          disabled={isDisabled}
        />
        
        <Separator className="my-4" />
        
        <PermissionGroup 
          title="Program Management" 
          permissions={programPermissions}
          currentPermissions={permissions}
          onChange={handlePermissionChange}
          disabled={isDisabled}
        />
        
        <Separator className="my-4" />
        
        <PermissionGroup 
          title="Communication" 
          permissions={communicationPermissions}
          currentPermissions={permissions}
          onChange={handlePermissionChange}
          disabled={isDisabled}
        />
        
        <Separator className="my-4" />
        
        <PermissionGroup 
          title="System" 
          permissions={systemPermissions}
          currentPermissions={permissions}
          onChange={handlePermissionChange}
          disabled={isDisabled}
        />
      </CardContent>
    </Card>
  );
};

export default PermissionManager;
