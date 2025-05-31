
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, LogOut } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { showLogoutSuccessToast, showLogoutErrorToast } from '@/utils/toastConfig';

interface NavbarExpertMenuProps {
  onLogout: () => Promise<boolean>;
  isLoggingOut: boolean;
}

const NavbarExpertMenu: React.FC<NavbarExpertMenuProps> = ({ 
  onLogout,
  isLoggingOut: parentIsLoggingOut
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut || parentIsLoggingOut) return;
    
    setIsLoggingOut(true);
    setIsOpen(false);
    
    try {
      console.log("NavbarExpertMenu: Initiating expert logout...");
      const success = await onLogout();
      
      if (success) {
        console.log("NavbarExpertMenu: Expert logout successful");
        showLogoutSuccessToast();
        navigate('/logout', { state: { userType: 'expert' } });
      } else {
        console.error("NavbarExpertMenu: Expert logout failed");
        showLogoutErrorToast();
      }
    } catch (error) {
      console.error('Error during expert logout:', error);
      showLogoutErrorToast();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-ifind-teal">
          <BriefcaseBusiness className="h-4 w-4 mr-1" /> 
          Expert Portal
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Expert Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/expert-dashboard" className="w-full cursor-pointer" onClick={() => setIsOpen(false)}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
          <LogOut className="h-4 w-4 mr-1" /> 
          {isLoggingOut || parentIsLoggingOut ? 'Logging out...' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarExpertMenu;
