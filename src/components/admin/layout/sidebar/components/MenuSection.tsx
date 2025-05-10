
import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { LucideIcon } from "lucide-react";

interface MenuSectionItem {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

interface MenuSectionProps {
  items: MenuSectionItem[];
  showSection: boolean;
  sectionLabel?: string;
}

const MenuSection: React.FC<MenuSectionProps> = ({ 
  items, 
  showSection,
  sectionLabel 
}) => {
  if (!showSection || items.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      {sectionLabel && (
        <div className="bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
          {sectionLabel}
        </div>
      )}
      <div className="flex flex-col gap-1 p-2">
        {items.map((item, index) => (
          <SidebarMenuItem
            key={`${item.label}-${index}`}
            icon={item.icon}
            label={item.label}
            active={item.isActive}
            onClick={item.onClick}
            disabled={item.disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
