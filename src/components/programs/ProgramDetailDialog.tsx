
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Program } from '@/types/programs';
import { UserProfile } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Heart, Loader2, CheckCircle, Users, X } from 'lucide-react';
import { from, supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import EnrollmentDialog from './EnrollmentDialog';
import { useDialog } from '@/hooks/useDialog';

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

  const handleViewFullDetails = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('pendingAction', 'view');
      sessionStorage.setItem('pendingProgramId', program.id.toString());
      
      toast.info("Please log in to view full details");
      navigate('/user-login');
      return;
    }
    
    navigate(`/program/${program.id}`);
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
      <DialogContent className="sm:max-w-2xl">
        <DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors">
          <X className="h-5 w-5" />
        </DialogClose>
        
        <DialogHeader className="space-y-3">
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
              onClick={handleFavoriteToggle}
              disabled={isTogglingFavorite}
            >
              {isTogglingFavorite ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              )}
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4 text-ifind-teal" />
              <span className="text-sm">{program.duration}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
              <Calendar className="h-4 w-4 text-ifind-teal" />
              <span className="text-sm">{program.sessions} sessions</span>
            </div>
            {program.enrollments && program.enrollments > 0 && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <Users className="h-4 w-4 text-ifind-teal" />
                <span className="text-sm">{program.enrollments} enrolled</span>
              </div>
            )}
          </div>
          
          <DialogDescription className="text-base leading-relaxed mb-6">
            {program.description}
          </DialogDescription>
          
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold">What you'll learn:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Effective techniques for managing stress and anxiety</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Practical mindfulness exercises for daily life</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Building emotional resilience and self-awareness</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="text-2xl font-bold text-ifind-teal">₹{program.price}</div>
          <Button onClick={handleEnroll} className="w-full sm:w-auto">
            Enroll Now
          </Button>
        </DialogFooter>
        <DialogComponent />
      </DialogContent>
    </>
  );
};

export default ProgramDetailDialog;
