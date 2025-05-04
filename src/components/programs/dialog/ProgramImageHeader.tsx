
import React from 'react';
import { Program } from '@/types/programs';
import { Badge } from '@/components/ui/badge';
import FavoriteButton from '@/components/favorites/FavoriteButton';

interface ProgramImageHeaderProps {
  program: Program;
  isFavorite: boolean;
  isTogglingFavorite?: boolean;
  onFavoriteToggle: () => void;
}

const ProgramImageHeader: React.FC<ProgramImageHeaderProps> = ({
  program,
  isFavorite,
  isTogglingFavorite = false,
  onFavoriteToggle
}) => {
  const getCategoryDisplayName = (category: string): string => {
    switch (category) {
      case 'quick-ease': return 'QuickEase';
      case 'resilience-building': return 'Resilience Building';
      case 'super-human': return 'Super Human';
      case 'issue-based': return 'Issue-Based';
      default: return category;
    }
  };

  return (
    <div className="relative h-56 overflow-hidden">
      <img
        src={program.image}
        alt={program.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <Badge className="mb-3 bg-ifind-purple">{getCategoryDisplayName(program.category)}</Badge>
        <h2 className="text-2xl font-bold">{program.title}</h2>
      </div>
      
      <FavoriteButton
        isFavorite={isFavorite}
        isLoading={isTogglingFavorite}
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle();
        }}
        className="absolute top-4 right-4"
        size="lg"
        tooltipText={isFavorite ? "Remove from favorites" : "Add to favorites"}
      />
    </div>
  );
};

export default ProgramImageHeader;
