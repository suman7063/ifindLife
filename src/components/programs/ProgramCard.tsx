
import React, { useState } from 'react';
import { Program } from '@/types/programs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/useDialog';
import ProgramDetailDialog from './ProgramDetailDialog';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types/supabase/user';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { useAuth } from '@/contexts/auth/AuthContext';
import FavoriteButton from '@/components/favorites/FavoriteButton';

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
  const navigate = useNavigate();
  const { showDialog, DialogComponent } = useDialog();
  const { toggleProgramFavorite, isProgramFavorite } = useFavorites();
  const auth = useAuth();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  
  // Use either the program's is_favorite property or check from our favorites context
  const isFavorite = program.is_favorite || isProgramFavorite(program.id);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Store the program to continue user journey after login
    if (!isAuthenticated && !auth.isAuthenticated) {
      // Save program ID to session storage for post-login action
      sessionStorage.setItem('pendingAction', 'favorite');
      sessionStorage.setItem('pendingProgramId', program.id.toString());
      sessionStorage.setItem('returnPath', window.location.pathname);
      
      toast.info("Please log in to save programs to your favorites");
      navigate('/user-login');
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

  const handleCardClick = () => {
    showDialog(
      <ProgramDetailDialog 
        program={program} 
        currentUser={currentUser}
        isAuthenticated={isAuthenticated || auth.isAuthenticated}
      />
    );
  };

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
    <>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer transform hover:scale-[1.02]" onClick={handleCardClick}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={program.image} 
            alt={program.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
          <Badge className="absolute top-3 left-3 bg-ifind-purple" variant="secondary">
            {getCategoryDisplayName(program.category)}
          </Badge>
          
          <FavoriteButton
            isFavorite={isFavorite}
            isLoading={isTogglingFavorite}
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3"
            tooltipText={isFavorite ? "Remove from favorites" : "Add to favorites"}
          />
        </div>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="line-clamp-2 text-lg">{program.title}</CardTitle>
              <CardDescription className="mt-1">
                {program.duration} • {program.sessions} sessions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4 pt-0">
          <div className="text-lg font-semibold text-ifind-teal">
            ₹{program.price}
          </div>
          <Button className="bg-ifind-purple hover:bg-ifind-purple/90">
            View Details
          </Button>
        </CardFooter>
      </Card>
      <DialogComponent />
    </>
  );
};

export default ProgramCard;
