import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const ExpertMobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/mobile-app/expert-app' || location.pathname === '/mobile-app/expert-app/';
  
  // Pages that should show back button
  const shouldShowBackButton = !isHomePage && [
    '/mobile-app/expert-app/availability',
    '/mobile-app/expert-app/ratings-reviews',
    '/mobile-app/expert-app/notifications'
  ].some(path => location.pathname.startsWith(path));

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Back button or Logo */}
        <div className="flex items-center space-x-3">
          {shouldShowBackButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <img 
              src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" 
              alt="iFindLife Expert" 
              className="h-8"
            />
          )}
        </div>

        {/* Right: Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative"
          onClick={() => navigate('/mobile-app/expert-app/notifications')}
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
};
