
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import ExpertCard from '@/components/expert-card';
import ExpertDetailModal from '@/components/expert-card/ExpertDetailModal';
import { ExpertCardData } from '@/components/expert-card/types';
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';
import { useRealExpertPresence } from '@/hooks/useRealExpertPresence';

const ExpertsOnlineSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSimpleAuth();
  const { experts: allExperts, loading } = usePublicExpertsData();
  const expertIds = allExperts.map(e => e.id);
  const { getExpertAvailability, updateExpertPresence } = useRealExpertPresence(expertIds);
  const [selectedExpert, setSelectedExpert] = useState<ExpertCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expertConnectOptions, setExpertConnectOptions] = useState<{[key: string]: boolean}>({});

  // Filter experts to show only those that are currently online and available
  const onlineExperts = allExperts.filter(expert => {
    const availability = getExpertAvailability(expert.id);
    return expert.status === 'online' && availability === 'available';
  }).slice(0, 3);

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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-md p-4 h-64 animate-pulse flex flex-col">
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
          ) : onlineExperts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {onlineExperts.map(expert => (
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
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-8">
                No experts are currently online. Please check back later or browse all experts.
              </p>
            </div>
          )}
          
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
