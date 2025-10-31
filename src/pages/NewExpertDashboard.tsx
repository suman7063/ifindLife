
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
import CallReceptionWidget from '@/components/expert-dashboard/call/CallReceptionWidget';
import { useIncomingCalls } from '@/hooks/call/useIncomingCalls';
import IncomingCallDialog from '@/components/expert-dashboard/call/IncomingCallDialog';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useIntegratedExpertPresence } from '@/hooks/useIntegratedExpertPresence';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const NewExpertDashboard: React.FC = () => {
  const { expert, isAuthenticated, isLoading, userType } = useSimpleAuth();
  const navigate = useNavigate();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  
  // Sync expert presence automatically
  const { isExpertOnline } = useIntegratedExpertPresence();
  
  // Realtime incoming call notifications for experts - MUST be called before any early returns
  const { incoming, setIncoming, acceptCall, declineCall } = useIncomingCalls(expert?.auth_id);
  
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
        console.log('hasServices', hasServices ,hasPricing ,hasAvailability,data.onboarding_completed);
        // Onboarding is needed if any core step is incomplete
        const needsOnboardingFlow = !hasServices || !hasPricing || !hasAvailability || !data.onboarding_completed;
        setNeedsOnboarding(needsOnboardingFlow);

        console.log('Onboarding check:', {
          status: data.status,
          onboardingCompleted: data.onboarding_completed,
          hasServices,
          hasPricing,
          hasAvailability,
          needsOnboarding: needsOnboardingFlow
        });
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setNeedsOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, expert]);

  // Enhanced debug logging
  useEffect(() => {
    console.log('NewExpertDashboard - Auth state:', {
      isAuthenticated,
      hasExpertProfile: !!expert,
      isLoading,
      userType,
      needsOnboarding
    });
    
    // Ensure userType is set to expert when accessing this page
    if (isAuthenticated && expert) {
      console.log('Setting preferred role to expert');
      localStorage.setItem('preferredRole', 'expert');
      localStorage.setItem('sessionType', 'expert');
    }
  }, [isAuthenticated, expert, isLoading, userType, needsOnboarding]);
  
  // Display loading state
  if (isLoading || needsOnboarding === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  console.log('isAuthenticated', isAuthenticated,userType,expert,needsOnboarding);
  console.log('userType', isAuthenticated && userType === 'expert' && expert && needsOnboarding);
  console.log('expert', expert);
  console.log('needsOnboarding', needsOnboarding);
  // If expert is authenticated and needs onboarding, show onboarding flow first
  if (isAuthenticated && userType === 'expert' && expert && needsOnboarding) {
    return <ExpertOnboardingFlow />;
  }

  // Handle unauthorized access (do NOT block onboarding path above)
  if (!isAuthenticated || userType !== 'expert') {
    console.error('User not authenticated as expert, redirecting to expert login', {
      isAuthenticated,
      userType,
      hasExpertProfile: !!expert
    });
    toast.error('You must be logged in as an expert to access this page');
    return <Navigate to="/expert-login" replace />;
  }

  // If we are authenticated as expert but expert object not yet loaded, show a lightweight loader
  if (!expert) {
    return <div className="flex items-center justify-center min-h-screen">Preparing your dashboard...</div>;
  }

  const handleAccept = async (req: any) => {
    const ok = await acceptCall(req);
    if (ok) {
      // On accept, navigate to Calls page or open your call modal if desired
      setIncoming(null);
      navigate('/expert-dashboard/calls');
    }
  };

  const handleDecline = async (req: any) => {
    const ok = await declineCall(req);
    if (ok) setIncoming(null);
  };

  return (
    <ExpertDashboardLayout>
      {/* Call Reception Widget - Always available */}
      <CallReceptionWidget />
      {/* Incoming Call Dialog */}
      <IncomingCallDialog request={incoming} onAccept={handleAccept} onDecline={handleDecline} />
      
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
