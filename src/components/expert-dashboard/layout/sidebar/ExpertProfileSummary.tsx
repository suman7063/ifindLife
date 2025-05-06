
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ExpertProfileSummaryProps {
  expert: any;
  collapsed: boolean;
}

const ExpertProfileSummary: React.FC<ExpertProfileSummaryProps> = ({ expert, collapsed }) => {
  const profileStatus = expert?.status || 'approved';
  
  return (
    <div className={cn(
      'p-4 border-b border-gray-200',
      collapsed ? 'flex flex-col items-center' : ''
    )}>
      <div className={cn(
        'flex',
        collapsed ? 'flex-col items-center' : 'items-center gap-3'
      )}>
        <Avatar className={cn('border-2 border-ifind-teal', collapsed ? 'w-10 h-10' : 'w-12 h-12')}>
          <AvatarImage src={expert?.avatar_url} alt={expert?.name} />
          <AvatarFallback className="bg-ifind-teal/20 text-ifind-teal">
            {expert?.name?.charAt(0) || 'E'}
          </AvatarFallback>
        </Avatar>
        
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{expert?.name || 'Expert Name'}</h3>
            <p className="text-gray-500 text-xs truncate">{expert?.specialization || 'Specialist'}</p>
            
            <div className="mt-1">
              <Badge 
                variant={profileStatus === 'approved' ? 'success' : 'warning'}
                className={cn(
                  'text-xs',
                  profileStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                )}
              >
                {profileStatus === 'approved' ? 'Active' : 'Pending'}
              </Badge>
            </div>
          </div>
        )}
      </div>
      
      {!collapsed && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-gray-50 rounded p-2">
            <p className="text-gray-600">Sessions</p>
            <p className="font-semibold">{expert?.sessions_count || 0}</p>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-gray-600">Rating</p>
            <p className="font-semibold">{expert?.average_rating?.toFixed(1) || '0.0'} ★</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertProfileSummary;
