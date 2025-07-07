import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSecureAdminAuth } from '@/contexts/admin-auth/SecureAdminAuthProvider';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Settings, 
  BarChart3, 
  MessageCircle,
  Star,
  Calendar,
  Book,
  Gift,
  Phone,
  HelpCircle
} from 'lucide-react';
import LoadingView from '@/components/LoadingView';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

const SecureAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, isLoading } = useSecureAdminAuth();
  
  // Get current tab from URL
  const pathSegments = location.pathname.split('/');
  const currentTab = pathSegments[2] || 'overview';
  
  const [activeTab, setActiveTab] = useState<string>(currentTab);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('SecureAdminDashboard: Not authenticated, redirecting to login');
      navigate('/admin-login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingView message="Authenticating administrator..." />;
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated || !currentUser) {
    return null;
  }

  // Render appropriate content based on active tab
  const renderTabContent = () => {
    const dashboardCards = [
      {
        title: 'User Management',
        description: 'Manage user accounts, profiles, and permissions',
        icon: Users,
        color: 'bg-blue-500',
        count: '--',
        isActive: true
      },
      {
        title: 'Expert Approvals',
        description: 'Review and approve expert applications',
        icon: UserCheck,
        color: 'bg-green-500',
        count: '--',
        isActive: true
      },
      {
        title: 'Content Management',
        description: 'Manage testimonials, blog posts, and content',
        icon: FileText,
        color: 'bg-purple-500',
        count: '--',
        isActive: true
      },
      {
        title: 'Analytics',
        description: 'View platform analytics and performance reports',
        icon: BarChart3,
        color: 'bg-orange-500',
        count: '--',
        isActive: true
      },
      {
        title: 'Services',
        description: 'Configure platform services and pricing',
        icon: Star,
        color: 'bg-yellow-500',
        count: '--',
        isActive: true
      },
      {
        title: 'Programs',
        description: 'Manage wellness programs and courses',
        icon: Calendar,
        color: 'bg-indigo-500',
        count: '--',
        isActive: true
      },
      {
        title: 'Blog Management',
        description: 'Create and manage blog posts',
        icon: Book,
        color: 'bg-teal-500',
        count: '--',
        isActive: true
      },
      {
        title: 'Referral System',
        description: 'Configure referral rewards and settings',
        icon: Gift,
        color: 'bg-pink-500',
        count: '--',
        isActive: true
      },
      {
        title: 'Contact Submissions',
        description: 'Review contact form submissions',
        icon: MessageCircle,
        color: 'bg-cyan-500',
        count: '--',
        isActive: true
      },
      {
        title: 'Help Tickets',
        description: 'Manage user support requests',
        icon: HelpCircle,
        color: 'bg-red-500',
        count: '--',
        isActive: true
      },
      {
        title: 'System Settings',
        description: 'Configure platform-wide settings',
        icon: Settings,
        color: 'bg-gray-500',
        count: '--',
        isActive: true
      }
    ];

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Admin Dashboard Overview</h3>
              <p className="text-gray-600 mb-6">
                Welcome to the iFindLife secure administration panel. 
                Use the sidebar to navigate to different management sections.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${card.color}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <div className="text-2xl font-bold">{card.count}</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{card.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Database: Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Authentication: Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Admin Panel: Secure</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="space-y-2">
                <p>Section "{activeTab}" is being developed and will be available soon.</p>
                <p>All sidebar links are functional and will navigate you to their respective sections.</p>
              </div>
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Security Banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-medium">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>SECURE ADMINISTRATOR DASHBOARD • ALL ACTIONS LOGGED</span>
        </div>
      </div>
      
      <AdminDashboardLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {/* Admin User Info Banner */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <span>
                Logged in as: <strong>{currentUser.username}</strong> | 
                Role: <strong>{currentUser.role}</strong> | 
                Session: Active
              </span>
              <span className="text-xs">
                Last Login: {new Date(currentUser.lastLogin).toLocaleString()}
              </span>
            </div>
          </AlertDescription>
        </Alert>
        
        {/* Tab Content */}
        {renderTabContent()}
      </AdminDashboardLayout>
    </div>
  );
};

export default SecureAdminDashboard;