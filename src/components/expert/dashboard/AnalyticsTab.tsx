
import React from 'react';

interface AnalyticsTabProps {
  user?: any;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ user }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      <p className="text-gray-600">Analytics content for {user?.name || 'expert'} will be displayed here.</p>
      {/* Analytics content goes here */}
    </div>
  );
};

export default AnalyticsTab;
