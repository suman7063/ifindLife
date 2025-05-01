
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import AdminSettings from './AdminSettings';
import ExpertsEditor from '@/components/admin/experts/ExpertsEditor';
import ExpertApprovals from '@/components/admin/experts/ExpertApprovals';
import ServicesEditor from '@/components/admin/ServicesEditor';
import HeroSectionEditor from '@/components/admin/HeroSectionEditor';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import ProgramsEditor from '@/components/admin/programs/ProgramsEditor';
import { SessionsEditor } from '@/components/admin/sessions';
import ReferralSettingsEditor from '@/components/admin/ReferralSettingsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable';
import AdminUserManagement from '@/components/AdminUserManagement';
import { Expert } from '@/components/admin/experts/types';

interface AdminRoutesProps {
  loading: boolean;
  experts: Expert[];
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
  services: any[];
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  heroSettings: any;
  setHeroSettings: React.Dispatch<React.SetStateAction<any>>;
  testimonials: any[];
  setTestimonials: React.Dispatch<React.SetStateAction<any[]>>;
  error?: string | null;
  onRefresh?: () => void;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ 
  loading,
  experts,
  setExperts,
  services,
  setServices,
  heroSettings,
  setHeroSettings,
  testimonials,
  setTestimonials,
  error,
  onRefresh
}) => {
  return (
    <Routes>
      <Route path="/" element={<AdminOverview onRefresh={onRefresh} />} />
      <Route path="/overview" element={<AdminOverview onRefresh={onRefresh} />} />
      <Route path="/experts" element={
        <ExpertsEditor 
          experts={experts} 
          setExperts={setExperts} 
          loading={loading} 
          error={error}
          onRefresh={onRefresh}
        />
      } />
      <Route path="/expertApprovals" element={<ExpertApprovals />} />
      <Route path="/services" element={
        <ServicesEditor 
          categories={services} 
          setCategories={setServices} 
          loading={loading} 
          error={error}
          onRefresh={onRefresh}
        />
      } />
      <Route path="/herosection" element={
        <HeroSectionEditor 
          heroSettings={heroSettings} 
          setHeroSettings={setHeroSettings} 
          onRefresh={onRefresh}
        />
      } />
      <Route path="/testimonials" element={
        <TestimonialsEditor 
          testimonials={testimonials} 
          setTestimonials={setTestimonials} 
          onRefresh={onRefresh}
        />
      } />
      <Route path="/programs" element={<ProgramsEditor />} />
      <Route path="/sessions" element={<SessionsEditor />} />
      <Route path="/referrals" element={<ReferralSettingsEditor />} />
      <Route path="/blog" element={<BlogEditor />} />
      <Route path="/contact" element={<ContactSubmissionsTable />} />
      <Route path="/adminUsers" element={<AdminUserManagement />} />
      <Route path="/settings" element={<AdminSettings />} />
    </Routes>
  );
};

export default AdminRoutes;
