
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserPlus, User } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAuth } from '@/hooks/useUserAuth';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isAuthenticated: isUserAuthenticated } = useUserAuth();

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
          <Button variant="ghost">About</Button>
          <Button variant="ghost">Blog</Button>
          <Button variant="ghost" asChild>
            <Link to="/expert-login" className="text-ifind-teal">
              <UserPlus className="h-4 w-4 mr-1" /> Expert Portal
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={isUserAuthenticated ? "/user-dashboard" : "/login"} className="text-ifind-teal">
              <User className="h-4 w-4 mr-1" /> {isUserAuthenticated ? "Dashboard" : "Login"}
            </Link>
          </Button>
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
                <Button variant="ghost" className="justify-start">
                  About
                </Button>
                <Button variant="ghost" className="justify-start">
                  Blog
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/expert-login">
                    <UserPlus className="h-4 w-4 mr-1" /> Expert Portal
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to={isUserAuthenticated ? "/user-dashboard" : "/login"}>
                    <User className="h-4 w-4 mr-1" /> {isUserAuthenticated ? "User Dashboard" : "Login"}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
