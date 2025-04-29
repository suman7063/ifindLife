
import React from 'react';
import { Link } from 'react-router-dom';
import { SheetClose } from '@/components/ui/sheet';

interface MobileMenuLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const MobileMenuLink: React.FC<MobileMenuLinkProps> = ({ 
  to, 
  children, 
  className = "py-2 px-4 text-sm hover:bg-accent rounded-md" 
}) => {
  return (
    <SheetClose asChild>
      <Link to={to} className={className}>
        {children}
      </Link>
    </SheetClose>
  );
};

export default MobileMenuLink;
