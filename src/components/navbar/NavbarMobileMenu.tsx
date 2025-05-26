
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserProfile } from '@/types/supabase';
import { 
  MobileMenuHeader, 
  MobileMenuSections, 
  MobileMenuFooter 
} from './mobile-menu';

interface NavbarMobileMenuProps {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  hasExpertProfile: boolean;
  userLogout: () => Promise<boolean>;
  expertLogout: () => Promise<boolean>;
  sessionType: 'none' | 'user' | 'expert' | 'dual';
  isLoggingOut: boolean;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  isAuthenticated,
  currentUser,
  hasExpertProfile,
  userLogout,
  expertLogout,
  sessionType,
  isLoggingOut
}) => {
  const [open, setOpen] = useState(false);

  console.log('NavbarMobileMenu state:', {
    isAuthenticated,
    hasExpertProfile,
    currentUser: !!currentUser,
    sessionType
  });

  const handleLogout = async () => {
    if (hasExpertProfile) {
      await expertLogout();
    } else {
      await userLogout();
    }
    setOpen(false);
  };

  const getDashboardLink = () => {
    if (hasExpertProfile) {
      return "/expert-dashboard";
    } else if (isAuthenticated && sessionType === 'user') {
      return "/user-dashboard";
    }
    return "/user-login";
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="px-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[350px]">
          <div className="flex flex-col h-full">
            <MobileMenuHeader />
            <MobileMenuSections />
            <MobileMenuFooter 
              isAuthenticated={isAuthenticated}
              hasExpertProfile={hasExpertProfile}
              currentUser={currentUser}
              handleLogout={handleLogout}
              isLoggingOut={isLoggingOut}
              getDashboardLink={getDashboardLink}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavbarMobileMenu;
