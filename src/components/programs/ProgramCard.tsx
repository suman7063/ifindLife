
import React, { useState } from 'react';
import { Program } from '@/types/programs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/database/unified';
import { CalendarDays, Clock } from 'lucide-react';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { toast } from 'sonner';
import ProgramDetailModal from '@/components/programs/detail/ProgramDetailModal';
import { useProgramDetailModal } from '@/hooks/useProgramDetailModal';
import { programDetailData } from '@/data/programData';

interface ProgramCardProps {
  program: Program;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program,
  currentUser,
  isAuthenticated
}) => {
  const { toggleProgramFavorite, isProgramFavorite } = useFavorites();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const { modalState, openModal, closeModal, switchTab } = useProgramDetailModal();
  
  // Check if this program is a favorite
  const isFavorite = program.is_favorite || isProgramFavorite(program.id);
  
  // Default images for different program types
  const getDefaultProgramImage = (type: string) => {
    switch (type) {
      case 'business':
        return '/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png';
      case 'academic':
        return '/lovable-uploads/3ba262c7-796f-46aa-92f7-23924bdc6a44.png';
      default:
        return '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png';
    }
  };
  
  const handleViewDetails = () => {
    // Try to get program data from programDetailData
    const programData = programDetailData[program.id.toString() as keyof typeof programDetailData] || 
                       programDetailData['depression']; // Fallback to depression data as template
    
    openModal(program.id.toString(), programData);
  };
  
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.info("Please log in to save programs to your favorites");
      return;
    }
    
    setIsTogglingFavorite(true);
    try {
      await toggleProgramFavorite(program.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    } finally {
      setIsTogglingFavorite(false);
    }
  };
  
  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={program.image || getDefaultProgramImage(program.programType)} 
            alt={program.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-sm font-medium py-1 px-2 rounded">
            {program.category}
          </div>
          <div className="absolute top-3 left-3">
            <FavoriteButton
              isFavorite={isFavorite}
              isLoading={isTogglingFavorite}
              onClick={handleFavoriteToggle}
              size="sm"
              tooltipText={isFavorite ? "Remove from favorites" : "Add to favorites"}
            />
          </div>
        </div>
        
        <CardHeader>
          <CardTitle className="text-xl text-ifind-purple">{program.title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {program.programType === 'business' 
              ? 'For Organizations & Teams' 
              : program.programType === 'academic' 
                ? 'For Educational Institutions' 
                : 'For Individual Wellness'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-700 line-clamp-3 mb-4">
            {program.description}
          </p>
          
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{program.duration || 'Flexible'} duration</span>
            </div>
            
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>{program.sessions || '-'} sessions</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="font-semibold">
              {program.price ? `₹${program.price.toLocaleString()}` : 'Contact for pricing'}
            </div>
            
            <Button 
              variant="default" 
              size="sm"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ProgramDetailModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        programData={modalState.programData}
        activeTab={modalState.activeTab}
        onTabChange={switchTab}
        loading={modalState.loading}
        error={modalState.error}
      />
    </>
  );
};

export default ProgramCard;
