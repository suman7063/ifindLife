
import React, { useState, memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from './expert-card';
import ExpertDetailModal from './expert-card/ExpertDetailModal';
import { ExpertCardData } from './expert-card/types';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface TopTherapistsSectionProps {
  experts?: ExpertCardData[];
}

const TopTherapistsSection: React.FC<TopTherapistsSectionProps> = memo(({ experts = [] }) => {
  const navigate = useNavigate();
  const [selectedExpert, setSelectedExpert] = useState<ExpertCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expertConnectOptions, setExpertConnectOptions] = useState<{[key: string]: boolean}>({});

  // Memoized default experts
  const defaultExperts: ExpertCardData[] = useMemo(() => experts.length > 0 ? experts : [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cognitive Behavioral Therapy',
      averageRating: 4.9,
      reviewsCount: 124,
      verified: true,
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      status: 'online',
      experience: 8,
      price: 120,
      waitTime: '2-3 days'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Family Therapy',
      averageRating: 4.7,
      reviewsCount: 98,
      verified: true,
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      status: 'offline',
      experience: 10,
      price: 135,
      waitTime: '1 week'
    },
    {
      id: '3',
      name: 'Dr. Leila Patel',
      specialization: 'Trauma Therapy',
      averageRating: 4.8,
      reviewsCount: 156,
      verified: true,
      profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      status: 'online',
      experience: 12,
      price: 150,
      waitTime: 'Same day'
    }
  ], [experts.length]);

  const handleExpertCardClick = useCallback((expert: ExpertCardData) => {
    setSelectedExpert(expert);
    setIsModalOpen(true);
  }, []);

  const handleConnectNow = useCallback((expert: ExpertCardData, type: 'video' | 'voice') => {
    toast.success(`Initiating ${type} call with ${expert.name}...`);
    navigate(`/experts/${expert.auth_id || expert.id}?action=connect&type=${type}`);
  }, [navigate]);

  const handleBookNow = useCallback((expert: ExpertCardData) => {
    const expertUrl = `/experts/${expert.auth_id || expert.id}?book=true`;
    window.location.href = expertUrl;
  }, []);

  const handleShowConnectOptions = useCallback((expertId: string, show: boolean) => {
    setExpertConnectOptions(prev => ({
      ...prev,
      [expertId]: show
    }));
  }, []);

  const handleModalConnectNow = useCallback((type: 'video' | 'voice') => {
    if (selectedExpert) {
      handleConnectNow(selectedExpert, type);
      setIsModalOpen(false);
    }
  }, [selectedExpert, handleConnectNow]);

  const handleModalBookNow = useCallback(() => {
    if (selectedExpert) {
      handleBookNow(selectedExpert);
      setIsModalOpen(false);
    }
  }, [selectedExpert, handleBookNow]);

  return (
    <>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-left">Our Top Therapists</h2>
            <p className="text-lg text-gray-600 max-w-2xl text-left">
              Connect with our highly qualified and experienced therapists who are ready to support you on your wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultExperts.map((expert) => (
              <ExpertCard
                key={expert.id.toString()}
                expert={expert}
                onClick={() => handleExpertCardClick(expert)}
                onConnectNow={(type) => handleConnectNow(expert, type)}
                onBookNow={() => handleBookNow(expert)}
                showConnectOptions={expertConnectOptions[expert.id.toString()] || false}
                onShowConnectOptions={(show) => handleShowConnectOptions(expert.id.toString(), show)}
                className="h-full"
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={() => navigate('/experts')}
              className="bg-primary hover:bg-primary/90"
            >
              View All Therapists
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
});

TopTherapistsSection.displayName = 'TopTherapistsSection';

export default TopTherapistsSection;
