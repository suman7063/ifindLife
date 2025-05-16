
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileMenuLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const MobileMenuLink: React.FC<MobileMenuLinkProps> = ({ 
  to, 
  children,
  className 
}) => {
  return (
    <Link 
      to={to}
      className={cn(
        "block w-full p-2 text-sm rounded-md hover:bg-accent text-left",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default MobileMenuLink;
