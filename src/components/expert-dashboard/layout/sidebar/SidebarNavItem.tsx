
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badge?: string;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  href, 
  icon, 
  children, 
  isActive = false, 
  badge 
}) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className={cn(
      "w-full justify-start",
      isActive ? "bg-muted font-medium" : "font-normal"
    )}
    asChild
  >
    <Link to={href} className="flex items-center">
      <span className="mr-2">{icon}</span>
      <span className="flex-1">{children}</span>
      {badge && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {badge}
        </Badge>
      )}
      {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
  </Button>
);

export default SidebarNavItem;
