import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
interface Expert {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  status: 'online' | 'offline';
  waitTime: string;
}
const ExpertsOnlineSection = () => {
  const navigate = useNavigate();

  // Sample experts data matching the screenshot
  const experts: Expert[] = [{
    id: '1',
    name: 'Dr. Emily Chen',
    specialization: 'Anxiety & Depression',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    rating: 4.9,
    reviewCount: 128,
    status: 'online',
    waitTime: 'Available Now'
  }, {
    id: '2',
    name: 'Dr. James Wilson',
    specialization: 'Relationship Counseling',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    rating: 4.8,
    reviewCount: 96,
    status: 'online',
    waitTime: 'Available Now'
  }, {
    id: '3',
    name: 'Dr. Aisha Patel',
    specialization: 'Trauma Therapy',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    rating: 4.7,
    reviewCount: 113,
    status: 'online',
    waitTime: 'Available Now'
  }];
  const handleViewExpert = (expertId: string) => {
    navigate(`/experts/${expertId}`);
  };
  const handleAddToFavorites = (e: React.MouseEvent, expertId: string) => {
    e.stopPropagation();
    console.log(`Added expert ${expertId} to favorites`);
    // Add favorite functionality here
  };
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Experts Currently Online</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center">
            Connect instantly with our available experts for immediate guidance and support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experts.map(expert => <div key={expert.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer overflow-hidden" onClick={() => handleViewExpert(expert.id)}>
              <div className="relative h-48 overflow-hidden">
                <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover" />
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100" onClick={e => handleAddToFavorites(e, expert.id)} aria-label="Add to favorites">
                  <Heart className="h-5 w-5 text-ifind-teal" />
                </button>
                <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  {expert.status === 'online' ? 'Online' : 'Offline'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-xl mb-1 text-left">{expert.name}</h3>
                <p className="text-gray-600 text-sm mb-3 text-left">{expert.specialization}</p>
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 font-medium">{expert.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-600 text-sm">{expert.reviewCount} reviews</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-500 font-medium">{expert.waitTime}</span>
                  <Button className="bg-ifind-teal hover:bg-ifind-teal/90 text-white" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </div>)}
        </div>
        
        <div className="text-center mt-8">
          <Button onClick={() => navigate("/experts")} className="bg-ifind-teal hover:bg-ifind-teal/90 text-white">
            View All Experts
          </Button>
        </div>
      </div>
    </section>;
};
export default ExpertsOnlineSection;