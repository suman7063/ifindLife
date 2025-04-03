
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, UserPlus, LogOut, BriefcaseBusiness, BookOpen, HeartPulse } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="programs">
                <AccordionTrigger className="py-2 px-3 hover:bg-accent hover:text-accent-foreground hover:no-underline">
                  Programs
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-1 ml-4">
                    <Link to="/programs-for-wellness-seekers" onClick={() => setIsOpen(false)} className="text-sm py-2 px-3 hover:bg-accent hover:text-accent-foreground rounded">
                      Wellness Seekers
                    </Link>
                    <Link to="/programs-for-academic-institutes" onClick={() => setIsOpen(false)} className="text-sm py-2 px-3 hover:bg-accent hover:text-accent-foreground rounded">
                      Academic Institutes
                    </Link>
                    <Link to="/programs-for-business" onClick={() => setIsOpen(false)} className="text-sm py-2 px-3 hover:bg-accent hover:text-accent-foreground rounded">
                      Business
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="services">
                <AccordionTrigger className="py-2 px-3 hover:bg-accent hover:text-accent-foreground hover:no-underline">
                  Services
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-1 ml-4">
                    <Link to="/services" onClick={() => setIsOpen(false)} className="text-sm py-2 px-3 hover:bg-accent hover:text-accent-foreground rounded font-medium">
                      All Services
                    </Link>
                    <Link to="/services/therapy-sessions" onClick={() => setIsOpen(false)} className="text-sm py-2 px-3 hover:bg-accent hover:text-accent-foreground rounded">
                      Therapy Sessions
                    </Link>
                    <Link to="/services/guided-meditations" onClick={() => setIsOpen(false)} className="text-sm py-2 px-3 hover:bg-accent hover:text-accent-foreground rounded">
                      Guided Meditations
                    </Link>
                    <Link to="/services/mindful-listening" onClick={() => setIsOpen(false)} className="text-sm py-2 px-3 hover:bg-accent hover:text-accent-foreground rounded">
                      Mindful Listening
                    </Link>
                    <Link to="/services/offline-retreats" onClick={() => setIsOpen(false)} className="text-sm py-2 px-3 hover:bg-accent hover:text-accent-foreground rounded">
                      Offline Retreats
                    </Link>
                    <Link to="/services/life-coaching" onClick={() => setIsOpen(false)} className="text-sm py-2 px-3 hover:bg-accent hover:text-accent-foreground rounded">
                      Life Coaching
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
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
