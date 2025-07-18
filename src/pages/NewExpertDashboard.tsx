
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ExpertDashboardLayout from '@/components/expert-dashboard/layout/ExpertDashboardLayout';
import DashboardHome from '@/components/expert-dashboard/pages/DashboardHome';
import ProfilePage from '@/components/expert-dashboard/pages/ProfilePage';
import SchedulePage from '@/components/expert-dashboard/pages/SchedulePage';
import ClientsPage from '@/components/expert-dashboard/pages/ClientsPage';
import MessagingTab from '@/components/expert/dashboard/MessagingTab';
import ServicesPage from '@/components/expert-dashboard/pages/ServicesPage';
import EarningsPage from '@/components/expert-dashboard/pages/EarningsPage';
import ReportPage from '@/components/expert-dashboard/pages/ReportPage';
import ExpertOnboardingFlow from '@/components/expert/dashboard/ExpertOnboardingFlow';
import CallReceptionWidget from '@/components/expert-dashboard/call/CallReceptionWidget';
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
  
  // Check onboarding completion status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isAuthenticated || !expert) return;

      try {
        const { data, error } = await supabase
          .from('expert_accounts')
          .select('onboarding_completed, status')
          .eq('auth_id', expert.id)
          .single();

        if (error) throw error;

        // Check if expert is approved and onboarding is needed
        const needsOnboardingFlow = data.status === 'approved' && !data.onboarding_completed;
        setNeedsOnboarding(needsOnboardingFlow);

        console.log('Onboarding check:', {
          status: data.status,
          onboardingCompleted: data.onboarding_completed,
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
  
  // Handle unauthorized access
  if (!isAuthenticated || userType !== 'expert' || !expert) {
    console.error('User not authenticated as expert, redirecting to expert login', {
      isAuthenticated,
      userType,
      hasExpertProfile: !!expert
    });
    
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
        
        {/* Profile Management */}
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Schedule Management */}
        <Route path="schedule" element={<SchedulePage />} />
        
        {/* Client Management */}
        <Route path="clients" element={<ClientsPage />} />
        
        {/* Messaging */}
        <Route path="messages" element={<MessagingTab />} />
        
        {/* Services Management */}
        <Route path="services" element={<ServicesPage />} />
        
        {/* Earnings */}
        <Route path="earnings" element={<EarningsPage />} />
        
        {/* User Reports */}
        <Route path="reports" element={<ReportPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/expert-dashboard" replace />} />
      </Routes>
    </ExpertDashboardLayout>
  );
};

export default NewExpertDashboard;
