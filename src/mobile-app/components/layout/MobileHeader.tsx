import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/mobile-app/app/';
  const hasBackButton = !isHomePage && location.pathname !== '/mobile-app/app/services' && location.pathname !== '/mobile-app/app/experts' && location.pathname !== '/mobile-app/app/profile';

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('/services')) return 'Services';
    if (path.includes('/experts')) return 'Experts';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/notifications')) return 'Notifications';
    if (path.includes('/booking')) return 'Book Session';
    if (path.includes('/payment')) return 'Payment';
    return 'iFindLife';
  };

  return (
    <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        {hasBackButton ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-2 p-1"
          >
            <ArrowLeft className="h-5 w-5 text-ifind-charcoal" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 p-1"
          >
            <Menu className="h-5 w-5 text-ifind-charcoal" />
          </Button>
        )}
        
        <img 
          src="/ifindlife-logo.png" 
          alt="iFindLife" 
          className="h-8 w-auto"
        />
      </div>

      <div className="flex items-center gap-2">
        {isHomePage && (
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
          >
            <Search className="h-5 w-5 text-ifind-charcoal" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/mobile-app/app/notifications')}
          className="p-1 relative"
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