
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, Phone, Video, Calendar, Mail, MapPin, Languages, Clock, Users, Heart, Share2, Flag } from 'lucide-react';
import BookingForm from '@/components/booking/BookingForm';
import ExpertReviews from '@/components/experts/ExpertReviews';
import ExpertAvailability from '@/components/experts/ExpertAvailability';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { formatCurrency } from '@/lib/utils';
import { useUserAuth } from '@/hooks/useUserAuth';
import { ExpertProfile } from '@/types/expert';

const ExpertDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { isAuthenticated, addToFavorites, removeFromFavorites, hasTakenServiceFrom } = useUserAuth();
  
  // Show booking tab if query param is present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('book')) {
      setActiveTab('booking');
    }
  }, [location.search]);
  
  // Fetch expert data
  useEffect(() => {
    const fetchExpert = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, simulate with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock expert data
        setExpert({
          id: id,
          name: "Dr. Jane Smith",
          email: "jane.smith@example.com",
          specialization: "Psychotherapy",
          experience: "10 years",
          bio: "Dr. Jane Smith is a licensed psychotherapist specializing in cognitive behavioral therapy. With over 10 years of experience, she has helped hundreds of patients overcome anxiety, depression, and other mental health challenges.",
          profile_picture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1588&q=80",
          average_rating: 4.8,
          reviews_count: 124,
          price_per_min: 5,
          country: "United States",
          city: "New York",
        });
        
        // Mock reviews
        setReviews([
          {
            id: "1",
            user_name: "John D.",
            rating: 5,
            comment: "Dr. Smith was extremely helpful and professional. She provided great insights that helped me understand my anxiety better.",
            date: "2023-10-15",
            verified: true,
          },
          {
            id: "2",
            user_name: "Sarah M.",
            rating: 4,
            comment: "Very knowledgeable and compassionate. I appreciated her approach to my issues.",
            date: "2023-09-22",
            verified: true,
          },
        ]);
        
        // Check if expert is in user's favorites
        if (isAuthenticated) {
          // This would be an API call in a real app
          setIsFavorite(Math.random() > 0.5);
        }
      } catch (error) {
        console.error("Error fetching expert details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExpert();
  }, [id, isAuthenticated]);
  
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(location.pathname));
      return;
    }
    
    try {
      if (isFavorite) {
        await removeFromFavorites(id!);
        setIsFavorite(false);
      } else {
        await addToFavorites(id!);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile link copied to clipboard!");
  };
  
  const handleReport = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(location.pathname));
      return;
    }
    
    // In a real app, this would open a report modal
    alert("Report functionality would open here");
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!expert) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <h2 className="text-xl font-bold mb-2">Expert Not Found</h2>
        <p className="text-gray-600 mb-4 text-center">The expert you are looking for does not exist or may have been removed.</p>
        <Button onClick={() => navigate('/experts')}>View All Experts</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Expert Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <img 
              src={expert.profile_picture || '/placeholder.svg'} 
              alt={expert.name}
              className="rounded-lg w-full h-auto object-cover aspect-square"
            />
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{expert.name}</h1>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleToggleFavorite}>
                  <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleReport}>
                  <Flag className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>
            </div>
            
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="mr-2">{expert.specialization}</Badge>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm font-medium">{expert.average_rating?.toFixed(1) || '0.0'}</span>
              </div>
              <span className="ml-1 text-sm text-gray-500">
                ({expert.reviews_count || 0} reviews)
              </span>
            </div>
            
            <p className="mt-4 text-gray-600 line-clamp-3">{expert.bio}</p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {expert.country && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{expert.city ? `${expert.city}, ${expert.country}` : expert.country}</span>
                </div>
              )}
              
              {expert.experience && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{expert.experience} experience</span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-1 text-gray-500" />
                <span>500+ consultations</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Languages className="h-4 w-4 mr-1 text-gray-500" />
                <span>English, Hindi</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={() => setActiveTab('booking')}>
                <Calendar className="h-4 w-4 mr-1" />
                Book Appointment
              </Button>
              
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-1" />
                Call Now
              </Button>
              
              <Button variant="outline">
                <Video className="h-4 w-4 mr-1" />
                Video Call
              </Button>
              
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Consultation fee</span>
                <span className="font-medium">{formatCurrency(expert.price_per_min || 0, 'USD')}/min</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="booking">Book Appointment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">About {expert.name}</h2>
            <p className="mb-4">{expert.bio || "No bio available."}</p>
            
            <h3 className="font-medium mb-2">Specialization</h3>
            <p className="mb-4">{expert.specialization}</p>
            
            <h3 className="font-medium mb-2">Experience</h3>
            <p>{expert.experience} years of professional experience</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <ExpertReviews expertId={id!} reviews={reviews} />
        </TabsContent>
        
        <TabsContent value="availability">
          <Card className="p-6">
            <ExpertAvailability expertId={id!} />
          </Card>
        </TabsContent>
        
        <TabsContent value="booking">
          <Card className="p-6">
            <BookingForm expertId={id!} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpertDetail;
