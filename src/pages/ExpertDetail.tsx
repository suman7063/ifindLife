
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Languages, Calendar, Clock, Phone, Video } from 'lucide-react';
import CallModal from '@/components/CallModal';
import BookingModal from '@/components/BookingModal';
import ExpertReviewModal from '@/components/user/ExpertReviewModal';
import ExpertReportModal from '@/components/user/ExpertReportModal';
import { useUserAuth } from '@/hooks/useUserAuth';
import { supabase } from '@/lib/supabase';
import { Expert } from '@/types/supabase/tables';
import { toast } from 'sonner';

// Replace this with actual data fetching from database
const getExpertData = async (expertId: string) => {
  try {
    const { data, error } = await supabase
      .from('experts')
      .select('*')
      .eq('id', expertId)
      .single();
    
    if (error) throw error;
    
    return data as Expert;
  } catch (error) {
    console.error('Error fetching expert:', error);
    return null;
  }
};

const ExpertDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, addReview, reportExpert, hasTakenServiceFrom } = useUserAuth();
  
  const [expert, setExpert] = useState<Expert | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchExpert = async () => {
      if (!id) return;
      
      setLoading(true);
      const expertData = await getExpertData(id);
      
      if (expertData) {
        setExpert(expertData);
      } else {
        toast.error("Expert not found");
        navigate('/experts');
      }
      
      // Check if user can review this expert
      if (currentUser) {
        const hasService = await hasTakenServiceFrom(id);
        setCanReview(hasService);
      }
      
      setLoading(false);
    };
    
    fetchExpert();
  }, [id, currentUser]);
  
  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!expert || !currentUser) return;
    
    try {
      await addReview(expert.id, rating, comment);
      toast.success("Thank you for your review!");
      setIsReviewModalOpen(false);
      
      // Refresh expert data to show updated rating
      const updatedExpert = await getExpertData(expert.id);
      if (updatedExpert) {
        setExpert(updatedExpert);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };
  
  const handleReportSubmit = async (reason: string, details: string) => {
    if (!expert || !currentUser) return;
    
    try {
      await reportExpert(expert.id, reason, details);
      toast.success("Report submitted successfully");
      setIsReportModalOpen(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-ifind-aqua border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!expert) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold">Expert not found</h2>
        <Button onClick={() => navigate('/experts')} className="mt-4">
          Back to Experts
        </Button>
      </div>
    );
  }
  
  // Format expert data for the modals
  const expertForModals = {
    id: Number(expert.id),
    name: expert.name,
    imageUrl: expert.profile_picture || '/placeholder.svg',
    price: 20 // Replace with actual price from expert services
  };
  
  return (
    <div className="container py-8">
      {/* Expert Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
          <Avatar className="w-full h-full">
            <img 
              src={expert.profile_picture || '/placeholder.svg'} 
              alt={expert.name} 
              className="w-full h-full object-cover"
            />
          </Avatar>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{expert.name}</h1>
            <Badge className="bg-ifind-teal">{expert.specialization}</Badge>
            {expert.average_rating && (
              <div className="flex items-center gap-1 text-ifind-gold">
                <Star className="fill-ifind-gold h-4 w-4" />
                <span className="font-medium">{expert.average_rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({expert.reviews_count} reviews)</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
            {expert.experience && (
              <span className="text-sm">{expert.experience} years experience</span>
            )}
            {expert.city && expert.country && (
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3" />
                <span>{expert.city}, {expert.country}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-700 mb-4 max-w-2xl">
            {expert.bio}
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="default" 
              className="bg-ifind-purple hover:bg-ifind-purple/90"
              onClick={() => setIsCallModalOpen(true)}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </Button>
            
            <Button 
              variant="default"
              className="bg-ifind-aqua hover:bg-ifind-aqua/90"
              onClick={() => setIsBookingModalOpen(true)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book Session
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setIsReviewModalOpen(true)}
              disabled={!currentUser || !canReview}
            >
              <Star className="mr-2 h-4 w-4" />
              Write Review
            </Button>
            
            <Button 
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => setIsReportModalOpen(true)}
              disabled={!currentUser}
            >
              Report
            </Button>
          </div>
        </div>
      </div>
      
      {/* Expert Details */}
      <div className="mt-12">
        <Tabs defaultValue="about">
          <TabsList className="mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Professional Background</h3>
              <p className="text-gray-700">
                {expert.bio}
              </p>
            </div>
            
            {expert.certificate_urls && expert.certificate_urls.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {expert.certificate_urls.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-ifind-aqua/20 flex items-center justify-center">
                        <span className="text-ifind-aqua">✓</span>
                      </div>
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expert.selected_services?.map((serviceId) => (
                <Card key={serviceId} className="overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Service {serviceId}</h3>
                    <div className="flex justify-between items-center text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-ifind-aqua" />
                        <span>30 mins</span>
                      </div>
                      <div className="font-bold text-ifind-purple">₹2000</div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => setIsBookingModalOpen(true)}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Reviews</h3>
              <Button 
                variant="outline"
                onClick={() => setIsReviewModalOpen(true)}
                disabled={!currentUser || !canReview}
              >
                <Star className="mr-2 h-4 w-4" />
                Write Review
              </Button>
            </div>
            
            {expert.reviews_count ? (
              <div className="space-y-4">
                {/* Mock reviews - should be fetched from database */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-10 h-10">
                          <img src="/placeholder.svg" alt="User" />
                        </Avatar>
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-gray-500">10 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center text-ifind-gold">
                        <Star className="fill-ifind-gold h-4 w-4" />
                        <span className="ml-1">5.0</span>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Great experience! Very knowledgeable and helpful.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No reviews yet. Be the first to leave a review!
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modals */}
      <CallModal 
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        expert={expertForModals}
      />
      
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        expert={expertForModals}
      />
      
      <ExpertReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        expertName={expert.name}
      />
      
      <ExpertReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        expertName={expert.name}
      />
    </div>
  );
};

export default ExpertDetail;
