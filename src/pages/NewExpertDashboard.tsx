
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
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useIntegratedExpertPresence } from '@/hooks/useIntegratedExpertPresence';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import LoadingFallback from '@/components/common/LoadingFallback';

const NewExpertDashboard: React.FC = () => {
  const { expert, isAuthenticated, isLoading, userType } = useSimpleAuth();
  const navigate = useNavigate();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  
  // Sync expert presence automatically
  const { isExpertOnline } = useIntegratedExpertPresence();
  
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
          .eq('auth_id', expert.id)
          .single();

        if (error) {
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
        setNeedsOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, expert]);

  // Set user role when authenticated
  useEffect(() => {
    if (isAuthenticated && expert) {
      localStorage.setItem('preferredRole', 'expert');
      localStorage.setItem('sessionType', 'expert');
    }
  }, [isAuthenticated, expert]);
  
  // Display loading state
  if (isLoading || needsOnboarding === null) {
    return <LoadingFallback message="Loading expert dashboard..." />;
  }
  
  // Handle unauthorized access
  if (!isAuthenticated || userType !== 'expert' || !expert) {
    
    // Show toast and redirect
    toast.error('You must be logged in as an expert to access this page');
    return <Navigate to="/expert-login" replace />;
  }

  // If onboarding is needed, show onboarding flow
  if (needsOnboarding) {
    return <ExpertOnboardingFlow />;
  }

  return (
    <ExpertDashboardLayout>
      {/* Call Reception Widget - Always available */}
      <CallReceptionWidget />
      
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
