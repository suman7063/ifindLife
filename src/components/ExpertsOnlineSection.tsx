
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import ExpertCard from '@/components/expert-card';
import ExpertDetailModal from '@/components/expert-card/ExpertDetailModal';
import { ExpertCardData } from '@/components/expert-card/types';

const ExpertsOnlineSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedExpert, setSelectedExpert] = useState<ExpertCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expertConnectOptions, setExpertConnectOptions] = useState<{[key: string]: boolean}>({});

  // Sample experts data with proper typing
  const experts: ExpertCardData[] = [{
    id: '1',
    name: 'Dr. Emily Chen',
    specialization: 'Anxiety & Depression',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    averageRating: 4.9,
    reviewsCount: 128,
    status: 'online',
    waitTime: 'Available Now',
    verified: true,
    experience: 8,
    price: 120
  }, {
    id: '2',
    name: 'Dr. James Wilson',
    specialization: 'Relationship Counseling',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    averageRating: 4.8,
    reviewsCount: 96,
    status: 'online',
    waitTime: 'Available Now',
    verified: true,
    experience: 12,
    price: 150
  }, {
    id: '3',
    name: 'Dr. Aisha Patel',
    specialization: 'Trauma Therapy',
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    averageRating: 4.7,
    reviewsCount: 113,
    status: 'offline',
    waitTime: 'Back in 2 hours',
    verified: true,
    experience: 10,
    price: 135
  }];

  const handleExpertCardClick = (expert: ExpertCardData) => {
    setSelectedExpert(expert);
    setIsModalOpen(true);
  };

  const handleConnectNow = (expert: ExpertCardData, type: 'video' | 'voice') => {
    console.log(`Connecting to ${expert.name} via ${type}`);
    toast.success(`Initiating ${type} call with ${expert.name}...`);
    // Here you would integrate with Agora SDK for video/voice calls
    // navigate to call interface or open call modal
  };

  const handleBookNow = (expert: ExpertCardData) => {
    console.log(`Booking session with ${expert.name}`);
    toast.info(`Opening booking interface for ${expert.name}...`);
    // Here you would open the booking modal similar to the program booking
    // or navigate to a booking page
  };

  const handleShowConnectOptions = (expertId: string, show: boolean) => {
    setExpertConnectOptions(prev => ({
      ...prev,
      [expertId]: show
    }));
  };

  const handleModalConnectNow = (type: 'video' | 'voice') => {
    if (selectedExpert) {
      handleConnectNow(selectedExpert, type);
      setIsModalOpen(false);
    }
  };

  const handleModalBookNow = () => {
    if (selectedExpert) {
      handleBookNow(selectedExpert);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 sm:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-center">Experts Currently Online</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center">
              Connect instantly with our available experts for immediate guidance and support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experts.map(expert => (
              <div key={expert.id} className="flex">
                <ExpertCard
                  expert={expert}
                  onClick={() => handleExpertCardClick(expert)}
                  onConnectNow={(type) => handleConnectNow(expert, type)}
                  onBookNow={() => handleBookNow(expert)}
                  showConnectOptions={expertConnectOptions[expert.id.toString()] || false}
                  onShowConnectOptions={(show) => handleShowConnectOptions(expert.id.toString(), show)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={() => navigate("/experts")} className="bg-ifind-teal hover:bg-ifind-teal/90 text-white">
              View All Experts
            </Button>
          </div>
        </div>
      </section>

      <ExpertDetailModal
        expert={selectedExpert}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpert(null);
        }}
        onConnectNow={handleModalConnectNow}
        onBookNow={handleModalBookNow}
      />
    </>
  );
};

export default ExpertsOnlineSection;
