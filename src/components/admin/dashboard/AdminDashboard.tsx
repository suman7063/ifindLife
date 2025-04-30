
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminDashboardLayout from '../layout/AdminDashboardLayout';
import AdminTabs from '../AdminTabs';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminSettings from './AdminSettings';
import AdminOverview from './AdminOverview';
import { Expert } from '@/components/admin/experts/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { fetchAndConvertExperts } from '../experts/expertConverter';

const AdminDashboard = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // States for all content sections
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState<any>({});
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for tab permissions
  const hasPermission = (tab: string) => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;
    
    const tabPermissionMap: Record<string, keyof typeof currentUser.permissions> = {
      experts: 'experts',
      expertApprovals: 'expertApprovals',
      services: 'services',
      herosection: 'herosection',
      testimonials: 'testimonials',
      programs: 'programs',
      sessions: 'sessions',
      referrals: 'referrals',
      blog: 'blog',
      contact: 'contact',
      adminUsers: 'adminUsers',
      settings: 'settings',
    };
    
    // Always allow overview
    if (tab === 'overview') return true;
    
    // Check if user has permission for this tab
    const permissionKey = tabPermissionMap[tab];
    return permissionKey ? currentUser.permissions[permissionKey] : false;
  };

  useEffect(() => {
    // Check authentication state
    if (!isAuthenticated) {
      console.log('Not authenticated in AdminDashboard, redirecting to admin-login');
      navigate('/admin-login');
      return;
    }
    
    // Reset to overview if no permission for current tab
    if (activeTab !== 'overview' && !hasPermission(activeTab)) {
      toast.error('Access denied', {
        description: `You don't have permission to access ${activeTab}`
      });
      setActiveTab('overview');
    }
    
    // Fetch data for different admin sections based on the active tab
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch experts data when on experts tab or when loading initially
        if (activeTab === 'experts' || activeTab === 'overview') {
          const expertsData = await fetchAndConvertExperts();
          setExperts(expertsData);
        }
        
        // Fetch services when on services tab
        if (activeTab === 'services' || activeTab === 'overview') {
          const { data: servicesData, error: servicesError } = await supabase
            .from('services')
            .select('*');
          
          if (servicesError) {
            console.error('Error fetching services:', servicesError);
          } else {
            setServices(servicesData || []);
          }
        }
        
        // Fetch testimonials when on testimonials tab
        if (activeTab === 'testimonials' || activeTab === 'overview') {
          const { data: testimonialsData, error: testimonialsError } = await supabase
            .from('user_reviews')
            .select('*')
            .eq('verified', true)
            .limit(10);
          
          if (testimonialsError) {
            console.error('Error fetching testimonials:', testimonialsError);
          } else {
            setTestimonials(testimonialsData || []);
          }
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data', {
          description: 'Could not retrieve the required information'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, navigate, activeTab, currentUser]);

  // If not authenticated, return null (we're redirecting)
  if (!isAuthenticated) {
    return null;
  }

  // Handle tab change with permission check
  const handleTabChange = (tab: string) => {
    if (hasPermission(tab)) {
      setActiveTab(tab);
    } else {
      toast.error('Access denied', {
        description: `You don't have permission to access ${tab}`
      });
    }
  };

  // Switch to specific tab based on content section
  const handleTabContent = () => {
    // First check permissions
    if (!hasPermission(activeTab)) {
      return (
        <div className="p-6 bg-background border rounded-md">
          <h3 className="text-xl font-semibold mb-4">Access Restricted</h3>
          <p className="text-muted-foreground">
            You don't have permission to view this section. Please contact a super administrator.
          </p>
        </div>
      );
    }
    
    // Then render appropriate content
    switch (activeTab) {
      case 'adminUsers':
        return <AdminUserManagement />;
      case 'settings':
        return <AdminSettings />;
      case 'overview':
        return <AdminOverview 
          expertCount={experts.length}
          servicesCount={services.length}
          testimonialsCount={testimonials.length}
          isLoading={isLoading}
        />;
      default:
        return (
          <AdminTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            experts={experts}
            setExperts={setExperts}
            services={services}
            setServices={setServices}
            heroSettings={heroSettings}
            setHeroSettings={setHeroSettings}
            testimonials={testimonials}
            setTestimonials={setTestimonials}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <AdminDashboardLayout activeTab={activeTab} setActiveTab={handleTabChange}>
      {handleTabContent()}
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
