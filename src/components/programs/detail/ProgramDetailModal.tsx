
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProgramDetail } from '@/types/programDetail';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProgramDetailTabs from './ProgramDetailTabs';
import ProgramDetailContent from './ProgramDetailContent';
import ProgramModalHeader from './modal/ProgramModalHeader';
import ProgramModalFooter from './modal/ProgramModalFooter';
import ProgramBookingDialog from '../booking/ProgramBookingDialog';
import { useProgramModalActions } from './modal/useProgramModalActions';
import { useProgramBooking } from '../booking/useProgramBooking';

interface ProgramDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  programData: ProgramDetail | null;
  activeTab: 'structure' | 'coverage' | 'outcomes' | 'pricing' | 'reviews';
  onTabChange: (tab: 'structure' | 'coverage' | 'outcomes' | 'pricing' | 'reviews') => void;
  loading?: boolean;
  error?: string | null;
}

const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  isOpen,
  onClose,
  programData,
  activeTab,
  onTabChange,
  loading = false,
  error = null
}) => {
  const {
    isWishlisted,
    isEnrolling,
    handleWishlistToggle,
    handleEnrollNow,
    isAuthenticated
  } = useProgramModalActions(programData);

  const {
    isBookingDialogOpen,
    openBookingDialog,
    closeBookingDialog,
    handleBookingComplete
  } = useProgramBooking();

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 gap-0" hideCloseButton>
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ifind-teal"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] p-6" hideCloseButton>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Error Loading Program</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!programData) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] h-[90vh] p-0 gap-0 flex flex-col" hideCloseButton>
          {/* Header */}
          <ProgramModalHeader 
            programData={programData} 
            onClose={onClose} 
          />

          {/* Tabs */}
          <div className="flex-shrink-0">
            <ProgramDetailTabs activeTab={activeTab} onTabChange={onTabChange} />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className="h-full">
                <ProgramDetailContent 
                  programData={programData} 
                  activeTab={activeTab} 
                />
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <ProgramModalFooter
            programData={programData}
            isAuthenticated={isAuthenticated}
            isWishlisted={isWishlisted}
            isEnrolling={isEnrolling}
            onEnrollNow={handleEnrollNow}
            onWishlistToggle={handleWishlistToggle}
            onBookSession={openBookingDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <ProgramBookingDialog
        isOpen={isBookingDialogOpen}
        onClose={closeBookingDialog}
        programData={programData}
        onBookingComplete={handleBookingComplete}
      />
    </>
  );
};

export default ProgramDetailModal;
