
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Wallet } from "lucide-react";
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
import { getInitials } from '@/utils/getInitials';

interface NavbarUserAvatarProps {
  currentUser: any;
  onLogout: () => Promise<boolean>;
  isLoggingOut: boolean;
}

const NavbarUserAvatar: React.FC<NavbarUserAvatarProps> = ({ 
  currentUser, 
  onLogout,
  isLoggingOut
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get profile picture from either format
  const profilePicture = currentUser?.profile_picture || 
    currentUser?.profilePicture || '';
  
  // Get name from either format
  const userName = currentUser?.name || '';
  
  // Get wallet balance
  const walletBalance = currentUser?.wallet_balance || 0;
  const currency = currentUser?.currency || '₹';

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsOpen(false);
    
    try {
      const success = await onLogout();
      
      if (success) {
        toast.success('Successfully logged out', {
          duration: 2000 // 2 seconds
        });
        navigate('/logout', { state: { userType: 'user' } });
      } else {
        toast.error('Failed to log out. Please try again.', {
          duration: 2000 // 2 seconds
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out. Please try again.', {
        duration: 2000 // 2 seconds
      });
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Wallet Balance */}
      <div className="hidden md:flex items-center text-sm text-muted-foreground">
        <Wallet className="h-4 w-4 mr-1" />
        <span className="font-medium text-green-600">
          {currency}{walletBalance.toFixed(2)}
        </span>
      </div>

      {/* User Avatar Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profilePicture} alt={userName || 'User'} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName ? getInitials(userName) : 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {currentUser?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Mobile wallet balance */}
          <div className="md:hidden px-2 py-1.5 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Wallet className="h-4 w-4 mr-2" />
              <span>Balance: </span>
              <span className="font-medium text-green-600 ml-1">
                {currency}{walletBalance.toFixed(2)}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator className="md:hidden" />
          
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
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavbarUserAvatar;
