
import React, { useState } from 'react';
import { Program } from '@/types/programs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { UserProfile } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/useDialog';
import ProgramDetailDialog from './ProgramDetailDialog';

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
    
    // Prompt login if not authenticated
    if (!isAuthenticated) {
      toast.info("Please log in to save programs to your favorites");
      navigate('/user-login');
      return;
    }
    
    setIsTogglingFavorite(true);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorite_programs')
          .delete()
          .eq('user_id', currentUser?.id)
          .eq('program_id', program.id);
          
        if (error) throw error;
        
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorite_programs')
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

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer" onClick={handleCardClick}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={program.image} 
            alt={program.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
          <button 
            className={`absolute top-3 right-3 p-2 rounded-full ${
              isFavorite 
                ? 'bg-red-100 text-red-500' 
                : 'bg-white/80 text-gray-500 hover:text-red-500 hover:bg-red-50'
            } transition-colors`}
            onClick={handleFavoriteToggle}
            disabled={isTogglingFavorite}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} 
            />
          </button>
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="line-clamp-1">{program.title}</CardTitle>
              <CardDescription>
                {program.duration} • {program.sessions} sessions
              </CardDescription>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ifind-aqua/10 text-ifind-aqua">
              {program.category === 'quick-ease' && 'QuickEase'}
              {program.category === 'resilience-building' && 'Resilience'}
              {program.category === 'super-human' && 'Super Human'}
              {program.category === 'issue-based' && 'Issue-Based'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
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
