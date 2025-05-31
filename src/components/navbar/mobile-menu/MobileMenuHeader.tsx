
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';

const MobileMenuHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <Link to="/" className="flex items-center">
        <img 
          src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
          alt="iFindLife" 
          className="h-8" 
        />
      </Link>
      <SheetClose asChild>
        <Button variant="ghost" size="icon">
          <X className="h-5 w-5" />
          <span className="sr-only">Close menu</span>
        </Button>
      </SheetClose>
    </div>
  );
};

export default MobileMenuHeader;
