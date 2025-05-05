
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from './sections/DashboardOverview';
import AdminUsersManager from '../users/AdminUsersManager';
import ServicesEditor from '../ServicesEditor';
import ExpertsEditor from '../experts';
import ExpertApprovals from '../experts/ExpertApprovals';
import HeroSectionEditor from '../HeroSectionEditor';
import TestimonialsEditor from '../testimonials/TestimonialsEditor';
import ContactSubmissionsTable from '../ContactSubmissionsTable';
import { SessionsEditor } from '../sessions';
import ProgramsEditor from '../programs/ProgramsEditor';
import ReferralSettingsEditor from '../ReferralSettingsEditor';
import BlogEditor from '../BlogEditor';
import SettingsEditor from '../SettingsEditor';
import HelpTicketsManager from '../help/HelpTicketsManager';
import { Expert } from '../experts/types';
import { ServiceCategory } from '../hooks/useServicesData';
import { HeroSettings } from '../hooks/useHeroSettings';
import { Testimonial } from '../hooks/testimonials/types';

interface AdminRoutesProps {
  isSuperAdmin: boolean;
  loading?: boolean;
  experts?: Expert[];
  setExperts?: React.Dispatch<React.SetStateAction<Expert[]>>;
  services?: ServiceCategory[];
  setServices?: React.Dispatch<React.SetStateAction<ServiceCategory[]>>;
  heroSettings?: HeroSettings;
  setHeroSettings?: React.Dispatch<React.SetStateAction<HeroSettings>>;
  testimonials?: Testimonial[];
  setTestimonials?: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  error?: string | null;
  onRefresh?: () => void;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ 
  isSuperAdmin,
  loading,
  experts = [],
  setExperts = () => {},
  services = [],
  setServices = () => {},
  heroSettings = {} as HeroSettings,
  setHeroSettings = () => {},
  testimonials = [],
  setTestimonials = () => {},
  error = null,
  onRefresh = () => {}
}) => {
  return (
    <Routes>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="overview" element={<DashboardOverview />} />
      <Route path="experts" element={
        <ExpertsEditor 
          experts={experts} 
          setExperts={setExperts} 
          loading={loading} 
          error={error} 
          onRefresh={onRefresh}
        />
      } />
      <Route path="expertApprovals" element={<ExpertApprovals />} />
      <Route path="services" element={<ServicesEditor />} />
      <Route path="herosection" element={<HeroSectionEditor />} />
      <Route path="testimonials" element={
        <TestimonialsEditor 
          testimonials={testimonials} 
          setTestimonials={setTestimonials}
        />
      } />
      <Route path="programs" element={<ProgramsEditor />} />
      <Route path="sessions" element={<SessionsEditor />} />
      <Route path="blog" element={<BlogEditor />} />
      <Route path="referrals" element={<ReferralSettingsEditor />} />
      <Route path="contact" element={<ContactSubmissionsTable />} />
      <Route path="help" element={<HelpTicketsManager />} />
      <Route path="settings" element={<SettingsEditor />} />
      
      {/* Super Admin Only Routes */}
      {isSuperAdmin ? (
        <Route path="adminUsers" element={<AdminUsersManager />} />
      ) : null}
      
      {/* Fallback route for any unmatched paths */}
      <Route path="*" element={<Navigate to="overview" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
