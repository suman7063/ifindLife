
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import ExpertCard from '@/components/expert-card';
import { ExpertCardData } from '@/components/expert-card/types';
import ExpertDetailModal from '@/components/expert-card/ExpertDetailModal';
import { toast } from 'sonner';
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';

interface ExpertSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  experts?: ExpertCardData[];
}

const ExpertSelectionModal: React.FC<ExpertSelectionModalProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  experts = []
}) => {
  const { experts: realExperts, loading, error } = usePublicExpertsData();
  const [selectedExpert, setSelectedExpert] = useState<ExpertCardData | null>(null);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [expertConnectOptions, setExpertConnectOptions] = useState<{[key: string]: boolean}>({});

  // Use provided experts first, then real experts, then fallback to sample data
  const defaultExperts: ExpertCardData[] = experts.length > 0 ? experts : 
    realExperts.length > 0 ? realExperts : [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Clinical Psychology',
      averageRating: 4.9,
      reviewsCount: 124,
      verified: true,
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      status: 'online',
      experience: 8,
      price: 150,
      waitTime: 'Available Now'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Cognitive Therapy',
      averageRating: 4.7,
      reviewsCount: 98,
      verified: true,
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      status: 'online',
      experience: 10,
      price: 135,
      waitTime: 'Available Now'
    },
    {
      id: '3',
      name: 'Dr. Aisha Patel',
      specialization: 'Trauma Therapy',
      averageRating: 4.8,
      reviewsCount: 156,
      verified: true,
      profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      status: 'offline',
      experience: 12,
      price: 160,
      waitTime: 'Back in 2 hours'
    },
    {
      id: '4',
      name: 'Dr. Raj Kumar',
      specialization: 'Family Counseling',
      averageRating: 4.6,
      reviewsCount: 87,
      verified: true,
      profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      status: 'offline',
      experience: 9,
      price: 140,
      waitTime: 'Available Tomorrow'
    }
  ];

  // Separate online and offline experts
  const onlineExperts = defaultExperts.filter(expert => expert.status === 'online');
  const offlineExperts = defaultExperts.filter(expert => expert.status === 'offline');

  const handleExpertCardClick = (expert: ExpertCardData) => {
    setSelectedExpert(expert);
    setIsExpertModalOpen(true);
  };

  const handleConnectNow = (expert: ExpertCardData, type: 'video' | 'voice') => {
    console.log(`Connecting to ${expert.name} via ${type} for ${serviceTitle}`);
    toast.success(`Initiating ${type} call with ${expert.name}...`);
    onClose();
  };

  const handleBookNow = (expert: ExpertCardData) => {
    console.log(`Booking session with ${expert.name} for ${serviceTitle}`);
    toast.info(`Opening booking interface for ${expert.name}...`);
    onClose();
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
      setIsExpertModalOpen(false);
    }
  };

  const handleModalBookNow = () => {
    if (selectedExpert) {
      handleBookNow(selectedExpert);
      setIsExpertModalOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">Select an Expert</DialogTitle>
                <p className="text-gray-600 mt-1">Choose an expert for: {serviceTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </DialogHeader>

          <div className="py-6 space-y-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Loading experts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                <p>Failed to load experts. Please try again.</p>
              </div>
            ) : (
              <>
                {/* Online Experts Section */}
                {onlineExperts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-xl font-semibold">Available Now</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {onlineExperts.length} experts online
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {onlineExperts.map((expert) => (
                        <ExpertCard
                          key={expert.id}
                          expert={expert}
                          onClick={() => handleExpertCardClick(expert)}
                          onConnectNow={(type) => handleConnectNow(expert, type)}
                          onBookNow={() => handleBookNow(expert)}
                          showConnectOptions={expertConnectOptions[String(expert.id)] || false}
                          onShowConnectOptions={(show) => handleShowConnectOptions(String(expert.id), show)}
                          className="h-full"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Offline Experts Section */}
                {offlineExperts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-xl font-semibold">Schedule for Later</h3>
                      <Badge variant="outline" className="border-gray-300 text-gray-600">
                        {offlineExperts.length} experts available
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {offlineExperts.map((expert) => (
                        <ExpertCard
                          key={expert.id}
                          expert={expert}
                          onClick={() => handleExpertCardClick(expert)}
                          onConnectNow={(type) => handleConnectNow(expert, type)}
                          onBookNow={() => handleBookNow(expert)}
                          showConnectOptions={expertConnectOptions[String(expert.id)] || false}
                          onShowConnectOptions={(show) => handleShowConnectOptions(String(expert.id), show)}
                          className="h-full"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {defaultExperts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No experts available for this service at the moment.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ExpertDetailModal
        expert={selectedExpert}
        isOpen={isExpertModalOpen}
        onClose={() => {
          setIsExpertModalOpen(false);
          setSelectedExpert(null);
        }}
        onConnectNow={handleModalConnectNow}
        onBookNow={handleModalBookNow}
      />
    </>
  );
};

export default ExpertSelectionModal;
