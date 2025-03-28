
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserPlus, User, UserCircle, LogOut, BriefcaseBusiness } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useExpertAuth } from '@/hooks/expert-auth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated: isAdminAuthenticated } = useAuth();
  const { isAuthenticated: isUserAuthenticated, currentUser, logout: userLogout } = useUserAuth();
  const { expert, logout: expertLogout } = useExpertAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleUserLogout = () => {
    userLogout();
  };

  const handleExpertLogout = () => {
    expertLogout();
  };

  // Check if the current page is user dashboard or related pages
  const isUserDashboardPage = location.pathname.includes('user-dashboard') || 
                              location.pathname.includes('referrals');

  // Check if the current page is expert dashboard or related pages
  const isExpertDashboardPage = location.pathname.includes('expert-dashboard');

  return (
    <div className={`sticky top-0 w-full backdrop-blur-md z-50 transition-colors ${scrolled ? 'bg-background/90 shadow-sm' : 'bg-transparent'}`}>
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
            alt="iFindLife" 
            className="h-12 transform scale-125 origin-left" 
          />
        </Link>
        
        <div className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/experts">Experts</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/programs">Programs</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/about">About</Link>
          </Button>
          <Button variant="ghost">Blog</Button>
          
          {expert ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-ifind-teal">
                  <BriefcaseBusiness className="h-4 w-4 mr-1" /> 
                  Expert Portal
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Expert Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/expert-dashboard" className="w-full cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExpertLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/expert-login" className="text-ifind-teal">
                <UserPlus className="h-4 w-4 mr-1" /> Expert Portal
              </Link>
            </Button>
          )}
          
          {isUserAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-ifind-teal">
                  <UserCircle className="h-4 w-4 mr-1" /> 
                  {currentUser?.name || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/user-dashboard" className="w-full cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/referrals" className="w-full cursor-pointer">My Referrals</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleUserLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/user-login" className="text-ifind-teal">
                <User className="h-4 w-4 mr-1" /> Login
              </Link>
            </Button>
          )}
        </div>
        
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
                
                {expert ? (
                  <>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link to="/expert-dashboard">
                        <BriefcaseBusiness className="h-4 w-4 mr-1" /> Expert Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start text-red-500" onClick={handleExpertLogout}>
                      <LogOut className="h-4 w-4 mr-1" /> Logout as Expert
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/expert-login">
                      <UserPlus className="h-4 w-4 mr-1" /> Expert Portal
                    </Link>
                  </Button>
                )}
                
                {isUserAuthenticated ? (
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
                    <Button variant="ghost" className="justify-start text-red-500" onClick={handleUserLogout}>
                      <LogOut className="h-4 w-4 mr-1" /> Logout as User
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
      </div>
    </div>
  );
};

export default Navbar;
