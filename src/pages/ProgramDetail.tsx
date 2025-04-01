
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { from, supabase } from '@/lib/supabase';
import { Program } from '@/types/programs';
import { useUserAuth } from '@/hooks/user-auth';
import { 
  Calendar, 
  Clock, 
  Heart, 
  Loader2, 
  CheckCircle, 
  Users 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useDialog } from '@/hooks/useDialog';
import EnrollmentDialog from '@/components/programs/EnrollmentDialog';

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const { currentUser, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  const { showDialog, DialogComponent } = useDialog();

  useEffect(() => {
    if (id) {
      fetchProgram(parseInt(id));
    }
  }, [id]);

  const fetchProgram = async (programId: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await from('programs')
        .select('*')
        .eq('id', programId)
        .single();

      if (error) throw error;
      
      if (data) {
        // Cast the data to match the Program type
        setProgram(data as unknown as Program);
        
        // Check if program is in user's favorites
        if (isAuthenticated && currentUser) {
          const { data: favoriteData, error: favoriteError } = await from('user_favorite_programs')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('program_id', programId)
            .maybeSingle();
            
          if (favoriteError) throw favoriteError;
          
          setIsFavorite(!!favoriteData);
        }
      }
    } catch (error) {
      console.error('Error fetching program:', error);
      toast.error('Failed to load program details');
      navigate('/programs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
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
        const { error } = await from('user_favorite_programs')
          .delete()
          .eq('user_id', currentUser?.id)
          .eq('program_id', program?.id);
          
        if (error) throw error;
        
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        const { error } = await from('user_favorite_programs')
          .insert({
            user_id: currentUser?.id,
            program_id: program?.id
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
      toast.info("Please log in to enroll in programs");
      navigate('/user-login');
      return;
    }
    
    if (program) {
      showDialog(
        <EnrollmentDialog 
          program={program} 
          currentUser={currentUser!}
        />
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-ifind-purple" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container py-10">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Program Not Found</h2>
            <p className="text-muted-foreground mb-6">The program you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/programs')}>
              Browse All Programs
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="relative rounded-lg overflow-hidden mb-6">
              <img 
                src={program.image} 
                alt={program.title} 
                className="w-full aspect-video object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-ifind-purple" variant="secondary">
                {program.category === 'quick-ease' && 'QuickEase'}
                {program.category === 'resilience-building' && 'Resilience Building'}
                {program.category === 'super-human' && 'Super Human'}
                {program.category === 'issue-based' && 'Issue-Based Program'}
              </Badge>
            </div>
            
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
            
            <h1 className="text-3xl font-bold mb-4">{program.title}</h1>
            
            <div className="prose max-w-none mb-8">
              <p className="text-base leading-relaxed mb-6">
                {program.description}
              </p>
              
              <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
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
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Creating sustainable mental wellness habits</span>
                </li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Program structure</h2>
              <ul className="space-y-4">
                <li className="border p-4 rounded-lg">
                  <h3 className="font-medium">Session 1: Introduction to Mental Wellness</h3>
                  <p className="text-sm text-muted-foreground">Understanding the basics of mental health and setting personal goals</p>
                </li>
                <li className="border p-4 rounded-lg">
                  <h3 className="font-medium">Session 2: Stress Management Techniques</h3>
                  <p className="text-sm text-muted-foreground">Learning practical methods to identify and manage stress triggers</p>
                </li>
                <li className="border p-4 rounded-lg">
                  <h3 className="font-medium">Session 3: Mindfulness Practice</h3>
                  <p className="text-sm text-muted-foreground">Exploring mindfulness exercises and their benefits for mental clarity</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="border rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-ifind-teal mb-4">₹{program.price}</h2>
                
                <div className="flex flex-col gap-3 mb-6">
                  <Button 
                    onClick={handleEnroll}
                    className="bg-ifind-purple hover:bg-ifind-purple/90"
                  >
                    Enroll Now
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleFavoriteToggle}
                    disabled={isTogglingFavorite}
                    className="flex items-center gap-2"
                  >
                    {isTogglingFavorite ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    )}
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="font-semibold">This program includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{program.sessions} guided video sessions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Downloadable resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Access on mobile and desktop</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Lifetime access</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <DialogComponent />
    </div>
  );
};

export default ProgramDetail;
