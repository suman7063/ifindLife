
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, UserPlus, LogOut, BriefcaseBusiness } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

interface NavbarMobileMenuProps {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  hasExpertProfile: boolean;
  userLogout: () => Promise<void>;
  expertLogout: () => Promise<void>;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({ 
  isAuthenticated, 
  currentUser, 
  hasExpertProfile,
  userLogout,
  expertLogout
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleUserLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    try {
      console.log("NavbarMobileMenu: Initiating user logout...");
      await userLogout();
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('Failed to log out as user. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleExpertLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    try {
      console.log("NavbarMobileMenu: Initiating expert logout...");
      await expertLogout();
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out as expert. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-64">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navigate through iFindLife.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/experts">Experts</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/programs">Programs</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/about">About</Link>
            </Button>
            <Button variant="ghost" className="justify-start">
              Blog
            </Button>
            
            {hasExpertProfile ? (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/expert-dashboard">
                    <BriefcaseBusiness className="h-4 w-4 mr-1" /> Expert Dashboard
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-red-500" 
                  onClick={handleExpertLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-1" /> 
                  {isLoggingOut ? 'Logging out...' : 'Logout as Expert'}
                </Button>
              </>
            ) : (
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/expert-login">
                  <UserPlus className="h-4 w-4 mr-1" /> Expert Portal
                </Link>
              </Button>
            )}
            
            {isAuthenticated ? (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/user-dashboard">
                    <User className="h-4 w-4 mr-1" /> Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/referrals">
                    <User className="h-4 w-4 mr-1" /> My Referrals
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-red-500" 
                  onClick={handleUserLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-1" /> 
                  {isLoggingOut ? 'Logging out...' : 'Logout as User'}
                </Button>
              </>
            ) : (
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/user-login">
                  <User className="h-4 w-4 mr-1" /> Login
                </Link>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavbarMobileMenu;
