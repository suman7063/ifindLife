
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
}) => {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start h-10 px-3",
        isActive && "bg-secondary text-secondary-foreground"
      )}
    >
      <Link to={href} className="flex items-center gap-3">
        {icon}
        <span className="flex-1 text-left">{children}</span>
        {badge && (
          <Badge variant="secondary" className="ml-auto">
            {badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default SidebarNavItem;
