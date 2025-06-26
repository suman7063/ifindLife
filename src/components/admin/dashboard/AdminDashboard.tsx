
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardLayout from '../layout/AdminDashboardLayout';
import AdminTabs from '../AdminTabs';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminSettings from './AdminSettings';
import AdminOverview from './AdminOverview';
import { Expert } from '@/components/admin/experts/types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // States for all content sections
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    // Simple auth check - admin authentication should be handled at the route level
    // This component now focuses on rendering the dashboard content
    console.log('AdminDashboard: Component loaded');
  }, []);

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
