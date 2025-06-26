
import React from 'react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

const SimpleAuthTest: React.FC = () => {
  const { user, userType, isLoading, isAuthenticated, expert, userProfile } = useSimpleAuth();

  if (isLoading) {
    return <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">Loading auth state...</div>;
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded">
      <h3 className="font-bold mb-2">Simple Auth State Debug</h3>
      <div className="space-y-1 text-sm">
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User Type:</strong> {userType}</p>
        <p><strong>User Email:</strong> {user?.email || 'None'}</p>
        <p><strong>Has Expert Profile:</strong> {expert ? 'Yes' : 'No'}</p>
        <p><strong>Has User Profile:</strong> {userProfile ? 'Yes' : 'No'}</p>
        {expert && <p><strong>Expert Status:</strong> {expert.status}</p>}
      </div>
    </div>
  );
};

export default SimpleAuthTest;
