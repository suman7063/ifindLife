
import React from 'react';
import { Users, UserCog } from 'lucide-react';
import MenuSection from '../MenuSection';

interface UserManagementSectionProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
  hasUsersPermission: boolean;
  isSuperAdmin: boolean;
}

const UserManagementSection: React.FC<UserManagementSectionProps> = ({
  activeTab,
  onTabChange,
  hasUsersPermission,
  isSuperAdmin
}) => {
  const items = [];
  
  if (hasUsersPermission) {
    items.push({
      icon: Users,
      label: "Users",
      isActive: activeTab === 'users',
      onClick: () => onTabChange('users')
    });
  }
  
  if (isSuperAdmin) {
    items.push({
      icon: UserCog,
      label: "Admin Users",
      isActive: activeTab === 'adminUsers',
      onClick: () => onTabChange('adminUsers')
    });
  }

  return (
    <MenuSection
      title="User Management"
      items={items}
      showSection={items.length > 0}
    />
  );
};

export default UserManagementSection;
