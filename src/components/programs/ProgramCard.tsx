import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Star, Clock, Users } from 'lucide-react';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/database/unified';

interface ProgramCardProps {
  program: Program;
  currentUser?: UserProfile | any;
  isAuthenticated?: boolean;
  onProgramClick?: (program: Program) => void;
  onFavoriteToggle?: (programId: number) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  currentUser,
  isAuthenticated = false,
  onProgramClick,
  onFavoriteToggle
}) => {
  const isFavorite = currentUser?.favorite_programs?.includes(program.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onProgramClick
    onFavoriteToggle?.(program.id);
  };

  return (
    <Card
      key={program.id}
      className="hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={() => onProgramClick?.(program)}
    >
      <CardHeader className="pb-4">
        <div className="relative">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-40 object-cover rounded-md"
          />
          {isAuthenticated && onFavoriteToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
          )}
        </div>
        <CardTitle className="text-lg font-semibold mt-2">{program.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>{program.duration}</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Users className="h-4 w-4" />
          <span>{program.sessions} Sessions</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Star className="h-4 w-4" />
          <span>{program.is_featured ? 'Featured' : 'Not Featured'}</span>
        </div>
        <Badge className="mt-2">{program.category}</Badge>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
