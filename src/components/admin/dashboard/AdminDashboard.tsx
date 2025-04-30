
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardLayout from '../layout/AdminDashboardLayout';
import AdminTabs from '../AdminTabs';
import AdminOverview from './AdminOverview';
import AdminSettings from './AdminSettings';
import { useAuth } from '@/contexts/admin-auth';
import { Expert } from '@/components/admin/experts/types';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };
  
  useEffect(() => {
    console.log('Current active tab:', activeTab);
  }, [activeTab]);

  return (
    <AdminDashboardLayout 
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === 'overview' ? (
        <AdminOverview />
      ) : activeTab === 'settings' ? (
        <AdminSettings />
      ) : activeTab === 'adminUsers' ? (
        <div>
          <h2 className="text-3xl font-bold mb-6">Admin Users</h2>
          <p className="text-muted-foreground">Admin user management will be available soon.</p>
        </div>
      ) : (
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
      )}
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
