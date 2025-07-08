
import React from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

const EmergencyAuthFix = () => {
  const auth = useSimpleAuth();
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="fixed top-4 left-4 bg-red-500 text-white p-4 rounded z-50 max-w-sm">
      <h3 className="font-bold mb-2">🚨 Emergency Auth Debug</h3>
      <div className="text-xs space-y-1 mb-3">
        <div>Loading: <span className="font-mono">{String(auth.isLoading)}</span></div>
        <div>Authenticated: <span className="font-mono">{String(auth.isAuthenticated)}</span></div>
        <div>User: <span className="font-mono">{auth.user?.email || 'None'}</span></div>
        <div>Type: <span className="font-mono">{auth.userType}</span></div>
        <div>Has Session: <span className="font-mono">{String(!!auth.session)}</span></div>
      </div>
      <div className="space-y-1">
        <button 
          onClick={() => {
            console.log('🧪 EMERGENCY: Setting test user');
            // This is just for debugging - won't actually work without proper auth
            console.log('Current auth state:', auth);
          }}
          className="block w-full bg-white text-red-500 px-2 py-1 rounded text-xs hover:bg-gray-100"
        >
          Log Auth State
        </button>
        <button 
          onClick={() => {
            console.log('🔄 EMERGENCY: Refreshing profiles');
            auth.refreshProfiles();
          }}
          className="block w-full bg-white text-red-500 px-2 py-1 rounded text-xs hover:bg-gray-100"
        >
          Refresh Profiles
        </button>
      </div>
    </div>
  );
};

export default EmergencyAuthFix;
