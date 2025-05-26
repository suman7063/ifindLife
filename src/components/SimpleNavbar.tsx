
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useAuth } from '@/contexts/auth/AuthContext';

const SimpleNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, userProfile, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navbarBg = isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-200 ${navbarBg}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
              alt="iFindLife" 
              className="h-12 transform scale-150 origin-left" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>

            {/* Services Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[220px]">
                    <ul className="grid w-full gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/services" className="block w-full p-2 text-sm hover:bg-accent rounded-md">
                            All Services
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/mental-health-assessment" className="block w-full p-2 text-sm hover:bg-accent rounded-md">
                            Mental Health Assessment
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Programs Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Programs</NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[220px]">
                    <ul className="grid w-full gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/programs-for-wellness-seekers" className="block w-full p-2 text-sm hover:bg-accent rounded-md">
                            Wellness Seekers
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/programs-for-academic-institutes" className="block w-full p-2 text-sm hover:bg-accent rounded-md">
                            Academic Institutes
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/programs-for-business" className="block w-full p-2 text-sm hover:bg-accent rounded-md">
                            Business
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button variant="ghost" asChild>
              <Link to="/experts">Experts</Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link to="/about">About</Link>
            </Button>

            {/* Support Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Support</NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[220px]">
                    <ul className="grid w-full gap-1 p-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/contact" className="block w-full p-2 text-sm hover:bg-accent rounded-md">
                            Contact Us
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/faqs" className="block w-full p-2 text-sm hover:bg-accent rounded-md">
                            FAQs
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/blog" className="block w-full p-2 text-sm hover:bg-accent rounded-md">
                            Blog
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/user-dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/user-login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/user-signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/programs-for-wellness-seekers"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Programs
              </Link>
              <Link
                to="/experts"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Experts
              </Link>
              <Link
                to="/about"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block py-2 text-base font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/user-dashboard"
                      className="block w-full text-left py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/user-login"
                      className="block w-full text-center py-2 px-4 border border-primary text-primary rounded-md font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/user-signup"
                      className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SimpleNavbar;
