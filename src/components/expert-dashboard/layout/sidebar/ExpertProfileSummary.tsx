
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExpertProfile } from '@/types/database/unified';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

export interface ExpertProfileSummaryProps {
  expert: ExpertProfile;
}

const ExpertProfileSummary: React.FC<ExpertProfileSummaryProps> = ({ expert }) => {
  const { refreshProfiles, user } = useSimpleAuth();
  const [imageKey, setImageKey] = useState(0);

  // Listen for profile image updates
  useEffect(() => {
    const handleProfileUpdate = async (event: CustomEvent) => {
      console.log('ExpertProfileSummary: Profile image update received', event.detail);
      if (user?.id) {
        await refreshProfiles(user.id);
        setImageKey(prev => prev + 1); // Force re-render
      }
    };

    window.addEventListener('expertProfileImageUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('expertProfileRefreshed', handleProfileUpdate as EventListener);

    return () => {
      window.removeEventListener('expertProfileImageUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('expertProfileRefreshed', handleProfileUpdate as EventListener);
    };
  }, [user?.id, refreshProfiles]);

  return (
    <div className="flex items-center space-x-3 pb-2">
      <Avatar className="h-10 w-10" key={imageKey}>
        <AvatarImage 
          src={expert.profile_picture || expert.profilePicture || ''} 
          alt={expert.name}
          key={`${expert.profile_picture || expert.profilePicture || ''}-${imageKey}`}
        />
        <AvatarFallback>{expert.name?.substring(0, 2).toUpperCase() || 'EA'}</AvatarFallback>
      </Avatar>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{expert.name}</p>
        <p className="text-xs text-muted-foreground">Expert</p>
      </div>
    </div>
  );
};

export default ExpertProfileSummary;
