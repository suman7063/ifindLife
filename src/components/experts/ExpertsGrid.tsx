
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from '../expert-card';
import ExpertDetailModal from '../expert-card/ExpertDetailModal';
import { ExpertCardData } from '../expert-card/types';
import { toast } from 'sonner';

interface ExpertsGridProps {
  experts?: ExpertCardData[];
  loading?: boolean;
  onResetFilters?: () => void;
}

const ExpertsGrid: React.FC<ExpertsGridProps> = ({ 
  experts = [], 
  loading = false,
  onResetFilters
}) => {
  const navigate = useNavigate();
  const [selectedExpert, setSelectedExpert] = useState<ExpertCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setSelectedExpert(expert);
    setIsModalOpen(true);
  };

  const handleConnectNow = (expert: ExpertCardData, type: 'video' | 'voice') => {
    console.log(`Connecting to ${expert.name} via ${type}`);
    toast.success(`Initiating ${type} call with ${expert.name}...`);
    // Here you would integrate with Agora SDK for video/voice calls
  };

  const handleBookNow = (expert: ExpertCardData) => {
    console.log(`Booking session with ${expert.name}`);
    toast.info(`Opening booking interface for ${expert.name}...`);
    // Here you would open the booking modal similar to the program booking
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="border rounded-md p-4 h-64 animate-pulse flex flex-col"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="ml-3 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="flex justify-end">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
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

export default ExpertsGrid;
