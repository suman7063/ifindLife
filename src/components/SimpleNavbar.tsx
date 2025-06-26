
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Menu } from 'lucide-react';
import { toast } from 'sonner';

const SimpleNavbar: React.FC = () => {
  const { isAuthenticated, userType, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success('Logged out successfully');
      navigate('/');
    } else {
      toast.error('Error logging out');
    }
  };

  const getDashboardLink = () => {
    switch (userType) {
      case 'expert':
        return '/expert-dashboard';
      case 'admin':
        return '/admin-dashboard';
      case 'user':
      default:
        return '/user-dashboard';
    }
  };

  const getLoginLink = () => {
    switch (userType) {
      case 'expert':
        return '/expert-login';
      case 'admin':
        return '/admin-login';
      case 'user':
      default:
        return '/user-login';
    }
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 relative">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
              alt="iFindLife" 
              className="h-12" 
            />
          </Link>
          <span className="absolute -top-1 -right-6 bg-gray-400 text-white text-[8px] px-1 py-0.5 rounded font-medium">
            BETA
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
          <Link to="/services" className="text-gray-700 hover:text-gray-900">Services</Link>
          <Link to="/experts" className="text-gray-700 hover:text-gray-900">Experts</Link>
          <Link to="/programs" className="text-gray-700 hover:text-gray-900">Programs</Link>
          <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="capitalize">{userType}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Login</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/user-login">User Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/expert-login">Expert Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin-login">Admin Login</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="default" asChild>
                <Link to="/user-signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavbar;
