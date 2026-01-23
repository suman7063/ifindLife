import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Search, Menu, Wallet, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock wallet balance for demo
const MOCK_WALLET_BALANCE = 2500;

export const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isHomePage = location.pathname === '/mobile-app/app/';
  const hasBackButton = !isHomePage && location.pathname !== '/mobile-app/app/services' && location.pathname !== '/mobile-app/app/experts' && location.pathname !== '/mobile-app/app/profile';

  const handleBackClick = () => {
    // For specific pages, navigate to their parent page
    if (location.pathname === '/mobile-app/app/wallet' || 
        location.pathname === '/mobile-app/app/my-sessions' || 
        location.pathname === '/mobile-app/app/favorite-experts') {
      navigate('/mobile-app/app/profile');
    } else if (location.pathname === '/mobile-app/app/payment') {
      navigate(-1);
    } else {
      navigate(-1);
    }
  };

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('/services')) return 'Services';
    if (path.includes('/experts')) return 'Experts';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/my-sessions')) return 'My Sessions';
    if (path.includes('/favorite-experts')) return 'Favorite Experts';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/notifications')) return 'Notifications';
    if (path.includes('/booking')) return 'Book Session';
    if (path.includes('/payment')) return 'Payment';
    if (path.includes('/wallet')) return 'Wallet';
    return 'iFindLife';
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        {hasBackButton ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="mr-2 p-1"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-ifind-charcoal" />
          </Button>
        ) : (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 p-1"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-ifind-charcoal" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[340px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between h-14 hover:bg-ifind-aqua/10 hover:text-ifind-aqua"
                  onClick={() => handleMenuItemClick('/mobile-app/app/wallet')}
                >
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 mr-3" />
                    <span>Wallet</span>
                  </div>
                  <Badge variant="secondary" className="bg-ifind-aqua/10 text-ifind-aqua font-semibold">
                    ₹{MOCK_WALLET_BALANCE.toLocaleString()}
                  </Badge>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-14 hover:bg-ifind-aqua/10 hover:text-ifind-aqua"
                  onClick={() => handleMenuItemClick('/mobile-app/app/settings')}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-14 hover:bg-ifind-aqua/10 hover:text-ifind-aqua"
                  onClick={() => handleMenuItemClick('/mobile-app/app/help')}
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Help & Support
                </Button>
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-14 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      console.log('Logout clicked');
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        <img 
          src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
          alt="iFindLife" 
          className="h-10 w-auto"
        />
      </div>

      <div className="flex items-center gap-2">
        {isHomePage && (
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-ifind-charcoal" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/mobile-app/app/notifications')}
          className="p-1 relative"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5 text-ifind-charcoal" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
};