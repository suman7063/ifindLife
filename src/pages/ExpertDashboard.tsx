
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/expert/dashboard/DashboardLayout';
import DashboardLoader from '@/components/expert/dashboard/DashboardLoader';
import UnauthorizedView from '@/components/expert/dashboard/UnauthorizedView';
import AppointmentsTab from '@/components/expert/dashboard/AppointmentsTab';
import EarningsTab from '@/components/expert/dashboard/EarningsTab';
import SettingsTab from '@/components/expert/dashboard/SettingsTab';
import ExpertProfileEdit from '@/components/expert/ExpertProfileEdit';
import UserReports from '@/components/expert/UserReports';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const { isLoading, expertProfile, userProfile, isAuthenticated, role } = useAuth();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  
  // Debug logging
  useEffect(() => {
    console.log('ExpertDashboard - Auth states:', {
      authLoading: isLoading,
      hasExpertAuthProfile: !!expertProfile,
      hasUserProfile: !!userProfile,
      isAuthenticated,
      role,
      redirectAttempted
    });
  }, [expertProfile, userProfile, isLoading, isAuthenticated, role, redirectAttempted]);
  
  // If not authenticated at all, redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !redirectAttempted) {
      console.log('Not authenticated, redirecting to expert login');
      setRedirectAttempted(true);
      toast.error('Please log in to access the expert dashboard');
      navigate('/expert-login');
      return;
    }
    
    // If authenticated but not as expert, redirect to appropriate dashboard
    if (!isLoading && isAuthenticated && role !== 'expert' && !redirectAttempted) {
      console.log('Authenticated but not as expert, redirecting');
      setRedirectAttempted(true);
      toast.error('You do not have expert privileges');
      if (role === 'user') {
        navigate('/user-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [expertProfile, userProfile, isLoading, isAuthenticated, redirectAttempted, navigate, role]);
  
  // Check if expert profile exists for current user, if not, create a temporary one for demo
  const ensureExpertProfile = async () => {
    try {
      // Get current session to get user ID
      const { data: session } = await supabase.auth.getSession();
      if (!session.session || !session.session.user) {
        return;
      }
      
      const userId = session.session.user.id;
      
      // Check if user already has an expert profile
      const { data: existingProfile, error } = await supabase
        .from('expert_accounts')
        .select('id')
        .eq('auth_id', userId)
        .maybeSingle();
      
      if (error || !existingProfile) {
        console.log("No expert profile found, creating temporary one");
        
        // Create temporary expert profile
        await supabase
          .from('expert_accounts')
          .insert([
            { 
              auth_id: userId,
              name: 'Demo Expert',
              email: session.session.user.email,
              status: 'approved',
              specialties: ['Psychology', 'Therapy'],
              experience: '5 years' 
            }
          ]);
          
        // Reload the page to get updated profile
        window.location.reload();
      }
    } catch (error) {
      console.error('Error ensuring expert profile:', error);
    }
  };
  
  // Run once to ensure expert profile exists
  useEffect(() => {
    if (isAuthenticated && !expertProfile && !isLoading) {
      ensureExpertProfile();
    }
  }, [expertProfile, isAuthenticated, isLoading]);
  
  if (isLoading) {
    return <DashboardLoader />;
  }

  if (!expertProfile) {
    return <UnauthorizedView />;
  }

  return (
    <DashboardLayout>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8 md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="reports">User Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ExpertProfileEdit />
        </TabsContent>
        
        <TabsContent value="appointments">
          <AppointmentsTab />
        </TabsContent>
        
        <TabsContent value="earnings">
          <EarningsTab />
        </TabsContent>
        
        <TabsContent value="reports">
          <UserReports users={users} />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ExpertDashboard;
