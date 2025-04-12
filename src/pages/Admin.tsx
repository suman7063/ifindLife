
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import { Container } from '@/components/ui/container';
import { toast } from 'sonner';
import { Expert } from '@/components/admin/experts/types';

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Added state for all required props for AdminTabs
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState<any>({});
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
    
    // Here you would normally fetch data for these different admin sections
    // This is a placeholder for demonstration
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/admin-login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Container className="flex-1 py-8">
        <AdminHeader onLogout={handleLogout} />
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
      </Container>
      <Footer />
    </div>
  );
};

export default Admin;
