import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const NavbarUserMenu = () => {
  const { currentUser, logout } = useUserAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      toast.success('Logged out successfully');
      navigate('/');
    } else {
      toast.error('Failed to log out');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {currentUser?.profile_picture ? (
            <img
              src={currentUser.profile_picture}
              alt={currentUser.name || 'User'}
              className="rounded-full w-8 h-8 object-cover"
            />
          ) : (
            <AvatarFallback>{currentUser?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/user-dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/user-profile-edit">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserMenu;
