
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { supabase } from '@/lib/supabase';
import ExpertDashboardLayout from '@/components/expert-dashboard/layout/ExpertDashboardLayout';
import DashboardHome from '@/components/expert-dashboard/pages/DashboardHome';
import ProfilePage from '@/components/expert-dashboard/pages/ProfilePage';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { toast } from 'sonner';

const ExpertDashboard: React.FC = () => {
  const { isAuthenticated, sessionType, user, expertProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<'dashboard' | 'profile' | 'appointments' | 'earnings' | 'settings'>('dashboard');
  const [profileLoading, setProfileLoading] = useState(true);
  const [dashboardExpertProfile, setDashboardExpertProfile] = useState<any>(null);

  console.log('ExpertDashboard: Current auth state:', {
    isAuthenticated: Boolean(isAuthenticated),
    sessionType,
    hasUser: Boolean(user),
    hasExpertProfile: Boolean(expertProfile),
    isLoading: Boolean(isLoading),
    expertStatus: expertProfile?.status
  });

  // ✅ EXPERT DASHBOARD AUTH CHECK
  useEffect(() => {
    const checkExpertAuth = async () => {
      console.log('🔒 ExpertDashboard auth check:', {
        isAuthenticated,
        hasUser: !!user,
        sessionType,
        isLoading
      });
      
      if (isLoading) {
        console.log('🔒 Auth still loading, waiting...');
        return;
      }
      
      if (!isAuthenticated || !user) {
        console.log('❌ Not authenticated, redirecting to expert login');
        toast.error('You must be logged in as an expert to access this page');
        navigate('/expert-login', { replace: true });
        return;
      }
      
      if (sessionType !== 'expert') {
        console.log('❌ Not an expert session, redirecting to expert login');
        toast.error('You must be logged in as an expert to access this page');
        navigate('/expert-login', { replace: true });
        return;
      }
      
      // Load expert profile if not already loaded
      try {
        if (expertProfile) {
          console.log('✅ Expert profile already loaded:', expertProfile.name);
          setDashboardExpertProfile(expertProfile);
          setProfileLoading(false);
          return;
        }

        console.log('🔒 Loading expert profile for user:', user.id);
        
        const { data: profile, error } = await supabase
          .from('expert_accounts')
          .select('*')
          .eq('auth_id', user.id)
          .eq('status', 'approved')
          .maybeSingle();
        
        if (error || !profile) {
          console.error('❌ Expert profile not found:', error);
          toast.error('Expert profile not found or not approved');
          navigate('/expert-login', { replace: true });
          return;
        }
        
        console.log('✅ Expert profile loaded:', profile.name);
        setDashboardExpertProfile(profile);

        // Check expert status
        if (profile.status === 'pending') {
          toast.info('Your expert account is pending approval');
        } else if (profile.status === 'rejected') {
          toast.error('Your expert account has been rejected. Please contact support.');
        }
      } catch (error) {
        console.error('❌ Expert profile loading failed:', error);
        toast.error('Failed to load expert profile');
        navigate('/expert-login', { replace: true });
      } finally {
        setProfileLoading(false);
      }
    };
    
    checkExpertAuth();
  }, [isAuthenticated, user, sessionType, isLoading, expertProfile, navigate]);

  if (isLoading || profileLoading) {
    return <LoadingScreen message="Loading expert dashboard..." />;
  }

  // If not authenticated as expert, don't render anything (redirect will happen)
  if (!isAuthenticated || sessionType !== 'expert' || !user) {
    return <LoadingScreen message="Redirecting to login..." />;
  }

  if (!dashboardExpertProfile) {
    return <LoadingScreen message="Loading expert profile..." />;
  }

  const renderContent = () => {
    switch (view) {
      case 'profile':
        return <ProfilePage />;
      case 'dashboard':
      default:
        return (
          <div className="expert-dashboard">
            <h1 className="text-3xl font-bold mb-4">Welcome, {dashboardExpertProfile.name}!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Specialties: {dashboardExpertProfile.specialties ? dashboardExpertProfile.specialties.join(', ') : 'None specified'}
            </p>
            <DashboardHome />
          </div>
        );
    }
  };

  return (
    <ExpertDashboardLayout>
      {renderContent()}
    </ExpertDashboardLayout>
  );
};

export default ExpertDashboard;
