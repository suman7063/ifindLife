
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProgramDetail } from '@/types/programDetail';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProgramDetailTabs from './ProgramDetailTabs';
import ProgramDetailContent from './ProgramDetailContent';

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
  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 gap-0" hideCloseButton>
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ifind-aqua"></div>
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
            <h3 className="text-lg font-semibold mb-2 text-ifind-charcoal">Error Loading Program</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={onClose} className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white">Close</Button>
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
      <DialogContent className="sm:max-w-[900px] h-[90vh] p-0 gap-0 flex flex-col bg-ifind-offwhite" hideCloseButton>
        {/* Header - Fixed */}
        <div className="border-b border-gray-200 p-6 pb-4 flex-shrink-0 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-ifind-charcoal mb-2">{programData.title}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img 
                    src={programData.expert.photo} 
                    alt={programData.expert.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-ifind-teal"
                  />
                  <div>
                    <p className="font-medium text-sm text-ifind-charcoal">{programData.expert.name}</p>
                    <p className="text-xs text-gray-500">{programData.expert.experience} experience</p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 flex-shrink-0 text-ifind-charcoal hover:bg-ifind-teal/10"
            >
              <span className="h-4 w-4">×</span>
            </Button>
          </div>
        </div>

        {/* Tabs - Fixed */}
        <div className="flex-shrink-0 bg-white">
          <ProgramDetailTabs activeTab={activeTab} onTabChange={onTabChange} />
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-hidden bg-ifind-offwhite">
          <ScrollArea className="h-full w-full">
            <div className="h-full">
              <ProgramDetailContent 
                programData={programData} 
                activeTab={activeTab} 
              />
            </div>
          </ScrollArea>
        </div>

        {/* Footer CTAs - Fixed */}
        <div className="border-t border-gray-200 p-6 pt-4 flex-shrink-0 bg-white">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 bg-ifind-aqua hover:bg-ifind-aqua/90 text-white">
              Book Now (₹{programData.pricing.individual.perSession})
            </Button>
            <Button variant="outline" className="flex-1 border-ifind-teal text-ifind-teal hover:bg-ifind-teal hover:text-white">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetailModal;
