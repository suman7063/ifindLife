
import React, { useEffect, useState } from 'react';
import { UserProfile, ExpertProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Star, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface FavoritesSectionProps {
  user: UserProfile | null;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ user }) => {
  const [favoriteExperts, setFavoriteExperts] = useState<ExpertProfile[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    const fetchFavorites = async () => {
      setIsLoading(true);
      
      try {
        // Fetch favorite experts
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('user_favorites')
          .select('expert_id')
          .eq('user_id', user.id);
        
        if (favoritesError) {
          console.error('Error fetching favorites:', favoritesError);
          return;
        }
        
        // If there are favorite experts, fetch their details
        if (favoritesData && favoritesData.length > 0) {
          const expertIds = favoritesData.map(f => String(f.expert_id)); // Convert to string for query
          
          const { data: expertsData, error: expertsError } = await supabase
            .from('experts')
            .select('*')
            .in('id', expertIds);
          
          if (expertsError) {
            console.error('Error fetching expert details:', expertsError);
            return;
          }
          
          setFavoriteExperts(expertsData || []);
        }
        
        // Fetch favorite programs
        const { data: programsData, error: programsError } = await supabase
          .from('user_favorite_programs')
          .select('program_id')
          .eq('user_id', user.id);
        
        if (programsError) {
          console.error('Error fetching favorite programs:', programsError);
          return;
        }
        
        // If there are favorite programs, fetch their details
        if (programsData && programsData.length > 0) {
          const programIds = programsData.map(p => p.program_id);
          
          const { data: programDetails, error: programDetailsError } = await supabase
            .from('programs')
            .select('*')
            .in('id', programIds);
          
          if (programDetailsError) {
            console.error('Error fetching program details:', programDetailsError);
            return;
          }
          
          setFavoritePrograms(programDetails || []);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user]);

  const removeFavoriteExpert = async (expertId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('expert_id', Number(expertId)); // Convert to number for database query
      
      if (error) {
        throw error;
      }
      
      setFavoriteExperts(prev => prev.filter(expert => expert.id !== expertId));
      toast.success('Expert removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove expert from favorites');
    }
  };

  const removeFavoriteProgram = async (programId: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_favorite_programs')
        .delete()
        .eq('user_id', user.id)
        .eq('program_id', programId);
      
      if (error) {
        throw error;
      }
      
      setFavoritePrograms(prev => prev.filter(program => program.id !== programId));
      toast.success('Program removed from favorites');
    } catch (error) {
      console.error('Error removing favorite program:', error);
      toast.error('Failed to remove program from favorites');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Favorite Experts</CardTitle>
                <CardDescription>Experts you've saved</CardDescription>
              </div>
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading favorites...</p>
              </div>
            ) : favoriteExperts.length > 0 ? (
              <div className="space-y-4">
                {favoriteExperts.map(expert => (
                  <div key={expert.id} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={expert.profile_picture} alt={expert.name} />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{expert.name}</p>
                        <p className="text-sm text-muted-foreground">{expert.specialization}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs ml-1">
                            {expert.average_rating?.toFixed(1) || 'New'} ({expert.reviews_count || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => navigate(`/experts/${expert.id}`)}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeFavoriteExpert(expert.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-muted-foreground mb-4">You haven't added any experts to favorites yet</p>
                <Button onClick={() => navigate('/experts')} variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Experts
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Favorite Programs</CardTitle>
                <CardDescription>Programs you're interested in</CardDescription>
              </div>
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading programs...</p>
              </div>
            ) : favoritePrograms.length > 0 ? (
              <div className="space-y-4">
                {favoritePrograms.map(program => (
                  <div key={program.id} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-md bg-slate-200 flex items-center justify-center overflow-hidden">
                        {program.image ? (
                          <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-slate-500">{program.title.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{program.title}</p>
                        <p className="text-sm text-muted-foreground">{program.duration} • {program.sessions} sessions</p>
                        <p className="text-sm font-medium mt-1">
                          {program.price.toFixed(2)} {user.currency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => navigate(`/programs/${program.id}`)}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeFavoriteProgram(program.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-muted-foreground mb-4">You haven't saved any programs to favorites yet</p>
                <Button onClick={() => navigate('/programs')} variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Programs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FavoritesSection;
