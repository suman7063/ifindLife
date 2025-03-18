import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServicesEditor from '@/components/admin/ServicesEditor';
import HeroSectionEditor from '@/components/admin/HeroSectionEditor';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import TherapistsEditor from '@/components/admin/TherapistsEditor';
import AdminUserManagement from '@/components/AdminUserManagement';
import ReviewManagement from '@/components/admin/ReviewManagement';
import ReferralSettingsEditor from '@/components/admin/ReferralSettingsEditor';
import AdminModerationTab from '@/components/admin/moderation/AdminModerationTab';
import ExpertsEditor from '@/components/admin/ExpertsEditor';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Navigate } from 'react-router-dom';
import { Expert } from '@/types/supabase/index';

const Admin: React.FC = () => {
  const { currentUser } = useUserAuth();
  const [activeTab, setActiveTab] = useState('users');
  
  // Mock data for all pages in a single place
  const [therapists, setTherapists] = useState<Omit<Expert, 'email'>[]>([
    {
      id: '1',
      name: 'Dr. Jane Smith',
      experience: 5,
      specialties: ['Anxiety', 'Depression'],
      rating: 4.8,
      consultations: 150,
      price: 75,
      waitTime: '1-2 days',
      imageUrl: '/placeholder.svg',
      online: true
    },
    // ... other therapists
  ]);
  
  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="experts">Experts</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <AdminUserManagement />
        </TabsContent>
        
        <TabsContent value="experts" className="space-y-4">
          <ExpertsEditor />
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <ServicesEditor />
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <ReviewManagement />
        </TabsContent>
        
        <TabsContent value="moderation" className="space-y-4">
          <AdminModerationTab />
        </TabsContent>
        
        <TabsContent value="referrals" className="space-y-4">
          <ReferralSettingsEditor />
        </TabsContent>
        
        <TabsContent value="hero" className="space-y-4">
          <HeroSectionEditor />
        </TabsContent>
        
        <TabsContent value="testimonials" className="space-y-4">
          <TestimonialsEditor therapists={therapists} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
