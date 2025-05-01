
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminDashboardLayout from '../layout/AdminDashboardLayout';
import AdminTabs from '../AdminTabs';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminSettings from './AdminSettings';
import AdminOverview from './AdminOverview';
import { Expert } from '@/components/admin/experts/types';

const AdminDashboard = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // States for all content sections
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState<any>({});
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    // Check authentication state
    if (!isAuthenticated) {
      console.log('Not authenticated in AdminDashboard, redirecting to admin-login');
      navigate('/admin-login');
    }
    
    // Here you would normally fetch data for different admin sections
    // This is a placeholder - we'll implement actual data fetching in each component
  }, [isAuthenticated, navigate]);

  // If not authenticated, return null (we're redirecting)
  if (!isAuthenticated) {
    return null;
  }

  // Switch to specific tab based on content section
  const handleTabContent = () => {
    switch (activeTab) {
      case 'adminUsers':
        return <AdminUserManagement />;
      case 'settings':
        return <AdminSettings />;
      case 'overview':
        return <AdminOverview />;
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
          />
        );
    }
  };

  return (
    <AdminDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {handleTabContent()}
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
