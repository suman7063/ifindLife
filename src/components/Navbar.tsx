
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDown, Menu, X, User, Wallet } from 'lucide-react';

interface SubmenuItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  submenu?: SubmenuItem[];
}

const Navbar: React.FC = () => {
  const { user, session, logout } = useAuth();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && dropdownRefs.current[activeDropdown]) {
        if (!dropdownRefs.current[activeDropdown]?.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const isAuthenticated = user && session;

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const email = user.email;
    return email.charAt(0).toUpperCase();
  };

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    {
      label: 'Services',
      submenu: [
        { label: 'Web Development', href: '/services/web-development' },
        { label: 'Mobile Apps', href: '/services/mobile-apps' },
        { label: 'Digital Marketing', href: '/services/digital-marketing' },
        { label: 'SEO Services', href: '/services/seo' },
        { label: 'Cloud Solutions', href: '/services/cloud' }
      ]
    },
    {
      label: 'Programs',
      submenu: [
        { label: 'Bootcamp', href: '/programs/bootcamp' },
        { label: 'Certification', href: '/programs/certification' },
        { label: 'Workshops', href: '/programs/workshops' },
        { label: 'Online Courses', href: '/programs/online-courses' },
        { label: 'Corporate Training', href: '/programs/corporate-training' }
      ]
    },
    { label: 'Experts', href: '/experts' },
    { label: 'About', href: '/about' },
    {
      label: 'Support',
      submenu: [
        { label: 'Help Center', href: '/support/help' },
        { label: 'Contact Us', href: '/support/contact' },
        { label: 'Documentation', href: '/support/docs' },
        { label: 'Community', href: '/support/community' },
        { label: 'Bug Report', href: '/support/bug-report' }
      ]
    }
  ];

  const handleDropdownToggle = (itemLabel: string) => {
    setActiveDropdown(activeDropdown === itemLabel ? null : itemLabel);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setActiveDropdown(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const LoginMenuItem = () => {
    if (isAuthenticated) {
      return (
        <div className="relative" ref={el => dropdownRefs.current['user'] = el}>
          <button
            onClick={() => handleDropdownToggle('user')}
            className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {getUserInitials()}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{user?.email}</span>
                <div className="flex items-center text-xs text-gray-500">
                  <Wallet className="w-3 h-3 mr-1" />
                  ${userBalance.toFixed(2)}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              activeDropdown === 'user' ? 'rotate-180' : ''
            }`} />
          </button>
          
          {activeDropdown === 'user' && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setActiveDropdown(null)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative" ref={el => dropdownRefs.current['login'] = el}>
        <button
          onClick={() => handleDropdownToggle('login')}
          className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          <span>Login</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
            activeDropdown === 'login' ? 'rotate-180' : ''
          }`} />
        </button>
        
        {activeDropdown === 'login' && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <Link
              to="/login"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setActiveDropdown(null)}
            >
              User Login
            </Link>
            <Link
              to="/expert-login"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setActiveDropdown(null)}
            >
              Expert Login
            </Link>
            <Link
              to="/register"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setActiveDropdown(null)}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Company Logo"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                YourBrand
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.submenu ? (
                  <div ref={el => dropdownRefs.current[item.label] = el}>
                    <button
                      onClick={() => handleDropdownToggle(item.label)}
                      className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {activeDropdown === item.label && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href!}
                    className={`px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                      location.pathname === item.href ? 'text-blue-600 font-medium' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            <LoginMenuItem />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => handleDropdownToggle(`mobile-${item.label}`)}
                        className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === `mobile-${item.label}` ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {activeDropdown === `mobile-${item.label}` && (
                        <div className="pl-4 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.label}
                              to={subItem.href}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setActiveDropdown(null);
                              }}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href!}
                      className={`block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 ${
                        location.pathname === item.href ? 'text-blue-600 font-medium' : ''
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-2">
                {isAuthenticated ? (
                  <div>
                    <div className="flex items-center px-3 py-2 space-x-2">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {getUserInitials()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">{user?.email}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Wallet className="w-3 h-3 mr-1" />
                          ${userBalance.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => handleDropdownToggle('mobile-login')}
                      className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      <span>Login</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === 'mobile-login' ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {activeDropdown === 'mobile-login' && (
                      <div className="pl-4 space-y-1">
                        <Link
                          to="/login"
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          User Login
                        </Link>
                        <Link
                          to="/expert-login"
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Expert Login
                        </Link>
                        <Link
                          to="/register"
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
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

export default Navbar;
