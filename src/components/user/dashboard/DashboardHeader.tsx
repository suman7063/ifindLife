
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  user: UserProfile | null;
  onLogout?: () => Promise<boolean>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  if (!user) {
    return (
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>...</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold leading-tight animate-pulse bg-gray-200 h-8 w-48 rounded"></h2>
            <p className="text-muted-foreground animate-pulse bg-gray-200 h-5 w-32 rounded"></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.profile_picture || ''} alt={user.name || 'User'} />
          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold leading-tight">{user.name || 'Welcome to your dashboard'}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      {onLogout && (
        <Button variant="outline" onClick={onLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
