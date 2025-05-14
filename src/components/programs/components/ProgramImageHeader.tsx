
import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Program } from '@/types/programs';

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
    <div className="relative">
      <div className="h-52 sm:h-64 w-full overflow-hidden">
        <img 
          src={program.image || '/placeholder-program.jpg'} 
          alt={program.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <button 
        onClick={onFavoriteToggle}
        disabled={isTogglingFavorite}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isTogglingFavorite ? (
          <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
        ) : (
          <Heart 
            className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
          />
        )}
      </button>
    </div>
  );
};

export default ProgramImageHeader;
