
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Calendar } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';

interface ProgramModalFooterProps {
  programData: ProgramDetail;
  isAuthenticated: boolean;
  isWishlisted: boolean;
  isEnrolling: boolean;
  onEnrollNow: () => void;
  onWishlistToggle: () => void;
  onBookSession: () => void;
}

const ProgramModalFooter: React.FC<ProgramModalFooterProps> = ({
  programData,
  isAuthenticated,
  isWishlisted,
  isEnrolling,
  onEnrollNow,
  onWishlistToggle,
  onBookSession
}) => {
  return (
    <div className="border-t p-6 pt-4 flex-shrink-0">
      <div className="flex flex-col gap-4">
        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1 bg-ifind-teal hover:bg-ifind-teal/90 flex items-center gap-2"
            onClick={onEnrollNow}
            disabled={isEnrolling}
          >
            <ShoppingCart className="h-4 w-4" />
            {isEnrolling ? "Enrolling..." : `Enroll Now (₹${programData.pricing.individual.perSession})`}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 flex items-center gap-2"
            onClick={onWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </Button>
        </div>

        {/* Book Session Action */}
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          onClick={onBookSession}
        >
          <Calendar className="h-4 w-4" />
          Book Individual Session
        </Button>

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
  );
};

export default ProgramModalFooter;
