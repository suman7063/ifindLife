import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Settings } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unreadCount?: number;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onOpenChange,
  unreadCount = 0
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] md:w-[450px] p-0 overflow-hidden flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <NotificationCenter />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

