
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
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

interface NavbarUserMenuProps {
  currentUser: UserProfile | null;
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
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    if (isLoggingOut || parentIsLoggingOut) return;
    
    setIsLoggingOut(true);
    setIsOpen(false);
    
    try {
      const success = await onLogout();
      
      if (success) {
        toast.success('Successfully logged out');
        navigate('/');
      } else {
        console.error("Logout failed");
        toast.error('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
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
            <AvatarImage src={currentUser?.profilePicture || ''} alt={currentUser?.name || 'User'} />
            <AvatarFallback>{currentUser?.name ? getInitials(currentUser.name) : 'U'}</AvatarFallback>
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
