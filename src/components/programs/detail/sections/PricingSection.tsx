
import React from 'react';
import { IndianRupee, Clock, Calendar, Users } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';

interface PricingSectionProps {
  pricing: ProgramDetail['pricing'];
}

const PricingSection: React.FC<PricingSectionProps> = ({ pricing }) => {
  const currencySymbol = pricing.currency === 'INR' ? '₹' : '$';

  return (
    <div className="space-y-6">
      {/* Pricing Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Pricing Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Individual Pricing */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-ifind-teal" />
              <h4 className="font-semibold">Individual Sessions</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Per Session</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                  <IndianRupee className="h-5 w-5" />
                  {pricing.individual.perSession.toLocaleString()}
                </p>
              </div>
              
              {pricing.individual.packagePrice && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 font-medium">Package Deal</p>
                  <p className="text-xl font-bold text-green-800 flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {pricing.individual.packagePrice.toLocaleString()}
                  </p>
                  {pricing.individual.discount && (
                    <p className="text-sm text-green-600 mt-1">
                      Save {pricing.individual.discount.percentage}% - {pricing.individual.discount.conditions}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Group Pricing (if available) */}
          {pricing.group && (
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-ifind-teal" />
                <h4 className="font-semibold">Group Sessions</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Per Person</p>
                  <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                    <IndianRupee className="h-5 w-5" />
                    {pricing.group.perPerson.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    Minimum {pricing.group.minParticipants} participants required
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total Cost Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Program Investment</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-ifind-teal mb-2">
            ₹{pricing.individual.totalCost.toLocaleString()}
          </div>
          <p className="text-gray-600 mb-4">Complete program cost</p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Individual therapy sessions</p>
            <p>• ₹{pricing.individual.perSession.toLocaleString()} per session</p>
            <p>• Comprehensive program materials included</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
