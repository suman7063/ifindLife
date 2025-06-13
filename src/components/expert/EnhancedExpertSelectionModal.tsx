
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';
import { useAuthProtection } from '@/utils/authProtection';
import ExpertCard from './ExpertCard';
import LazyAgoraCallModal from '@/components/call/LazyAgoraCallModal';
import { Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface Expert {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  specialization: string;
  experience: string;
  rating: number;
  reviews: number;
}

interface EnhancedExpertSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpertSelected: (expertId: number) => void;
  serviceTitle: string;
}

const EnhancedExpertSelectionModal: React.FC<EnhancedExpertSelectionModalProps> = ({
  isOpen,
  onClose,
  onExpertSelected,
  serviceTitle
}) => {
  const { isAuthenticated, sessionType, isAuthProtected } = useEnhancedUnifiedAuth();
  const { startProtection, endProtection } = useAuthProtection();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);

  // Mock experts data (in real app, this would come from an API)
  const experts: Expert[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      imageUrl: "/lovable-uploads/expert1.jpg",
      price: 150,
      specialization: "Life Coaching",
      experience: "10+ years",
      rating: 4.9,
      reviews: 245
    },
    {
      id: 2,
      name: "Mark Thompson",
      imageUrl: "/lovable-uploads/expert2.jpg",
      price: 120,
      specialization: "Career Guidance",
      experience: "8+ years",
      rating: 4.8,
      reviews: 189
    }
  ];

  // Start protection when modal opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      const id = `expert_selection_${serviceTitle}_${Date.now()}`;
      setOperationId(id);
      startProtection(id, 'booking');
      console.log('🔒 Started expert selection protection for:', serviceTitle);
    }
    
    return () => {
      if (operationId) {
        endProtection(operationId);
        console.log('🔒 Ended expert selection protection');
      }
    };
  }, [isOpen, isAuthenticated, serviceTitle]);

  // Enhanced close handler with protection cleanup
  const handleClose = () => {
    // Only allow close if not in a critical operation
    if (showCallModal) {
      toast.warning('Please end the call before closing');
      return;
    }

    if (operationId) {
      endProtection(operationId);
      setOperationId(null);
    }
    
    setSelectedExpert(null);
    setShowCallModal(false);
    onClose();
  };

  // Handle expert card click with protection
  const handleExpertCardClick = (expert: Expert) => {
    if (!isAuthenticated) {
      toast.error('Authentication required');
      return;
    }

    console.log('🔒 Expert card clicked with auth protection:', expert.name);
    setSelectedExpert(expert);
    onExpertSelected(expert.id);
  };

  // Handle call start with enhanced protection
  const handleStartCall = (expert: Expert) => {
    if (!isAuthenticated) {
      toast.error('Please log in to start a call');
      return;
    }

    console.log('🔒 Starting call with enhanced protection for:', expert.name);
    setSelectedExpert(expert);
    setShowCallModal(true);
  };

  // Handle call end with protection cleanup
  const handleCallEnd = () => {
    console.log('🔒 Call ended, maintaining auth protection');
    setShowCallModal(false);
    // Don't immediately close the expert selection - let user choose
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p>Please log in to select an expert for "{serviceTitle}"</p>
            <button 
              onClick={() => {
                window.location.href = '/user-login';
              }}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Login
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen && !showCallModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {isAuthProtected() && <Shield className="h-5 w-5 text-green-600" />}
              <span>Choose an Expert for {serviceTitle}</span>
            </DialogTitle>
          </DialogHeader>

          {/* Auth Protection Status */}
          {isAuthProtected() && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg mb-4">
              <Lock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Secure Session Active
                </p>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Your authentication is protected during this expert selection
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experts.map((expert) => (
              <div key={expert.id} className="relative">
                <ExpertCard
                  expert={expert}
                  onCardClick={() => handleExpertCardClick(expert)}
                  onCallClick={() => handleStartCall(expert)}
                  onChatClick={() => handleExpertCardClick(expert)}
                  showActions={true}
                />
                
                {/* Show protection indicator for selected expert */}
                {selectedExpert?.id === expert.id && isAuthProtected() && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-100 border border-green-300 rounded-full p-1">
                      <Lock className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {experts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No experts available for this service at the moment.</p>
              <p className="text-sm text-gray-400 mt-2">Please try again later.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Call Modal with Enhanced Protection */}
      {showCallModal && selectedExpert && (
        <LazyAgoraCallModal
          isOpen={showCallModal}
          onClose={handleCallEnd}
          expert={selectedExpert}
        />
      )}
    </>
  );
};

export default EnhancedExpertSelectionModal;
