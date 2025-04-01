
import React, { useState } from 'react';
import { Program } from '@/types/programs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { UserProfile } from '@/types/supabase';
import { from } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/useDialog';
import ProgramDetailDialog from './ProgramDetailDialog';
import { Badge } from '@/components/ui/badge';

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
  const [isFavorite, setIsFavorite] = useState(program.is_favorite || false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const navigate = useNavigate();
  const { showDialog, DialogComponent } = useDialog();

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isTogglingFavorite) return;
    
    // Store the program to continue user journey after login
    if (!isAuthenticated) {
      // Save program ID to session storage for post-login action
      sessionStorage.setItem('pendingAction', 'favorite');
      sessionStorage.setItem('pendingProgramId', program.id.toString());
      
      toast.info("Please log in to save programs to your favorites");
      navigate('/user-login');
      return;
    }
    
    setIsTogglingFavorite(true);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await from('user_favorite_programs')
          .delete()
          .eq('user_id', currentUser?.id)
          .eq('program_id', program.id);
          
        if (error) throw error;
        
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        const { error } = await from('user_favorite_programs')
          .insert({
            user_id: currentUser?.id,
            program_id: program.id
          });
          
        if (error) throw error;
        
        toast.success('Added to favorites');
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleCardClick = () => {
    showDialog(
      <ProgramDetailDialog 
        program={program} 
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
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
          <button 
            className={`absolute top-3 right-3 p-2 rounded-full ${
              isFavorite 
                ? 'bg-red-100 text-red-500' 
                : 'bg-white/80 text-gray-500 hover:text-red-500 hover:bg-red-50'
            } transition-colors shadow-md`}
            onClick={handleFavoriteToggle}
            disabled={isTogglingFavorite}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} 
            />
          </button>
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
