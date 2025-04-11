
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AgoraCallModal from '@/components/call/modals/AgoraCallModal';
import { toast } from 'sonner';
import ExpertHeader from '@/components/expert/ExpertHeader';
import ExpertProfile from '@/components/expert/ExpertProfile';
import ExpertDetailTabs from '@/components/expert/ExpertDetailTabs';

const ExpertDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  
  useEffect(() => {
    if (searchParams.get('call') === 'true') {
      setIsCallModalOpen(true);
    }
  }, [searchParams]);
  
  // Fix id typing issue
  const expertId = id || '';
  
  // Mock expert data
  const expert = {
    id: expertId,
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
  
  // Adapt the expert data for components expecting ExpertProfile type
  const expertProfile = {
    id: expertId,
    name: expert.name,
    experience: expert.experience,
    specialties: expert.specialties,
    rating: expert.rating,
    consultations: expert.consultations,
    price: expert.price,
    waitTime: expert.waitTime,
    online: expert.online,
    languages: expert.languages,
    price_per_min: expert.price,
    imageUrl: expert.imageUrl
  };
  
  // Adapt data for ExpertDetailTabs
  const expertForTabs = {
    id: expertId,
    name: expert.name,
    experience: expert.experience,
    description: expert.description,
    education: expert.education,
    specialties: expert.specialties,
    rating: expert.rating,
    reviews: expert.reviews
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
                expert={expertProfile} 
                onCallClick={handleCallClick} 
              />
            </div>
            
            <div className="md:col-span-2">
              <ExpertDetailTabs expert={expertForTabs} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <AgoraCallModal 
        isOpen={isCallModalOpen}
        onOpenChange={() => setIsCallModalOpen(false)}
        expert={{
          id: expertId,
          name: expert.name,
          price: expert.price,
          imageUrl: expert.imageUrl
        }}
      />
    </div>
  );
};

export default ExpertDetail;
