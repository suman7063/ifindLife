import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Star, ThumbsUp, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/supabase/expert';
import { useUserAuth } from '@/contexts/UserAuthContext';
import BookingForm from '@/components/booking/BookingForm';
import ExpertReviews from '@/components/experts/ExpertReviews';
import ExpertAvailability from '@/components/experts/ExpertAvailability';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { formatCurrency } from '@/lib/utils';

interface ExpertDetailParams {
  id: string;
  [key: string]: string | undefined;
}

const ExpertDetail: React.FC = () => {
  const { id } = useParams<ExpertDetailParams>();
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useUserAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        if (!id) {
          setError('Expert ID is missing');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('expert_profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching expert:', error);
          setError('Failed to load expert details');
          setLoading(false);
          return;
        }

        if (!data) {
          setError('Expert not found');
          setLoading(false);
          return;
        }

        setExpert(data);
        
        // Check if expert is in user's favorites
        if (currentUser?.id) {
          const { data: favData } = await supabase
            .from('user_favorite_experts')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('expert_id', id)
            .single();
          
          setIsFavorite(!!favData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in expert fetch:', err);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id, currentUser?.id]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save experts to favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('user_favorite_experts')
          .delete()
          .eq('user_id', currentUser?.id)
          .eq('expert_id', id);
      } else {
        // Add to favorites
        await supabase
          .from('user_favorite_experts')
          .insert([
            { user_id: currentUser?.id, expert_id: id }
          ]);
      }
      
      setIsFavorite(!isFavorite);
      
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite 
          ? "Expert has been removed from your favorites" 
          : "Expert has been added to your favorites",
      });
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast({
        title: "Action Failed",
        description: "Could not update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-4 text-2xl font-bold">{error || 'Expert not found'}</h2>
              <p className="mt-2 text-gray-500">
                We couldn't find the expert you're looking for.
              </p>
              <Button onClick={() => navigate('/experts')} className="mt-6">
                Browse All Experts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Expert Profile Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={expert.avatar_url || undefined} alt={expert.name} />
                  <AvatarFallback>{expert.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-2xl">{expert.name}</CardTitle>
                      <CardDescription className="text-lg">{expert.specialization}</CardDescription>
                    </div>
                    <Button 
                      variant={isFavorite ? "outline" : "default"}
                      onClick={toggleFavorite}
                      className={isFavorite ? "border-primary text-primary" : ""}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {isFavorite ? 'Saved' : 'Save to Favorites'}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {expert.status === 'approved' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    )}
                    {expert.average_rating && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" /> 
                        {expert.average_rating.toFixed(1)} ({expert.reviews_count || 0} reviews)
                      </Badge>
                    )}
                    {expert.experience && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Award className="mr-1 h-3 w-3" /> {expert.experience} Experience
                      </Badge>
                    )}
                    {expert.country && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        <MapPin className="mr-1 h-3 w-3" /> {expert.city ? `${expert.city}, ` : ''}{expert.country}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="about">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">Bio</h3>
                  <p className="text-gray-700 whitespace-pre-line">{expert.bio || 'No bio available.'}</p>
                  
                  {expert.selected_services && expert.selected_services.length > 0 && (
                    <>
                      <h3 className="text-lg font-semibold mt-6 mb-2">Services Offered</h3>
                      <div className="flex flex-wrap gap-2">
                        {expert.selected_services.map((service, index) => (
                          <Badge key={index} variant="secondary">
                            {typeof service === 'number' ? `Service ${service}` : service}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </TabsContent>
                <TabsContent value="reviews">
                  <ExpertReviews expertId={id || ''} />
                </TabsContent>
                <TabsContent value="availability">
                  <ExpertAvailability expertId={id || ''} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Booking Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book a Session</CardTitle>
              <CardDescription>Schedule time with {expert.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Session Rate</span>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(expert.price_per_min || 0)} / minute
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Availability</span>
                  </div>
                  <span className="font-semibold">Check Calendar</span>
                </div>
              </div>
              <BookingForm expert={expert} />
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-xs text-gray-500 mb-2">
                By booking a session, you agree to our terms of service and cancellation policy.
              </p>
              <p className="text-xs text-gray-500">
                Need help? <a href="/contact" className="text-primary hover:underline">Contact support</a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetail;
