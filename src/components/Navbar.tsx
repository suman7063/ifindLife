
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Heart, BrainCircuit } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/ae4adda3-ac1f-4376-9e2b-081922120b00.png" 
            alt="iFindLife Logo" 
            className="h-10" 
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-sm font-medium hover:text-ifind-aqua transition-colors">
            Home
          </Link>
          <Link to="/astrologers" className="text-sm font-medium hover:text-ifind-aqua transition-colors">
            Our Therapists
          </Link>
          <Link to="/horoscope" className="text-sm font-medium hover:text-ifind-aqua transition-colors">
            Mental Health Tips
          </Link>
          <Link to="/services" className="text-sm font-medium hover:text-ifind-aqua transition-colors">
            Services
          </Link>
          <Link to="/blog" className="text-sm font-medium hover:text-ifind-aqua transition-colors">
            Resources
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full gap-1 text-ifind-aqua border-ifind-aqua hover:bg-ifind-aqua hover:text-white transition-all">
            <Heart size={16} />
            <span className="hidden sm:inline">Get Support</span>
          </Button>
          <Link to="/login">
            <Button size="sm" className="bg-ifind-teal hover:bg-ifind-teal/80 transition-colors">Login</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="block md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg md:hidden">
            <div className="container py-4 flex flex-col gap-4">
              <Link to="/" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/astrologers" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                Our Therapists
              </Link>
              <Link to="/horoscope" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                Mental Health Tips
              </Link>
              <Link to="/services" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                Services
              </Link>
              <Link to="/blog" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                Resources
              </Link>
              <div className="flex flex-col sm:flex-row gap-2 px-4 pt-2 border-t">
                <Button variant="outline" size="sm" className="justify-center gap-1 text-ifind-aqua border-ifind-aqua hover:bg-ifind-aqua hover:text-white">
                  <Heart size={16} />
                  <span>Get Support</span>
                </Button>
                <Link to="/login" className="w-full sm:w-auto" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-ifind-teal hover:bg-ifind-teal/80">Login</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
