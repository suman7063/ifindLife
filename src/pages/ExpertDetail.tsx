import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AgoraCallModal from '@/components/AgoraCallModal';
import AgoraChatModal from '@/components/AgoraChatModal';
import { toast } from 'sonner';
import ExpertHeader from '@/components/expert/ExpertHeader';
import ExpertProfile from '@/components/expert/ExpertProfile';
import ExpertDetailTabs from '@/components/expert/ExpertDetailTabs';

const ExpertDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  
  useEffect(() => {
    if (searchParams.get('call') === 'true') {
      setIsCallModalOpen(true);
    }
    if (searchParams.get('chat') === 'true') {
      setIsChatModalOpen(true);
    }
  }, [searchParams]);
  
  const expert = {
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
    description: "Acharya Raman is an experienced expert with over 15 years of experience in Vedic astrology, palmistry, and tarot reading. He has helped thousands of people find clarity and direction in their lives through his accurate predictions and spiritual guidance.",
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
    if (expert.online && expert.waitTime === "Available") {
      setIsCallModalOpen(true);
    } else {
      toast.error("Expert Unavailable", {
        description: "This expert is currently offline or busy. Please try again later."
      });
    }
  };
  
  const handleBookClick = () => {
    const tabElement = document.getElementById('booking-tab');
    if (tabElement) {
      tabElement.click();
    }
  };
  
  const handleChatClick = () => {
    if (expert.online && expert.waitTime === "Available") {
      setIsChatModalOpen(true);
    } else {
      toast.error("Expert Unavailable", {
        description: "This expert is currently offline or busy. Please try again later."
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ExpertHeader />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <ExpertProfile 
                expert={expert} 
                onCallClick={handleCallClick}
                onBookClick={handleBookClick}
                onChatClick={handleChatClick}
              />
            </div>
            
            <div className="md:col-span-2">
              <ExpertDetailTabs expert={expert} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <AgoraCallModal 
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        expert={{
          id: expert.id,
          name: expert.name,
          imageUrl: expert.imageUrl,
          price: expert.price
        }}
      />
      
      <AgoraChatModal 
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        expert={{
          id: expert.id,
          name: expert.name,
          imageUrl: expert.imageUrl,
          price: expert.price
        }}
      />
    </div>
  );
};

export default ExpertDetail;
