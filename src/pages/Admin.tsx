
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import expertData from '@/data/expertData';
import { convertToExpertFormat } from '@/utils/expertDataUtils';
import { initialServices, initialHeroSettings, initialTestimonials } from '@/data/initialAdminData';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import { Expert } from '@/components/admin/experts/types';

const Admin = () => {
  // State management for each section
  const [experts, setExperts] = useState<Expert[]>(() => convertToExpertFormat(expertData));
  const [services, setServices] = useState(initialServices);
  const [heroSettings, setHeroSettings] = useState(initialHeroSettings);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [activeTab, setActiveTab] = useState("experts");
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };
  
  // Set up session timeout
  useSessionTimeout(10 * 60 * 1000, handleLogout);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader handleLogout={handleLogout} />
      
      <main className="flex-1 py-8 container mx-auto px-4">
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
      </main>
    </div>
  );
};

export default Admin;
