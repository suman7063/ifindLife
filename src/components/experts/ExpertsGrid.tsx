import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from '../expert-card';
import { ExpertCardData } from '../expert-card/types';

interface ExpertsGridProps {
  experts?: ExpertCardData[];
  loading?: boolean;
}

const ExpertsGrid: React.FC<ExpertsGridProps> = ({ experts = [], loading = false }) => {
  const navigate = useNavigate();

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

  const handleViewExpert = (expertId: string | number) => {
    navigate(`/experts/${expertId}`);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {defaultExperts.map((expert) => (
        <ExpertCard
          key={expert.id.toString()}
          expert={expert}
          onClick={() => handleViewExpert(expert.id)}
          className="h-full"
        />
      ))}
    </div>
  );
};

export default ExpertsGrid;
