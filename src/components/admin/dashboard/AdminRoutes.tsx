
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
  setTestimonials
}) => {
  if (loading) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminOverview />} />
      <Route path="/overview" element={<AdminOverview />} />
      <Route path="/experts" element={<ExpertsEditor experts={experts} setExperts={setExperts} />} />
      <Route path="/expertApprovals" element={<ExpertApprovals />} />
      <Route path="/services" element={<ServicesEditor categories={services} setCategories={setServices} />} />
      <Route path="/herosection" element={<HeroSectionEditor heroSettings={heroSettings} setHeroSettings={setHeroSettings} />} />
      <Route path="/testimonials" element={<TestimonialsEditor testimonials={testimonials} setTestimonials={setTestimonials} />} />
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
