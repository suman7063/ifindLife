
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, User, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';

const NewNavbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use the auth context
  const { user, session, logout } = useAuth();
  
  // Check if user is authenticated (has both user and session)
  const isAuthenticated = Boolean(user && session);

  // Fetch wallet balance when user is authenticated
  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            setWalletBalance(data.wallet_balance || 0);
          }
        } catch (error) {
          console.error('Error fetching wallet balance:', error);
        }
      }
    };

    fetchWalletBalance();
  }, [isAuthenticated, user?.id]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const name = user.user_metadata?.name || user.email;
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setOpenDropdown(null);
      // Stay on current page - no redirect
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Toggle dropdown
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Menu items configuration
  const menuItems = [
    { name: 'Home', path: '/' },
    {
      name: 'Services',
      path: '/services',
      submenu: [
        { name: 'Career Guidance', path: '/career-guidance' },
        { name: 'Mental Health Assessment', path: '/mental-health-assessment' },
        { name: 'Issue Based Sessions', path: '/issue-based-sessions' }
      ]
    },
    {
      name: 'Programs',
      path: '/programs',
      submenu: [
        { name: 'Academic Programs', path: '/academic-programs' },
        { name: 'Business Programs', path: '/business-programs' },
        { name: 'Wellness Programs', path: '/programs-for-wellness-seekers' }
      ]
    },
    { name: 'Experts', path: '/experts' },
    { name: 'About', path: '/about' },
    {
      name: 'Support',
      path: '/support',
      submenu: [
        { name: 'FAQs', path: '/faqs' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms of Service', path: '/terms-of-service' }
      ]
    }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
              alt="iFindLife" 
              className="h-12 transform scale-150 origin-left" 
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
            {menuItems.map((item) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors py-2"
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="text-gray-700 hover:text-primary transition-colors py-2"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Auth Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => toggleDropdown('user')}
                    className="flex items-center space-x-2 bg-primary text-white px-3 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <div className="w-6 h-6 bg-white text-primary rounded-full flex items-center justify-center text-xs font-medium">
                      {getUserInitials()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Wallet className="h-4 w-4" />
                      <span className="text-sm">₹{walletBalance}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {openDropdown === 'user' && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/user-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => toggleDropdown('login')}
                    className="flex items-center space-x-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <span>Login</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {openDropdown === 'login' && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/user-login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        User Login
                      </Link>
                      <Link
                        to="/expert-login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        Expert Login
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
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
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(`mobile-${item.name}`)}
                        className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {openDropdown === `mobile-${item.name}` && (
                        <div className="pl-8 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenDropdown(null);
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Auth Menu */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 rounded-md mx-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {getUserInitials()}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Wallet className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">₹{walletBalance}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/user-dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div>
                    <Link
                      to="/user-login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      User Login
                    </Link>
                    <Link
                      to="/expert-login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Expert Login
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

export default NewNavbar;
