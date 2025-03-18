
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, Calendar, Clock, Award, PhoneCall, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallModal from '@/components/CallModal';
import BookingModal from '@/components/BookingModal';
import { toast } from '@/hooks/use-toast';

const AstrologerDetail = () => {
  const { id } = useParams();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // This would normally come from an API call using the ID
  // For now, we'll use dummy data
  const astrologer = {
    id: Number(id),
    name: "Acharya Raman",
    experience: 15,
    specialties: ["Vedic", "Palmistry", "Tarot", "Kundli", "Vastu"],
    rating: 4.9,
    consultations: 35000,
    price: 30,
    waitTime: "Available",
    imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2070&auto=format&fit=crop",
    online: true,
    languages: ["English", "Hindi"],
    description: "Acharya Raman is an experienced astrologer with over 15 years of experience in Vedic astrology, palmistry, and tarot reading. He has helped thousands of people find clarity and direction in their lives through his accurate predictions and spiritual guidance.",
    education: "Master's in Vedic Astrology, Banaras Hindu University",
    reviews: [
      {
        id: 1,
        name: "Priya S.",
        rating: 5,
        date: "2 days ago",
        comment: "Amazing experience! Acharya's predictions were spot on and his guidance helped me make an important career decision."
      },
      {
        id: 2,
        name: "Rahul M.",
        rating: 4,
        date: "1 week ago",
        comment: "Very knowledgeable and patient. Took time to explain everything in detail. Will definitely consult again."
      },
      {
        id: 3,
        name: "Ananya K.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Incredible insight into my relationship problems. His advice has already started helping me improve things with my partner."
      }
    ]
  };
  
  const handleCallClick = () => {
    if (astrologer.online && astrologer.waitTime === "Available") {
      setIsCallModalOpen(true);
    } else {
      toast({
        title: "Astrologer Unavailable",
        description: "This astrologer is currently offline or busy. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleBookSession = () => {
    setIsBookingModalOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-astro-deep-blue text-white py-6">
        <div className="container">
          <Link to="/astrologers" className="inline-flex items-center text-astro-stardust hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Astrologers
          </Link>
        </div>
      </div>
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-astro-light-purple">
                      <img 
                        src={astrologer.imageUrl} 
                        alt={astrologer.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {astrologer.online && (
                      <span className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  
                  <h1 className="text-xl font-bold mb-1">{astrologer.name}</h1>
                  
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-4 w-4 fill-astro-gold text-astro-gold mr-1" />
                    <span className="font-medium">{astrologer.rating}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      ({astrologer.consultations.toLocaleString()}+ consultations)
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-1 mb-6">
                    {astrologer.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="bg-muted/50">
                        {language}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full mb-6">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium">{astrologer.experience} Years</div>
                      <div className="text-sm text-muted-foreground">Experience</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium">₹{astrologer.price}</div>
                      <div className="text-sm text-muted-foreground">Per Minute</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mb-6">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className={astrologer.waitTime === "Available" ? "text-green-600" : "text-muted-foreground"}>
                      {astrologer.waitTime}
                    </span>
                  </div>
                  
                  <div className="flex gap-4 w-full mb-3">
                    <Button 
                      onClick={handleCallClick}
                      variant="outline" 
                      className="flex-1 border-astro-purple text-astro-purple hover:bg-astro-purple hover:text-white"
                    >
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button className="flex-1 bg-astro-purple hover:bg-astro-violet">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleBookSession}
                    variant="outline" 
                    className="w-full border-astro-gold text-astro-gold hover:bg-astro-gold/10"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="md:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">About {astrologer.name}</h2>
                    <p className="text-muted-foreground">{astrologer.description}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Specialities</h2>
                    <div className="flex flex-wrap gap-2">
                      {astrologer.specialties.map((specialty, index) => (
                        <Badge key={index} className="bg-astro-light-purple/10 text-astro-purple hover:bg-astro-light-purple/20 px-3 py-1">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Education & Certification</h2>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-astro-purple mt-0.5" />
                      <div>
                        <div className="font-medium">{astrologer.education}</div>
                        <div className="text-sm text-muted-foreground">Certified Astrologer</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Client Reviews</h2>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-astro-gold text-astro-gold mr-1" />
                      <span className="font-medium">{astrologer.rating} / 5</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {astrologer.reviews.map(review => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">{review.name}</div>
                          <div className="text-sm text-muted-foreground">{review.date}</div>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'fill-astro-gold text-astro-gold' : 'text-muted'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <CallModal 
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        astrologer={{
          id: astrologer.id,
          name: astrologer.name,
          imageUrl: astrologer.imageUrl,
          price: astrologer.price
        }}
      />

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        astrologer={{
          id: astrologer.id,
          name: astrologer.name,
          imageUrl: astrologer.imageUrl,
          price: astrologer.price
        }}
      />
    </div>
  );
};

export default AstrologerDetail;
