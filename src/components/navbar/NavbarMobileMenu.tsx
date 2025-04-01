
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, UserPlus, LogOut, BriefcaseBusiness, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

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
  isLoggingOut: parentIsLoggingOut
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleUserLogout = async () => {
    if (isLoggingOut || parentIsLoggingOut) return;
    
    setIsLoggingOut(true);
    setIsOpen(false);
    
    try {
      console.log("NavbarMobileMenu: Initiating user logout...");
      const success = await userLogout();
      
      if (!success) {
        console.error("NavbarMobileMenu: User logout failed");
        toast.error('Failed to log out as user. Please try again.');
      }
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('Failed to log out as user. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleExpertLogout = async () => {
    if (isLoggingOut || parentIsLoggingOut) return;
    
    setIsLoggingOut(true);
    setIsOpen(false);
    
    try {
      console.log("NavbarMobileMenu: Initiating expert logout...");
      const success = await expertLogout();
      
      if (!success) {
        console.error("NavbarMobileMenu: Expert logout failed");
        toast.error('Failed to log out as expert. Please try again.');
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      toast.error('Failed to log out as expert. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
              <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/experts" onClick={() => setIsOpen(false)}>Experts</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/programs" onClick={() => setIsOpen(false)}>Programs</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/blog" onClick={() => setIsOpen(false)}>
                <BookOpen className="h-4 w-4 mr-1" /> Blog
              </Link>
            </Button>
            
            {hasExpertProfile ? (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/expert-dashboard" onClick={() => setIsOpen(false)}>
                    <BriefcaseBusiness className="h-4 w-4 mr-1" /> Expert Dashboard
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-red-500" 
                  onClick={handleExpertLogout}
                  disabled={isLoggingOut || parentIsLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-1" /> 
                  {isLoggingOut || parentIsLoggingOut ? 'Logging out...' : 'Logout as Expert'}
                </Button>
              </>
            ) : (
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/expert-login" onClick={() => setIsOpen(false)}>
                  <UserPlus className="h-4 w-4 mr-1" /> Expert Portal
                </Link>
              </Button>
            )}
            
            {isAuthenticated ? (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/user-dashboard" onClick={() => setIsOpen(false)}>
                    <User className="h-4 w-4 mr-1" /> Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/referrals" onClick={() => setIsOpen(false)}>
                    <User className="h-4 w-4 mr-1" /> My Referrals
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-red-500" 
                  onClick={handleUserLogout}
                  disabled={isLoggingOut || parentIsLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-1" /> 
                  {isLoggingOut || parentIsLoggingOut ? 'Logging out...' : 'Logout as User'}
                </Button>
              </>
            ) : (
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/user-login" onClick={() => setIsOpen(false)}>
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
