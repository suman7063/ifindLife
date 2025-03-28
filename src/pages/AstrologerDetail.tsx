
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallModal from '@/components/CallModal';
import { toast } from '@/hooks/use-toast';
import AstrologerHeader from '@/components/astrologer/AstrologerHeader';
import AstrologerProfile from '@/components/astrologer/AstrologerProfile';
import AstrologerDetailTabs from '@/components/astrologer/AstrologerDetailTabs';

const AstrologerDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  
  useEffect(() => {
    if (searchParams.get('call') === 'true') {
      setIsCallModalOpen(true);
    }
  }, [searchParams]);
  
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AstrologerHeader />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <AstrologerProfile 
                astrologer={astrologer} 
                onCallClick={handleCallClick} 
              />
            </div>
            
            <div className="md:col-span-2">
              <AstrologerDetailTabs astrologer={astrologer} />
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
    </div>
  );
};

export default AstrologerDetail;
