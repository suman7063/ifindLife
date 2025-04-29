
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types/supabase/user';
import { Expert } from '@/types/expert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUserFavorites } from '@/hooks/user-auth/useUserFavorites';
import { Star, Calendar, X, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FavoritesSectionProps {
  user: UserProfile | null;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ user }) => {
  const [favoriteExperts, setFavoriteExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingExpert, setBookingExpert] = useState<Expert | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { favoriteExperts: favoriteIds, loading, removeExpertFromFavorites } = useUserFavorites(user?.id);

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

  useEffect(() => {
    // In a real application, we'd fetch the actual experts based on favoriteIds
    // For now, we're using our mock data that matches the IDs
    if (favoriteIds) {
      // Simulating loading expert data for favorites
      setTimeout(() => {
        setFavoriteExperts(mockExperts);
        setIsLoading(false);
      }, 800);
    }
  }, [favoriteIds]);
  
  const handleRemoveFavorite = async (expert: Expert) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Favorite Experts</h2>
        <p className="text-muted-foreground">
          Experts you've added to your favorites list
        </p>
      </div>
      
      {isLoading ? (
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
      ) : favoriteExperts.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteExperts.map(expert => (
            <Card key={expert.id} className="overflow-hidden">
              <div className="relative h-24 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                <Avatar className="h-24 w-24 border-4 border-white absolute -bottom-12">
                  <AvatarImage src={expert.profile_picture || ''} alt={expert.name} />
                  <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                </Avatar>
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
                    onClick={() => handleRemoveFavorite(expert)} 
                    className="w-full text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
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
