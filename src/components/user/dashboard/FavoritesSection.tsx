
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types/supabase/user';
import { Expert } from '@/types/expert';
import { Program } from '@/types/programs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUserFavorites } from '@/hooks/user-auth/useUserFavorites';
import { Star, Calendar, X, Heart, Grid, ListIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FavoritesSectionProps {
  user: UserProfile | null;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ user }) => {
  const [favoriteExperts, setFavoriteExperts] = useState<Expert[]>([]);
  const [favoritePrograms, setFavoritePrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingExpert, setBookingExpert] = useState<Expert | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('experts');
  
  const navigate = useNavigate();
  
  const { 
    favoriteExperts: favoriteExpertsIds, 
    favoritePrograms: favoriteProgramsIds,
    loading: favoritesLoading, 
    removeExpertFromFavorites,
    removeProgramFromFavorites
  } = useUserFavorites(user?.id);

  // Mock experts for initial display - we'll replace this with actual data later
  const mockExperts: Expert[] = [
    {
      id: "1",
      name: "Dr. Alice Johnson",
      email: "alice@example.com",
      specialization: "Clinical Psychology",
      profile_picture: "/lovable-uploads/43d69b36-0616-44bf-8fd1-2aa35a40a945.png",
      experience: "10 years",
      average_rating: 4.8,
      reviews_count: 124
    },
    {
      id: "2",
      name: "Dr. Mark Wilson",
      email: "mark@example.com",
      specialization: "Psychiatry",
      profile_picture: "/lovable-uploads/50267abc-f35e-4528-a0cf-90d80e5e5f84.png",
      experience: "15 years",
      average_rating: 4.9,
      reviews_count: 87
    },
    {
      id: "3",
      name: "Sarah Miller",
      email: "sarah@example.com",
      specialization: "Child Psychology",
      profile_picture: "/lovable-uploads/ae4adda3-ac1f-4376-9e2b-081922120b00.png",
      experience: "8 years",
      average_rating: 4.7,
      reviews_count: 62
    }
  ];

  // Mock programs for display
  const mockPrograms: Program[] = [
    {
      id: 1,
      title: "Meditation Mastery",
      description: "Learn deep meditation techniques",
      duration: "8 weeks",
      price: 199,
      sessions: 16,
      image: "/lovable-uploads/43d69b36-0616-44bf-8fd1-2aa35a40a945.png",
      category: "Wellness",
      programType: "wellness",
      enrollments: 254
    },
    {
      id: 2,
      title: "Stress Management",
      description: "Effective techniques for managing daily stress",
      duration: "4 weeks",
      price: 149,
      sessions: 8,
      image: "/lovable-uploads/50267abc-f35e-4528-a0cf-90d80e5e5f84.png",
      category: "Health",
      programType: "wellness",
      enrollments: 186
    }
  ];

  useEffect(() => {
    // In a real application, we'd fetch the actual experts based on favoriteIds
    // For now, we're using our mock data that matches the IDs
    if (favoriteExpertsIds) {
      // Simulating loading expert data for favorites
      setTimeout(() => {
        setFavoriteExperts(mockExperts);
        setFavoritePrograms(mockPrograms);
        setIsLoading(false);
      }, 800);
    }
  }, [favoriteExpertsIds, favoriteProgramsIds]);
  
  const handleRemoveFavoriteExpert = async (expert: Expert) => {
    try {
      const success = await removeExpertFromFavorites(expert);
      if (success) {
        // Remove from local state for immediate UI update
        setFavoriteExperts(prev => prev.filter(e => e.id !== expert.id));
        toast.success(`Removed ${expert.name} from favorites`);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };
  
  const handleRemoveFavoriteProgram = async (program: Program) => {
    try {
      const success = await removeProgramFromFavorites(program.id);
      if (success) {
        // Remove from local state
        setFavoritePrograms(prev => prev.filter(p => p.id !== program.id));
        toast.success(`Removed ${program.title} from favorites`);
      }
    } catch (error) {
      console.error('Error removing favorite program:', error);
      toast.error('Failed to remove favorite program');
    }
  };
  
  const handleBookSession = (expert: Expert) => {
    setBookingExpert(expert);
    setBookingDialogOpen(true);
  };
  
  const confirmBooking = () => {
    // Close the dialog
    setBookingDialogOpen(false);
    
    // Navigate to the expert's profile with booking tab active
    if (bookingExpert) {
      navigate(`/experts/${bookingExpert.id}?tab=booking`);
    }
  };

  const renderExpertGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (favoriteExperts.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Favorite Experts Yet</h3>
            <p className="text-muted-foreground mb-4">
              When you find experts you like, add them to favorites for quick access
            </p>
            <Button onClick={() => navigate('/experts')}>
              Browse Experts
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteExperts.map(expert => (
          <Card key={expert.id} className="overflow-hidden">
            <div className="relative h-24 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <Avatar className="h-24 w-24 border-4 border-white absolute -bottom-12">
                <AvatarImage src={expert.profile_picture || ''} alt={expert.name} />
                <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="destructive" 
                className="absolute top-2 right-2 h-8 w-8 rounded-full" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavoriteExpert(expert);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="pt-16 pb-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">{expert.name}</h3>
                <p className="text-sm text-muted-foreground">{expert.specialization}</p>
                <div className="flex items-center justify-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{expert.average_rating}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({expert.reviews_count} reviews)
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Button 
                  onClick={() => handleBookSession(expert)}
                  className="w-full"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Session
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/experts/${expert.id}`)} 
                  className="w-full"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderProgramGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (favoritePrograms.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Favorite Programs Yet</h3>
            <p className="text-muted-foreground mb-4">
              When you find programs you like, add them to favorites for quick access
            </p>
            <Button onClick={() => navigate('/programs')}>
              Browse Programs
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoritePrograms.map(program => (
          <Card key={program.id} className="overflow-hidden">
            <div className="relative h-40">
              <img 
                src={program.image} 
                alt={program.title}
                className="h-full w-full object-cover"
              />
              <Button 
                size="icon" 
                variant="destructive" 
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavoriteProgram(program);
                }}
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-1">{program.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {program.description}
              </p>
              <div className="flex justify-between items-center text-sm mb-4">
                <span>{program.duration}</span>
                <span className="font-medium">${program.price}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/programs/${program.id}`)}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/programs/${program.id}?enroll=true`)}
                >
                  Enroll Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Favorites</h2>
          <p className="text-muted-foreground">
            View and manage all your favorite experts and programs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="experts" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="experts">Experts</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>
        <TabsContent value="experts" className="mt-4">
          {renderExpertGrid()}
        </TabsContent>
        <TabsContent value="programs" className="mt-4">
          {renderProgramGrid()}
        </TabsContent>
      </Tabs>
      
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book a Session</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {bookingExpert && (
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={bookingExpert.profile_picture || ''} alt={bookingExpert.name} />
                  <AvatarFallback>{bookingExpert.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{bookingExpert.name}</h4>
                  <p className="text-sm text-muted-foreground">{bookingExpert.specialization}</p>
                </div>
              </div>
            )}
            <p className="text-muted-foreground">
              You'll be redirected to the booking page to select your preferred date and time.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking}>
              Continue to Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FavoritesSection;
