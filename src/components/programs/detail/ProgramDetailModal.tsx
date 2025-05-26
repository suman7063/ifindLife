
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProgramDetail } from '@/types/programDetail';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, ShoppingCart, Calendar, X } from 'lucide-react';
import ProgramDetailTabs from './ProgramDetailTabs';
import ProgramDetailContent from './ProgramDetailContent';
import { useUserAuth } from '@/contexts/auth/hooks/useUserAuth';
import { useToast } from '@/hooks/use-toast';

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
  const { currentUser, isAuthenticated } = useUserAuth();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isEnrolling, setIsEnrolling] = React.useState(false);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add programs to your wishlist.",
        variant: "destructive"
      });
      return;
    }

    try {
      // TODO: Implement wishlist API call
      setIsWishlisted(!isWishlisted);
      toast({
        title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
        description: isWishlisted 
          ? "Program removed from your wishlist" 
          : "Program added to your wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEnrollNow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in programs.",
        variant: "destructive"
      });
      return;
    }

    if (!programData) return;

    setIsEnrolling(true);
    try {
      // TODO: Implement enrollment API call
      toast({
        title: "Enrollment Initiated",
        description: "Redirecting to payment...",
      });
      
      // Simulate enrollment process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Redirect to payment or show payment modal
      console.log('Enrolling in program:', programData.id);
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Failed to start enrollment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleBookConsultation = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book consultations.",
        variant: "destructive"
      });
      return;
    }

    if (!programData) return;

    try {
      // TODO: Implement booking API call
      toast({
        title: "Consultation Booking",
        description: "Opening booking calendar...",
      });
      
      // TODO: Open booking modal or redirect to booking page
      console.log('Booking consultation for program:', programData.id);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Failed to open booking. Please try again.",
        variant: "destructive"
      });
    }
  };

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] h-[90vh] p-0 gap-0 flex flex-col" hideCloseButton>
        {/* Header - Fixed */}
        <div className="border-b p-6 pb-4 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{programData.title}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img 
                    src={programData.expert.photo} 
                    alt={programData.expert.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{programData.expert.name}</p>
                    <p className="text-xs text-gray-500">{programData.expert.experience} experience</p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs - Fixed */}
        <div className="flex-shrink-0">
          <ProgramDetailTabs activeTab={activeTab} onTabChange={onTabChange} />
        </div>

        {/* Content - Scrollable */}
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

        {/* Enhanced Footer CTAs - Fixed */}
        <div className="border-t p-6 pt-4 flex-shrink-0">
          <div className="flex flex-col gap-4">
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 bg-ifind-teal hover:bg-ifind-teal/90 flex items-center gap-2"
                onClick={handleEnrollNow}
                disabled={isEnrolling}
              >
                <ShoppingCart className="h-4 w-4" />
                {isEnrolling ? "Enrolling..." : `Enroll Now (₹${programData.pricing.individual.perSession})`}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2"
                onClick={handleBookConsultation}
              >
                <Calendar className="h-4 w-4" />
                Book Consultation
              </Button>
            </div>
            
            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2"
                onClick={handleWishlistToggle}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
              <Button variant="ghost" className="flex-1">
                Share Program
              </Button>
            </div>

            {/* Package Deal Notice */}
            {programData.pricing.individual.discount && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700 text-center">
                  💰 Save {programData.pricing.individual.discount.percentage}% with full program booking - 
                  {programData.pricing.individual.discount.conditions}
                </p>
              </div>
            )}

            {/* Authentication Notice */}
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700 text-center">
                  📝 Please log in to enroll in programs and access exclusive features
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetailModal;
