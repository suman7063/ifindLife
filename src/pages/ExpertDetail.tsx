
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, MapPin, Clock, Calendar, PhoneCall, 
  Video, Heart, Share2, CheckCircle2 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/hooks/useUserAuth';
import { toast } from 'sonner';
import CallModal from '@/components/CallModal';
import BookingModal from '@/components/BookingModal';
import ExpertReviewModal from '@/components/user/ExpertReviewModal';
import ExpertReportModal from '@/components/user/ExpertReportModal';
import UserReportButton from '@/components/user/UserReportButton';

const expertData = {
  id: 1,
  name: "Dr. Samantha Carter",
  imageUrl: "/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png",
  experience: 15,
  specialties: ["Anxiety", "Depression", "Couples Therapy"],
  rating: 4.9,
  consultations: 3500,
  price: 8.5,
  waitTime: "Available",
  online: true,
  location: "New Delhi, India",
  about: "Dr. Samantha Carter is a licensed clinical psychologist with over 15 years of experience in treating anxiety, depression, and relationship issues. She takes a holistic, client-centered approach and integrates techniques from cognitive-behavioral therapy, mindfulness, and solution-focused therapy to help clients achieve their goals.",
  education: ["Ph.D. in Clinical Psychology, Stanford University", "M.A. in Psychology, University of California, Berkeley", "B.A. in Psychology, University of Michigan"],
  certifications: ["Licensed Clinical Psychologist", "Certified in Cognitive Behavioral Therapy", "Certified in Mindfulness-Based Stress Reduction"],
  languages: ["English", "Hindi", "Spanish"],
  reviews: [
    {
      id: "r1",
      userName: "Ravi S.",
      rating: 5,
      date: "2023-06-15",
      comment: "Dr. Carter was incredibly helpful during a very difficult time in my life. Her approach is compassionate and practical."
    },
    {
      id: "r2",
      userName: "Priya M.",
      rating: 5,
      date: "2023-05-29",
      comment: "I've been working with Dr. Carter for several months now, and the progress I've made is remarkable. Highly recommend!"
    },
    {
      id: "r3",
      userName: "Amit K.",
      rating: 4,
      date: "2023-04-10",
      comment: "Helped me navigate through anxiety issues with practical strategies. Professional and understanding."
    }
  ]
};

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, addReview, reportExpert, addToFavorites, hasTakenServiceFrom } = useUserAuth();
  
  const [expert, setExpert] = useState(expertData);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [canReview, setCanReview] = useState(false);
  
  useEffect(() => {
    // Check if user has taken service from this expert and can leave a review
    const checkCanReview = async () => {
      if (currentUser && id) {
        const hasService = await hasTakenServiceFrom(id);
        setCanReview(hasService);
      }
    };
    
    checkCanReview();
  }, [currentUser, id, hasTakenServiceFrom]);
  
  const handleCallClick = () => {
    if (!currentUser) {
      toast.error("Please log in to call this expert");
      navigate("/login", { state: { returnUrl: `/experts/${id}` } });
      return;
    }
    
    setIsCallModalOpen(true);
  };
  
  const handleVideoCallClick = () => {
    if (!currentUser) {
      toast.error("Please log in to video call this expert");
      navigate("/login", { state: { returnUrl: `/experts/${id}` } });
      return;
    }
    
    setIsVideoCallModalOpen(true);
  };
  
  const handleBookingClick = () => {
    if (!currentUser) {
      toast.error("Please log in to book a session");
      navigate("/login", { state: { returnUrl: `/experts/${id}` } });
      return;
    }
    
    setIsBookingModalOpen(true);
  };
  
  const handleAddReview = async (rating: number, comment: string) => {
    if (!currentUser) {
      toast.error("Please log in to leave a review");
      return;
    }
    
    if (!canReview) {
      toast.error("You can only review experts after consulting with them");
      return;
    }
    
    try {
      await addReview(id || '', rating, comment);
      toast.success("Review submitted successfully");
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to submit review");
    }
  };
  
  const handleReportExpert = async (reason: string, details: string) => {
    if (!currentUser) {
      toast.error("Please log in to report this expert");
      return;
    }
    
    try {
      await reportExpert(id || '', reason, details);
      toast.success("Report submitted successfully");
      setIsReportModalOpen(false);
    } catch (error) {
      console.error("Error reporting expert:", error);
      toast.error("Failed to submit report");
    }
  };
  
  const handleFavoriteToggle = () => {
    if (!currentUser) {
      toast.error("Please log in to add to favorites");
      navigate("/login", { state: { returnUrl: `/experts/${id}` } });
      return;
    }
    
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      addToFavorites(expert);
      toast.success(`Added ${expert.name} to favorites`);
    } else {
      // removeFromFavorites(id || '');
      toast.success(`Removed ${expert.name} from favorites`);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Consult with ${expert.name}`,
        text: `Check out ${expert.name}, a mental wellness expert on iFind Life`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Expert Profile Card */}
            <div className="md:col-span-1">
              <Card className="overflow-hidden border-border/50">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img
                    src={expert.imageUrl}
                    alt={expert.name}
                    className="object-cover w-full h-full"
                  />
                  {expert.online && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-ifind-teal text-white">Online</Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-5">
                  <h1 className="text-2xl font-bold font-poppins mb-1">{expert.name}</h1>
                  
                  <div className="flex items-center text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{expert.location}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center bg-ifind-aqua/10 px-2 py-1 rounded text-sm font-medium">
                      <Star className="h-4 w-4 fill-ifind-aqua text-ifind-aqua mr-1" />
                      {expert.rating} ({expert.reviews.length} reviews)
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {expert.experience} years exp.
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {expert.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/50">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className={expert.waitTime === 'Available' ? 'text-ifind-teal' : 'text-muted-foreground'}>
                        {expert.waitTime}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-ifind-purple">₹{expert.price}</span>
                      <span className="text-muted-foreground">/min</span>
                    </div>
                  </div>
                  
                  <div className="mb-5 text-xs text-muted-foreground">
                    {expert.consultations.toLocaleString()}+ consultations
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        className="border-ifind-aqua text-ifind-aqua hover:bg-ifind-aqua hover:text-white"
                        onClick={handleCallClick}
                      >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                      
                      <Button 
                        className="bg-ifind-purple hover:bg-ifind-purple/80"
                        onClick={handleVideoCallClick}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Video Call
                      </Button>
                    </div>
                    
                    <Button 
                      className="w-full bg-ifind-teal hover:bg-ifind-teal/80"
                      onClick={handleBookingClick}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Session
                    </Button>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        className="text-muted-foreground hover:text-primary"
                        onClick={handleFavoriteToggle}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="sr-only">Favorite</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="text-muted-foreground hover:text-primary"
                        onClick={handleShare}
                      >
                        <Share2 className="h-5 w-5" />
                        <span className="sr-only">Share</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => setIsReviewModalOpen(true)}
                      >
                        <Star className="h-5 w-5" />
                        <span className="sr-only">Review</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => setIsReportModalOpen(true)}
                      >
                        <UserReportButton />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Expert Details */}
            <div className="md:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="expertise">Expertise</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">About {expert.name}</h2>
                      <p className="text-muted-foreground mb-6">{expert.about}</p>
                      
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Education</h3>
                          <ul className="space-y-2">
                            {expert.education.map((edu, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-ifind-aqua mr-2 shrink-0 mt-0.5" />
                                <span>{edu}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Certifications</h3>
                          <ul className="space-y-2">
                            {expert.certifications.map((cert, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-ifind-teal mr-2 shrink-0 mt-0.5" />
                                <span>{cert}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="expertise" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">Areas of Expertise</h2>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="border rounded-md p-4">
                          <h3 className="font-medium mb-2">Specialties</h3>
                          <div className="flex flex-wrap gap-2">
                            {expert.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="bg-muted/30">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <h3 className="font-medium mb-2">Languages</h3>
                          <div className="flex flex-wrap gap-2">
                            {expert.languages.map((lang, index) => (
                              <Badge key={index} variant="outline" className="bg-muted/30">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Client Reviews</h2>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsReviewModalOpen(true)}
                          disabled={!canReview}
                        >
                          Write a Review
                        </Button>
                      </div>
                      
                      {!canReview && currentUser && (
                        <div className="mb-4 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          You can only review experts after consulting with them.
                        </div>
                      )}
                      
                      <div className="space-y-5">
                        {expert.reviews.map((review) => (
                          <div key={review.id} className="border-b pb-5 last:border-0">
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-medium">{review.userName}</div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-ifind-aqua text-ifind-aqua" />
                                <span className="ml-1">{review.rating}</span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">{review.date}</div>
                            <p className="text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Call Modal */}
      <CallModal 
        isOpen={isCallModalOpen || isVideoCallModalOpen}
        onClose={() => {
          setIsCallModalOpen(false);
          setIsVideoCallModalOpen(false);
        }}
        expert={{ id: expert.id, name: expert.name, imageUrl: expert.imageUrl, price: expert.price }}
      />
      
      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        expert={{ id: expert.id, name: expert.name, imageUrl: expert.imageUrl, price: expert.price }}
      />
      
      {/* Review Modal */}
      <ExpertReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleAddReview}
        expertName={expert.name}
      />
      
      {/* Report Modal */}
      <ExpertReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportExpert}
        expertName={expert.name}
      />
    </div>
  );
};

export default ExpertDetail;
