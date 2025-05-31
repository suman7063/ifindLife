
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface WelcomeSectionProps {
  expertName: string;
  expertStatus: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ expertName, expertStatus }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {expertName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your consultations today.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Badge variant={expertStatus === 'approved' ? 'default' : 'secondary'}>
              {expertStatus === 'approved' ? 'Verified Expert' : expertStatus || 'Pending'}
            </Badge>
            {expertStatus === 'approved' && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Available for bookings
              </Badge>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="text-right text-sm text-gray-600">
            <p>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p className="font-medium text-gray-800">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
