
import React from 'react';
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        className={cn(
          isActive && "bg-ifind-teal/10 text-ifind-teal font-medium"
        )}
      >
        <Icon className={cn("h-4 w-4", isActive && "text-ifind-teal")} />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default AdminSidebarMenuItem;
