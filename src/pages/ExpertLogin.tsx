
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExpertLoginHeader from '@/components/expert/auth/ExpertLoginHeader';
import ExpertLoginContent from '@/components/expert/auth/ExpertLoginContent';
import ExpertLoginTabs from '@/components/expert/auth/ExpertLoginTabs';
import DualSessionAlert from '@/components/expert/auth/DualSessionAlert';
import { Container } from '@/components/ui/container';
import LoadingView from '@/components/expert/auth/LoadingView';

const ExpertLogin: React.FC = () => {
  const { isAuthenticated, isLoading, role, sessionType } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  
  // Handle redirect for authenticated users
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (sessionType === 'expert' || role === 'expert') {
        console.log('Already authenticated as expert, redirecting to expert dashboard');
        navigate('/expert-dashboard');
      } else if (sessionType === 'user' || role === 'user') {
        console.log('Already authenticated as user, redirecting to user dashboard');
        navigate('/user-dashboard');
      }
    }
  }, [isAuthenticated, isLoading, sessionType, role, navigate]);
  
  if (isLoading) {
    return <LoadingView message="Checking authentication status..." />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <ExpertLoginHeader />
          
          {/* Show dual session alert if needed */}
          <DualSessionAlert />
          
          <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
            <ExpertLoginTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="p-6">
              <ExpertLoginContent activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExpertLogin;
