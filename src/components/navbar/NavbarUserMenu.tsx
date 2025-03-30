
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, LogOut } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

interface NavbarUserMenuProps {
  currentUser: UserProfile | null;
  onLogout: () => Promise<boolean>;
}

const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({ currentUser, onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    try {
      console.log("NavbarUserMenu: Initiating user logout...");
      const success = await onLogout();
      
      if (!success) {
        console.error("NavbarUserMenu: User logout failed");
        toast.error('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error during user logout:', error);
      toast.error('Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-ifind-teal">
          <UserCircle className="h-4 w-4 mr-1" /> 
          {currentUser?.name || 'Account'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/user-dashboard" className="w-full cursor-pointer">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/referrals" className="w-full cursor-pointer">My Referrals</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
          <LogOut className="h-4 w-4 mr-1" /> 
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserMenu;
