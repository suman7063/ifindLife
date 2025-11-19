
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/database/unified';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface FavoriteExpertsProps {
  user: UserProfile | any;
}

const FavoriteExperts: React.FC<FavoriteExpertsProps> = ({ user }) => {
  const navigate = useNavigate();
  
  // This would normally come from an API
  const experts = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Clinical Psychologist',
      rating: 4.9,
      avatar: null
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Psychiatrist',
      rating: 4.8,
      avatar: null
    },
    {
      id: 3,
      name: 'Dr. Emily Wilson',
      specialty: 'Mental Health Counselor',
      rating: 4.7,
      avatar: null
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Favorite Experts</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/experts')}
        >
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {experts.length > 0 ? (
          <div className="space-y-3">
            {experts.map(expert => (
              <div 
                key={expert.auth_id || `favorite-${expert.email}`} 
                className="flex items-center justify-between border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/experts/${expert.auth_id}`)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={expert.avatar || ''} alt={expert.name} />
                    <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{expert.name}</h3>
                    <p className="text-xs text-gray-500">{expert.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-xs">{expert.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-red-500">
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>You don't have any favorite experts yet.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => navigate('/experts')}
            >
              Find Experts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteExperts;
