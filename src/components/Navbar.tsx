
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun, Phone } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            <div className="absolute w-8 h-8 bg-astro-purple rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute w-4 h-4 bg-astro-gold rounded-full top-1 left-2 animate-sparkle"></div>
          </div>
          <span className="font-bold text-2xl text-gradient">AstroTalk</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-sm font-medium hover:text-astro-purple transition-colors">
            Home
          </Link>
          <Link to="/astrologers" className="text-sm font-medium hover:text-astro-purple transition-colors">
            Astrologers
          </Link>
          <Link to="/horoscope" className="text-sm font-medium hover:text-astro-purple transition-colors">
            Daily Horoscope
          </Link>
          <Link to="/services" className="text-sm font-medium hover:text-astro-purple transition-colors">
            Services
          </Link>
          <Link to="/blog" className="text-sm font-medium hover:text-astro-purple transition-colors">
            Blog
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full gap-1 text-astro-purple border-astro-purple hover:bg-astro-purple hover:text-white transition-all">
            <Phone size={16} />
            <span className="hidden sm:inline">Call Now</span>
          </Button>
          <Link to="/login">
            <Button size="sm" className="bg-astro-purple hover:bg-astro-violet transition-colors">Login</Button>
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
                Astrologers
              </Link>
              <Link to="/horoscope" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                Daily Horoscope
              </Link>
              <Link to="/services" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                Services
              </Link>
              <Link to="/blog" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
              <div className="flex flex-col sm:flex-row gap-2 px-4 pt-2 border-t">
                <Button variant="outline" size="sm" className="justify-center gap-1 text-astro-purple border-astro-purple hover:bg-astro-purple hover:text-white">
                  <Phone size={16} />
                  <span>Call Now</span>
                </Button>
                <Link to="/login" className="w-full sm:w-auto" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-astro-purple hover:bg-astro-violet">Login</Button>
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
