
import React from 'react';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

interface MobileMenuFooterProps {
  isAuthenticated: boolean;
  hasExpertProfile: boolean;
  handleLogout: () => Promise<void>;
  isLoggingOut: boolean;
  getDashboardLink: () => string;
}

const MobileMenuFooter: React.FC<MobileMenuFooterProps> = ({
  isAuthenticated,
  hasExpertProfile,
  handleLogout,
  isLoggingOut,
  getDashboardLink
}) => {
  return (
    <div className="border-t pt-4 mt-auto">
      {isAuthenticated || hasExpertProfile ? (
        <div className="flex flex-col gap-2">
          <SheetClose asChild>
            <Button variant="outline" asChild className="w-full">
              <Link to={getDashboardLink()}>Dashboard</Link>
            </Button>
          </SheetClose>
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <SheetClose asChild>
            <Button variant="outline" asChild className="w-full">
              <Link to="/user-login">User Login</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="default" asChild className="w-full">
              <Link to="/expert-login">Expert Login</Link>
            </Button>
          </SheetClose>
        </div>
      )}
    </div>
  );
};

export default MobileMenuFooter;
