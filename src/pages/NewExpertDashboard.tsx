
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ExpertDashboardLayout from '@/components/expert-dashboard/layout/ExpertDashboardLayout';
import DashboardHome from '@/components/expert-dashboard/pages/DashboardHome';
import ProfilePage from '@/components/expert-dashboard/pages/ProfilePage';
import SchedulePage from '@/components/expert-dashboard/pages/SchedulePage';
import ClientsPage from '@/components/expert-dashboard/pages/ClientsPage';
import MessagingPage from '@/components/expert-dashboard/pages/MessagingPage';
import ServicesPage from '@/components/expert-dashboard/pages/ServicesPage';
import EarningsPage from '@/components/expert-dashboard/pages/EarningsPage';
import ReportPage from '@/components/expert-dashboard/pages/ReportPage';
import AnalyticsPage from '@/components/expert-dashboard/pages/analytics/AnalyticsPage';
import ExpertReviewsPage from '@/components/expert-dashboard/pages/ExpertReviewsPage';
import CallManagementPage from '@/components/expert-dashboard/pages/CallManagementPage';
import ExpertOnboardingFlow from '@/components/expert/dashboard/ExpertOnboardingFlow';
// TODO: Re-implement call components
// import CallReceptionWidget from '@/components/expert-dashboard/call/CallReceptionWidget';
// import { useIncomingCalls } from '@/hooks/call/useIncomingCalls';
// import IncomingCallDialog from '@/components/expert-dashboard/call/IncomingCallDialog';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useIntegratedExpertPresence } from '@/hooks/useIntegratedExpertPresence';
import { supabase } from '@/lib/supabase';
import { useGlobalCallNotifications } from '@/hooks/useGlobalCallNotifications';
import { toast } from 'sonner';
import IncomingCallDialog from '@/components/expert-dashboard/call/IncomingCallDialog';
import { acceptCall, declineCall as declineCallService } from '@/services/callService';
import DashboardLoader from '@/components/expert/dashboard/DashboardLoader';
// Import test utility (only in development)
if (import.meta.env.DEV) {
  import('@/utils/testNotification');
}

const NewExpertDashboard: React.FC = () => {
  const { expert, isAuthenticated, isLoading, userType } = useSimpleAuth();
  const navigate = useNavigate();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  
  // Sync expert presence automatically
  const { isExpertOnline } = useIntegratedExpertPresence();
  
  // Global call notifications - works across all dashboard pages
  const { incomingCall, setIncomingCall } = useGlobalCallNotifications(expert?.auth_id || expert?.id);
  
  // Handler functions for incoming call dialog
  const handleAcceptCall = async (callRequestId: string) => {
    const ok = await acceptCall(callRequestId);
    if (ok) {
      setIncomingCall(null);
      // Navigate to calls page with call ID in state so CallManagementPage can load it
      navigate('/expert-dashboard/calls', { 
        state: { acceptedCallId: callRequestId } 
      });
    }
  };

  const handleDeclineCall = async (callRequestId: string) => {
    const ok = await declineCallService(callRequestId);
    if (ok) {
      setIncomingCall(null);
    }
  };
  
  // Check onboarding completion status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isAuthenticated || !expert) {
        setNeedsOnboarding(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('expert_accounts')
          .select('onboarding_completed, status, selected_services, pricing_set, availability_set, profile_completed')
          .eq('auth_id', expert.auth_id)
          .single();

        if (error) {
          console.error('Error fetching expert account:', error);
          setNeedsOnboarding(false);
          return;
        }

        // Check if core onboarding steps are completed
        const hasServices = data.selected_services && data.selected_services.length > 0;
        const hasPricing = data.pricing_set;
        const hasAvailability = data.availability_set;
        // Onboarding is needed if any core step is incomplete
        const needsOnboardingFlow = !hasServices || !hasPricing || !hasAvailability || !data.onboarding_completed;
        setNeedsOnboarding(needsOnboardingFlow);

      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setNeedsOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, expert]);

  // Enhanced debug logging
  useEffect(() => {

    
    // Ensure userType is set to expert when accessing this page
    if (isAuthenticated && expert) {
      localStorage.setItem('preferredRole', 'expert');
      localStorage.setItem('sessionType', 'expert');
    }
  }, [isAuthenticated, expert, isLoading, userType, needsOnboarding]);
  
  // Display loading state - wait for auth to initialize AND profiles to load
  // On refresh, isLoading becomes false before userType/expert are set, so we need to wait
  if (isLoading || needsOnboarding === null) {
    return <DashboardLoader />;
  }
  
  // Wait for expert profile to load on refresh - if authenticated but expert not loaded yet, show loader
  // This prevents redirecting to login when userType hasn't been determined yet
  // userType === 'none' means profiles are still loading
  if (isAuthenticated && userType === 'none') {
    // Still loading profiles - wait for userType to be determined
    return <DashboardLoader />;
  }
  
  // If expert is authenticated and needs onboarding, show onboarding flow first
  if (isAuthenticated && userType === 'expert' && expert && needsOnboarding) {
    return <ExpertOnboardingFlow />;
  }

  // Handle unauthorized access - only redirect if we're CERTAIN user is NOT an expert
  // Don't redirect if userType is still 'none' (still loading) or if expert object exists
  const isDefinitelyNotExpert = !isAuthenticated || (userType !== 'expert' && userType !== 'none' && !expert);
  
  if (isDefinitelyNotExpert) {
    // Only show error if we're certain they're not an expert (not during loading)
    if (userType !== 'none') {
      console.error('User not authenticated as expert, redirecting to expert login', {
        isAuthenticated,
        userType,
        hasExpertProfile: !!expert
      });
      toast.error('You must be logged in as an expert to access this page');
    }
    return <Navigate to="/expert-login" replace />;
  }

  // If we are authenticated as expert but expert object not yet loaded, show a lightweight loader
  if (isAuthenticated && userType === 'expert' && !expert) {
    return <DashboardLoader />;
  }

  return (
    <ExpertDashboardLayout>
      {/* Global Incoming Call Dialog - shows popup when call request arrives */}
      <IncomingCallDialog
        callRequest={incomingCall}
        isOpen={!!incomingCall}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
        onClose={() => setIncomingCall(null)}
      />
      
      <Routes>
        {/* Dashboard Home */}
        <Route index element={<DashboardHome />} />
        
        {/* Analytics Dashboard */}
        <Route path="analytics" element={<AnalyticsPage />} />
        
        {/* Profile Management */}
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Schedule Management */}
        <Route path="schedule" element={<SchedulePage />} />
        
        {/* Call Management */}
        <Route path="calls" element={<CallManagementPage />} />
        
        {/* Client Management */}
        <Route path="clients" element={<ClientsPage />} />
        
        {/* Messaging - Using enhanced MessagingPage */}
        <Route path="messages" element={<MessagingPage />} />
        
        {/* Services Management */}
        <Route path="services" element={<ServicesPage />} />
        
        {/* Earnings */}
        <Route path="earnings" element={<EarningsPage />} />
        
        {/* User Reports */}
        <Route path="reports" element={<ReportPage />} />
        
        {/* Reviews & Ratings */}
        <Route path="reviews" element={<ExpertReviewsPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/expert-dashboard" replace />} />
      </Routes>
    </ExpertDashboardLayout>
  );
};

export default NewExpertDashboard;
