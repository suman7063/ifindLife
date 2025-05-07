
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  to,
  icon,
  label,
  badge
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-2 px-3 py-2 rounded-md text-sm
        ${isActive 
          ? 'bg-primary text-primary-foreground font-medium' 
          : 'text-muted-foreground hover:bg-accent/50'
        }
        transition-colors
      `}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;
