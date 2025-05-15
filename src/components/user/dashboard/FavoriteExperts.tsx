
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/database/unified';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FavoriteExpertsProps {
  user: UserProfile | null;
}

const FavoriteExperts: React.FC<FavoriteExpertsProps> = ({ user }) => {
  // This would normally come from user.favorite_experts
  const experts = [
    { id: '1', name: 'Dr. Jane Smith', specialization: 'Psychologist', image: '/avatar-1.jpg' },
    { id: '2', name: 'Dr. Michael Brown', specialization: 'Nutritionist', image: '/avatar-2.jpg' }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Favorite Experts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experts.length > 0 ? (
            experts.map(expert => (
              <div key={expert.id} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={expert.image} alt={expert.name} />
                  <AvatarFallback>{expert.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{expert.name}</p>
                  <p className="text-sm text-muted-foreground">{expert.specialization}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No favorite experts</p>
          )}
          
          <button className="mt-2 text-indigo-600 text-sm font-medium hover:text-indigo-800">
            Find experts
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteExperts;
