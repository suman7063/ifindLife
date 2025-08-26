
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from './expert-card';
import { ExpertCardData } from './expert-card/types';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface TopTherapistsSectionProps {
  experts?: ExpertCardData[];
}

const TopTherapistsSection: React.FC<TopTherapistsSectionProps> = ({ experts = [] }) => {
  const navigate = useNavigate();
  const [expertConnectOptions, setExpertConnectOptions] = useState<{[key: string]: boolean}>({});

  // Default experts if none provided
  const defaultExperts: ExpertCardData[] = experts.length > 0 ? experts : [
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
  ];

  const handleExpertCardClick = (expert: ExpertCardData) => {
    console.log('Expert card clicked:', expert);
    console.log('Expert ID:', expert.id);
    console.log('Expert auth_id:', expert.auth_id);
    
    const expertId = expert.auth_id || expert.id;
    console.log('Using expertId for navigation:', expertId);
    
    if (!expertId) {
      console.error('No valid expert ID found:', expert);
      toast.error('Unable to navigate to expert page - missing ID');
      return;
    }
    
    const targetUrl = `/experts/${expertId}`;
    console.log('Navigating to:', targetUrl);
    
    // Navigate to dedicated expert page
    navigate(targetUrl);
  };

  const handleConnectNow = (expert: ExpertCardData, type: 'video' | 'voice') => {
    console.log(`Connecting to ${expert.name} via ${type}`);
    toast.success(`Initiating ${type} call with ${expert.name}...`);
    // Here you would integrate with Agora SDK for video/voice calls
  };

  const handleBookNow = (expert: ExpertCardData) => {
    console.log(`Booking session with ${expert.name}`);
    
    // Navigate to expert's booking page with booking tab active
    const expertUrl = `/experts/${expert.auth_id || expert.id}?book=true`;
    window.location.href = expertUrl;
  };

  const handleShowConnectOptions = (expertId: string, show: boolean) => {
    setExpertConnectOptions(prev => ({
      ...prev,
      [expertId]: show
    }));
  };

  const handleModalConnectNow = (type: 'video' | 'voice') => {
    // No longer needed since we don't have modals
  };

  const handleModalBookNow = () => {
    // No longer needed since we don't have modals
  };

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
    </>
  );
};

export default TopTherapistsSection;
