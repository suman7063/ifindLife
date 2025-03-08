
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';

const Navbar = () => {
  return (
    <div className="bg-background border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center font-semibold">
          <img 
            src="/lovable-uploads/ae4adda3-ac1f-4376-9e2b-081922120b00.png" 
            alt="iFindLife" 
            className="h-8 mr-2 ifindlife-logo" 
          />
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/therapists">
            <Button variant="ghost">Find a Therapist</Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
