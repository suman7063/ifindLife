
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
  isActive: boolean;
  collapsed: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  name, 
  path, 
  icon: Icon,
  isActive,
  collapsed
}) => {
  return (
    <Link 
      to={path} 
      className={cn(
        'flex items-center px-4 py-3 my-1 mx-2 rounded-md transition-colors',
        isActive 
          ? 'bg-ifind-teal/10 text-ifind-teal' 
          : 'text-gray-600 hover:bg-gray-100'
      )}
    >
      <Icon size={20} className={cn('min-w-5', collapsed ? 'mx-auto' : 'mr-3')} />
      {!collapsed && <span>{name}</span>}
    </Link>
  );
};

export default SidebarNavItem;
