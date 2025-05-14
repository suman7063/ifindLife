
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/supabase/user';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '@/hooks/useDialog';
import { useFavorites } from '@/contexts/favorites/FavoritesContext';
import { withProfileTypeAdapter } from '@/components/wrappers/withProfileTypeAdapter';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProgramImageHeader from './components/ProgramImageHeader';
import ProgramMetadata from './components/ProgramMetadata';
import ProgramDescription from './components/ProgramDescription';
import ProgramPriceFooter from './components/ProgramPriceFooter';

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
  const navigate = useNavigate();
  const { DialogComponent, showDialog } = useDialog();
  const { toggleProgramFavorite, isProgramFavorite } = useFavorites();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  
  // Use favorites context to determine if this program is a favorite
  const isFavorite = program.is_favorite || isProgramFavorite(program.id);

  const handleFavoriteToggle = async () => {
    // Store program ID for post-login action
    if (!isAuthenticated) {
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

  const handleEnroll = () => {
    if (!isAuthenticated) {
      // Store program ID for post-login action
      sessionStorage.setItem('pendingAction', 'enroll');
      sessionStorage.setItem('pendingProgramId', program.id.toString());
      sessionStorage.setItem('returnPath', window.location.pathname);
      
      toast.info("Please log in to enroll in programs");
      navigate('/user-login');
      return;
    }
    
    // Show enrollment dialog (implementation will depend on your EnrollmentDialog component)
    toast.info("Enrollment functionality will be implemented soon");
  };

  return (
    <>
      <DialogContent 
        className="sm:max-w-[700px] max-h-[90vh] p-0 gap-0 overflow-hidden mx-auto"
        aria-labelledby="program-dialog-title"
        aria-describedby="program-dialog-description"
      >
        <h2 id="program-dialog-title" className="sr-only">{program.title} Details</h2>
        <p id="program-dialog-description" className="sr-only">View program details and enrollment options</p>
        
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

export default withProfileTypeAdapter(ProgramDetailDialog, 'A');
