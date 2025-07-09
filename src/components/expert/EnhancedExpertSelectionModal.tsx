
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import LazyAgoraCallModal from '@/components/call/LazyAgoraCallModal';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

import { Expert, EnhancedExpertSelectionModalProps } from './types';
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';
import AuthRequiredDialog from './AuthRequiredDialog';
import AuthProtectionIndicator from './AuthProtectionIndicator';
import ExpertGrid from './ExpertGrid';

const EnhancedExpertSelectionModal: React.FC<EnhancedExpertSelectionModalProps> = ({
  isOpen,
  onClose,
  onExpertSelected,
  serviceTitle
}) => {
  const { isAuthenticated, userType } = useSimpleAuth();
  const { experts: realExperts, loading, error } = usePublicExpertsData();
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [operationId, setOperationId] = useState<string | null>(null);

  // Convert real expert data to mock format for compatibility with existing ExpertGrid
  const adaptedExperts: Expert[] = realExperts.map(expert => ({
    id: parseInt(expert.id),
    name: expert.name,
    imageUrl: expert.profilePicture,
    price: expert.price,
    specialization: expert.specialization,
    experience: `${expert.experience}+ years`,
    rating: expert.averageRating,
    reviews: expert.reviewsCount
  }));

  // Enhanced close handler with protection cleanup
  const handleClose = () => {
    // Only allow close if not in a critical operation
    if (showCallModal) {
      toast.warning('Please end the call before closing');
      return;
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

    console.log('Expert card clicked:', expert.name);
    setSelectedExpert(expert);
    onExpertSelected(expert.id);
  };

  // Handle call start with enhanced protection
  const handleStartCall = (expert: Expert) => {
    if (!isAuthenticated) {
      toast.error('Please log in to start a call');
      return;
    }

    console.log('Starting call for:', expert.name);
    setSelectedExpert(expert);
    setShowCallModal(true);
  };

  // Handle call end with protection cleanup
  const handleCallEnd = () => {
    console.log('Call ended');
    setShowCallModal(false);
    // Don't immediately close the expert selection - let user choose
  };

  // Show auth required dialog if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthRequiredDialog
        isOpen={isOpen}
        onClose={handleClose}
        serviceTitle={serviceTitle}
      />
    );
  }

  return (
    <>
      <Dialog open={isOpen && !showCallModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Choose an Expert for {serviceTitle}</span>
            </DialogTitle>
          </DialogHeader>

          <AuthProtectionIndicator
            isAuthProtected={isAuthenticated}
            serviceTitle={serviceTitle}
          />

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Failed to load experts. Please try again.
            </div>
          ) : (
            <ExpertGrid
              experts={adaptedExperts}
              selectedExpert={selectedExpert}
              isAuthProtected={isAuthenticated}
              onExpertCardClick={handleExpertCardClick}
              onStartCall={handleStartCall}
            />
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
