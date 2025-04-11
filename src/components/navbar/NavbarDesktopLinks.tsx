
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/supabase/userProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  CreditCard,
} from 'lucide-react';

interface NavbarDesktopLinksProps {
  currentUser?: UserProfile | null;
  onLogout?: () => Promise<boolean>;
  isLoggingOut?: boolean;
  // Add the missing props
  isAuthenticated?: boolean;
  hasExpertProfile?: boolean;
  sessionType?: 'user' | 'expert' | 'none' | 'dual';
  userLogout?: () => Promise<boolean>;
  expertLogout?: () => Promise<boolean>;
}

const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({
  currentUser,
  onLogout,
  isLoggingOut,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const mobileMenuLinks = [
    { path: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    {
      path: '/search',
      label: 'Search Experts',
      icon: <Search className="h-5 w-5" />,
    },
    {
      path: '/user-dashboard',
      label: 'Dashboard',
      icon: <User className="h-5 w-5" />,
      authRequired: true,
    },
    {
      path: '/wallet',
      label: 'Wallet',
      icon: <CreditCard className="h-5 w-5" />,
      authRequired: true,
    },
    {
      path: '/user-settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      authRequired: true,
    },
  ];

  return (
    <>
      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link
          to="/"
          className={`text-base font-medium ${
            isActive('/') ? 'text-ifind-aqua' : 'text-gray-700'
          } hover:text-ifind-teal`}
        >
          Home
        </Link>
        <Link
          to="/search"
          className={`text-base font-medium ${
            isActive('/search') ? 'text-ifind-aqua' : 'text-gray-700'
          } hover:text-ifind-teal`}
        >
          Find Experts
        </Link>
        <Link
          to="/how-it-works"
          className={`text-base font-medium ${
            isActive('/how-it-works') ? 'text-ifind-aqua' : 'text-gray-700'
          } hover:text-ifind-teal`}
        >
          How It Works
        </Link>

        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative rounded-full h-10 w-10 p-0"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={currentUser.profile_picture || undefined}
                    alt={currentUser.name || 'User'}
                  />
                  <AvatarFallback>
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {currentUser.name || 'User Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/user-dashboard" className="cursor-pointer w-full">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/wallet" className="cursor-pointer w-full">
                  Wallet
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/user-profile" className="cursor-pointer w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/user-settings" className="cursor-pointer w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/user-login">
              <Button variant="ghost" className="text-base">
                Log in
              </Button>
            </Link>
            <Link to="/user-signup">
              <Button className="bg-ifind-aqua hover:bg-ifind-teal text-base">
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          className="p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 md:hidden z-50">
          <div className="flex flex-col space-y-2">
            {mobileMenuLinks.map((link) => {
              // Skip auth-required links if no user
              if (link.authRequired && !currentUser) return null;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 p-2 rounded-md ${
                    isActive(link.path)
                      ? 'bg-ifind-aqua/10 text-ifind-aqua'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {!currentUser ? (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/user-login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/user-signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-ifind-aqua hover:bg-ifind-teal">
                    Sign up
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                variant="outline"
                className="flex items-center space-x-2 justify-center mt-2"
                onClick={async () => {
                  setIsMenuOpen(false);
                  await handleLogout();
                }}
                disabled={isLoggingOut}
              >
                <LogOut className="h-5 w-5" />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarDesktopLinks;
