
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExpertCardProps {
  id: string | number;
  name: string;
  specialization: string;
  rating: number;
  profilePicture?: string;
  experience?: string;
}

const ExpertCard: React.FC<ExpertCardProps> = ({
  id,
  name,
  specialization,
  rating,
  profilePicture,
  experience
}) => {
  const navigate = useNavigate();

  const handleExpertClick = () => {
    navigate(`/experts/${id}`);
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleExpertClick}>
      <CardContent className="p-0">
        <div className="flex flex-col p-4 gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profilePicture} />
              <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="text-sm text-muted-foreground">{specialization}</div>
              {experience && (
                <div className="text-xs text-muted-foreground">{experience} years experience</div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              navigate(`/book/${id}`);
            }}>
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
