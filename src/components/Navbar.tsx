import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/ifindlife-logo.png" alt="iFindLife" className="h-8" />
          <span className="font-bold text-xl hidden md:inline-block">iFindLife</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/therapists">Therapists</Link>
          </Button>
          <Button variant="ghost">About</Button>
          <Button variant="ghost">Blog</Button>
          <Button variant="ghost" asChild>
            <Link to="/admin" className="text-ifind-teal">Admin</Link>
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
                <Button variant="ghost" className="justify-start">
                  <Link to="/">Home</Link>
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Link to="/therapists">Therapists</Link>
                </Button>
                <Button variant="ghost" className="justify-start">
                  About
                </Button>
                <Button variant="ghost" className="justify-start">
                  Blog
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Link to="/login">Login</Link>
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
