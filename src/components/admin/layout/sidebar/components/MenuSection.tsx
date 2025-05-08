
import React from 'react';
import AdminSidebarMenuItem from './SidebarMenuItem';
import { LucideIcon } from 'lucide-react';

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface MenuSectionProps {
  title?: string;
  items: MenuItemProps[];
  showSection: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  items,
  showSection
}) => {
  if (!showSection || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      {title && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        </div>
      )}
      {items.map((item) => (
        <AdminSidebarMenuItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          isActive={item.isActive}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
};

export default MenuSection;
