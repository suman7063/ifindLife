
import React from 'react';
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from 'lucide-react';

interface AdminSidebarMenuItemProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  tooltip?: string;
}

const AdminSidebarMenuItem: React.FC<AdminSidebarMenuItemProps> = ({
  label,
  icon: Icon,
  isActive,
  onClick,
  tooltip
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        isActive={isActive} 
        onClick={onClick}
        tooltip={tooltip || label}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default AdminSidebarMenuItem;
