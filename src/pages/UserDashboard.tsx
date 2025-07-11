
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { isUserAuthenticated } from '@/utils/authHelpers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import ProfilePictureCard from '@/components/user/dashboard/profile/ProfilePictureCard';
import WalletCard from '@/components/user/dashboard/wallet/WalletCard';

const UserDashboard = () => {
  const simpleAuth = useSimpleAuth();
  const navigate = useNavigate();
  
  console.log('UserDashboard: Starting with auth state:', simpleAuth);

  if (simpleAuth?.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isUserAuthenticated(simpleAuth)) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p>Please log in to access your dashboard.</p>
            <button 
              onClick={() => navigate('/user-login')}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Welcome back, {simpleAuth.userProfile?.name || simpleAuth.user?.email}!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProfilePictureCard user={simpleAuth.userProfile} />
            <WalletCard user={simpleAuth.userProfile} />
            
            {/* Additional dashboard cards can be added here */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-2">
                <p className="text-sm">Email: {simpleAuth.user?.email}</p>
                <p className="text-sm">User Type: {simpleAuth.userType}</p>
                {simpleAuth.userProfile && (
                  <>
                    <p className="text-sm">Phone: {simpleAuth.userProfile.phone || 'Not set'}</p>
                    <p className="text-sm">Country: {simpleAuth.userProfile.country || 'Not set'}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default UserDashboard;
