
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

interface AdminRoutesProps {
  isSuperAdmin: boolean;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ isSuperAdmin }) => {
  return (
    <Routes>
      <Route index element={<Navigate to="overview" replace />} />
      <Route path="overview" element={<DashboardOverview />} />
      <Route path="experts" element={<ExpertsEditor />} />
      <Route path="expertApprovals" element={<ExpertApprovals />} />
      <Route path="services" element={<ServicesEditor />} />
      <Route path="herosection" element={<HeroSectionEditor />} />
      <Route path="testimonials" element={<TestimonialsEditor />} />
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
