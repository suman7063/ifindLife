
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useProfileTypeAdapter } from '@/hooks/useProfileTypeAdapter';

interface NavbarUserMenuProps {
  currentUser: any; // Accept any profile type
  onLogout: () => Promise<boolean>;
  isLoggingOut: boolean;
}

const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({ 
  currentUser, 
  onLogout,
  isLoggingOut: parentIsLoggingOut
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toTypeA } = useProfileTypeAdapter();
  
  // Convert profile to type A if needed for consistent access
  const adaptedUser = currentUser ? 
    ('favorite_experts' in currentUser ? currentUser : toTypeA(currentUser)) : null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get profile picture from either format
  const profilePicture = adaptedUser?.profile_picture || 
    adaptedUser?.profilePicture || '';
  
  // Get name from either format
  const userName = adaptedUser?.name || '';

  const handleLogout = async () => {
    if (isLoggingOut || parentIsLoggingOut) return;
    
    setIsLoggingOut(true);
    setIsOpen(false);
    
    try {
      const success = await onLogout();
      
      if (success) {
        toast.success('Successfully logged out');
        // Force immediate redirect to clear auth state
        window.location.href = '/';
      } else {
        toast.error('Failed to log out. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profilePicture} alt={userName || 'User'} />
            <AvatarFallback>{userName ? getInitials(userName) : 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/user-dashboard" className="cursor-pointer" onClick={() => setIsOpen(false)}>
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-red-500 cursor-pointer"
          disabled={isLoggingOut || parentIsLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut || parentIsLoggingOut ? 'Logging out...' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserMenu;
