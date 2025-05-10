
import React from 'react';
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  disabled = false
}) => {
  return (
    <button
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
        active 
          ? "bg-ifind-aqua text-white font-medium" 
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-4 w-4 mr-3" />
      <span>{label}</span>
      {active && (
        <div className="ml-auto h-full w-1 bg-ifind-purple rounded-full"></div>
      )}
    </button>
  );
};

export default SidebarMenuItem;
