
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Program } from '@/types/programs';
import { DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, X } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';

interface ProgramImageHeaderProps {
  program: Program;
  isFavorite: boolean;
  isTogglingFavorite: boolean;
  onFavoriteToggle: () => void;
}

const ProgramImageHeader: React.FC<ProgramImageHeaderProps> = ({
  program,
  isFavorite,
  isTogglingFavorite,
  onFavoriteToggle
}) => {
  return (
    <div className="space-y-3">
      <DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors">
        <X className="h-5 w-5" />
      </DialogClose>
      
      <div className="relative aspect-video rounded-md overflow-hidden">
        <img 
          src={program.image} 
          alt={program.title} 
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-ifind-purple" variant="secondary">
          {program.category === 'quick-ease' && 'QuickEase'}
          {program.category === 'resilience-building' && 'Resilience Building'}
          {program.category === 'super-human' && 'Super Human'}
          {program.category === 'issue-based' && 'Issue-Based Program'}
        </Badge>
      </div>
      <div className="flex justify-between items-start pt-4">
        <DialogTitle className="text-2xl font-bold">{program.title}</DialogTitle>
        <Button 
          variant="outline" 
          size="icon" 
          className={`${isFavorite ? 'text-red-500' : ''}`}
          onClick={onFavoriteToggle}
          disabled={isTogglingFavorite}
        >
          {isTogglingFavorite ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProgramImageHeader;
