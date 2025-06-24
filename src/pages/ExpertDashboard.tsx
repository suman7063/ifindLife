
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { toast } from 'sonner';

const ExpertDashboard: React.FC = () => {
  const { isAuthenticated, sessionType, user, expertProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('dashboard');
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

  // Navigation handler for left panel links
  const handleNavigation = (section: string) => {
    console.log('🔗 Expert dashboard navigation:', section);
    setActiveSection(section);
  };

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'calendar', label: 'Calendar', icon: '🗓️' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'availability', label: 'Availability', icon: '⏰' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleLogout = async () => {
    try {
      console.log('🔒 Expert logout initiated');
      localStorage.removeItem('sessionType');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Logout failed');
      } else {
        toast.success('Logged out successfully');
        navigate('/expert-login', { replace: true });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  // Render content based on active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ExpertDashboardHome expertProfile={dashboardExpertProfile} />;
      case 'appointments':
        return <ExpertAppointments />;
      case 'calendar':
        return <ExpertCalendar />;
      case 'clients':
        return <ExpertClients />;
      case 'earnings':
        return <ExpertEarnings />;
      case 'messages':
        return <ExpertMessages />;
      case 'availability':
        return <ExpertAvailability />;
      case 'profile':
        return <ExpertProfile expertProfile={dashboardExpertProfile} />;
      case 'settings':
        return <ExpertSettings />;
      default:
        return <ExpertDashboardHome expertProfile={dashboardExpertProfile} />;
    }
  };

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg relative">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Expert Panel</h2>
          {dashboardExpertProfile && (
            <p className="text-sm text-gray-600">{dashboardExpertProfile.name}</p>
          )}
        </div>
        
        <nav className="mt-6">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                activeSection === item.id 
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                  : 'text-gray-700'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

// Dashboard section components
const ExpertDashboardHome = ({ expertProfile }: { expertProfile: any }) => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
    {expertProfile && (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Welcome, {expertProfile.name}!</h2>
        <p className="text-gray-600">Specialties: {expertProfile.specialties?.join(', ') || 'None specified'}</p>
        <p className="text-gray-600">Experience: {expertProfile.experience || 'Not specified'}</p>
        <p className="text-gray-600">Status: <span className="capitalize font-medium">{expertProfile.status}</span></p>
      </div>
    )}
  </div>
);

const ExpertAppointments = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Appointments</h1>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>Your upcoming appointments will appear here.</p>
    </div>
  </div>
);

const ExpertCalendar = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Calendar</h1>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>Calendar view of your schedule.</p>
    </div>
  </div>
);

const ExpertClients = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Clients</h1>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>Your client list will appear here.</p>
    </div>
  </div>
);

const ExpertEarnings = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Earnings</h1>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>Your earnings and financial overview.</p>
    </div>
  </div>
);

const ExpertMessages = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Messages</h1>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>Client messages and communication.</p>
    </div>
  </div>
);

const ExpertAvailability = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Availability</h1>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>Manage your availability and schedule.</p>
    </div>
  </div>
);

const ExpertProfile = ({ expertProfile }: { expertProfile: any }) => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
    <div className="bg-white p-6 rounded-lg shadow">
      {expertProfile ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{expertProfile.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{expertProfile.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{expertProfile.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Specialization</p>
              <p className="font-medium">{expertProfile.specialization || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Experience</p>
              <p className="font-medium">{expertProfile.experience || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium capitalize">{expertProfile.status}</p>
            </div>
          </div>
          {expertProfile.bio && (
            <div>
              <p className="text-sm text-gray-600">Bio</p>
              <p className="font-medium">{expertProfile.bio}</p>
            </div>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  </div>
);

const ExpertSettings = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Settings</h1>
    <div className="bg-white p-6 rounded-lg shadow">
      <p>Account and application settings.</p>
    </div>
  </div>
);

export default ExpertDashboard;
