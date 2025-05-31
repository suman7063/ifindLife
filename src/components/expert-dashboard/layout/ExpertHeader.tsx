
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import RealTimeNotifications from '../pages/messaging/RealTimeNotifications';
import { 
  Search, 
  Settings, 
  HelpCircle, 
  Calendar,
  MessageSquare,
  Video
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ExpertHeader: React.FC = () => {
  const { expert } = useUnifiedAuth();

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Expert Dashboard</h2>
          {expert?.status === 'approved' && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Active
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          
          {/* Notifications */}
          <RealTimeNotifications />
          
          {/* Settings and Help */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={expert?.profile_picture || ''} 
                    alt={expert?.name || 'Expert'} 
                  />
                  <AvatarFallback>
                    {expert?.name?.charAt(0) || 'E'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {expert?.name || 'Expert'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {expert?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default ExpertHeader;
