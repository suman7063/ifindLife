
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/supabase';
import { Loader2 } from 'lucide-react';
import { from } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import EnrollmentDialog from './EnrollmentDialog';
import { useDialog } from '@/hooks/useDialog';
import ProgramImageHeader from './dialog/ProgramImageHeader';
import ProgramMetadata from './dialog/ProgramMetadata';
import ProgramDescription from './dialog/ProgramDescription';
import ProgramPriceFooter from './dialog/ProgramPriceFooter';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FavoriteData {
  program_id: number;
}

interface ProgramDetailDialogProps {
  program: Program;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  onClose?: () => void;
}

const ProgramDetailDialog: React.FC<ProgramDetailDialogProps> = ({
  program,
  currentUser,
  isAuthenticated,
  onClose
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showDialog, DialogComponent } = useDialog();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      checkFavoriteStatus();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, program.id]);

  const checkFavoriteStatus = async () => {
    try {
      const { data, error } = await from('user_favorite_programs')
        .select('*')
        .eq('user_id', currentUser?.id)
        .eq('program_id', program.id)
        .maybeSingle();
        
      if (error) throw error;
      
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (isTogglingFavorite) return;
    
    // Store program ID for post-login action
    if (!isAuthenticated) {
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

  const handleEnroll = () => {
    if (!isAuthenticated) {
      // Store program ID for post-login action
      sessionStorage.setItem('pendingAction', 'enroll');
      sessionStorage.setItem('pendingProgramId', program.id.toString());
      
      toast.info("Please log in to enroll in programs");
      navigate('/user-login');
      return;
    }
    
    showDialog(
      <EnrollmentDialog 
        program={program} 
        currentUser={currentUser!}
      />
    );
  };

  if (loading) {
    return (
      <Dialog open>
        <DialogContent>
          <Loader2 className="h-10 w-10 animate-spin" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 gap-0 overflow-hidden mx-auto">
        <ProgramImageHeader 
          program={program}
          isFavorite={isFavorite}
          isTogglingFavorite={isTogglingFavorite}
          onFavoriteToggle={handleFavoriteToggle}
        />
        
        <ScrollArea className="max-h-[calc(90vh-300px)] px-8 py-5" type="always">
          <div className="pr-4">
            <ProgramMetadata program={program} />
            <ProgramDescription description={program.description} />
          </div>
        </ScrollArea>
        
        <div className="p-5 pt-0 border-t mx-6">
          <ProgramPriceFooter 
            price={program.price} 
            onEnroll={handleEnroll}
          />
        </div>
        <DialogComponent />
      </DialogContent>
    </>
  );
};

export default ProgramDetailDialog;
