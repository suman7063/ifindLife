
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import ExpertsEditor from '@/components/admin/experts/ExpertsEditor';
import ExpertsListView from '@/components/admin/experts/ExpertsListView';
import { ServicesEditor } from '@/components/admin/services';
import ExpertApprovals from '@/components/admin/experts/ExpertApprovals';
import ExpertCategoriesManager from '@/components/admin/experts/ExpertCategoriesManager';
import ExpertServicesManager from '@/components/admin/experts/ExpertServicesManager';
import ExpertManagement from '@/components/admin/experts/ExpertManagement';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import AdminSettings from './AdminSettings';
import ProgramsEditor from '@/components/admin/programs/ProgramsEditor';
import { SessionsEditor } from '@/components/admin/sessions/SessionsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable';
import ReferralManagement from '@/components/admin/referrals/ReferralManagement';
import ProgramsInquiry from '@/components/admin/programs/ProgramsInquiry';
import AdminUsersManagerPlaceholder from '@/components/admin/users/AdminUsersManagerPlaceholder';
import AdminAnalytics from '@/components/admin/analytics/AdminAnalytics';
import AdminReports from '@/components/admin/reports/AdminReports';
import AdminUsersList from '@/components/admin/users/AdminUsersList';
import ContentSearchManager from '@/components/admin/content/ContentSearchManager';
import NewsletterSubscribers from '@/components/admin/newsletter/NewsletterSubscribers';
import { useAdminContentData } from '@/components/admin/hooks/useAdminContent';


const AdminRoutes: React.FC = () => {
  const { 
    experts, 
    setExperts, 
    services, 
    setServices, 
    testimonials, 
    setTestimonials, 
    loading, 
    error, 
    onRefresh 
  } = useAdminContentData();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/overview" replace />} />
      <Route path="/overview" element={<AdminOverview />} />
      <Route path="/analytics" element={<AdminAnalytics />} />
      <Route path="/reports" element={<AdminReports />} />
      <Route path="/content" element={<ContentSearchManager />} />
      <Route path="/expertApprovals" element={<ExpertApprovals />} />
      <Route path="/experts-list" element={<ExpertManagement />} />
      <Route path="/expert-categories" element={<ExpertCategoriesManager />} />
      <Route path="/expert-services" element={<ExpertServicesManager />} />
      <Route path="/services" element={
        <ServicesEditor 
          categories={services} 
          setCategories={setServices} 
          loading={loading} 
          error={error} 
          onRefresh={onRefresh} 
        />
      } />
      <Route path="/testimonials" element={
        <TestimonialsEditor 
          testimonials={testimonials} 
          setTestimonials={setTestimonials} 
        />
      } />
      <Route path="/programs" element={<ProgramsEditor />} />
      <Route path="/sessions" element={<SessionsEditor />} />
      <Route path="/blog" element={<BlogEditor />} />
      <Route path="/contact" element={<ContactSubmissionsTable />} />
      <Route path="/newsletter" element={<NewsletterSubscribers />} />
      <Route path="/programs-inquiry" element={<ProgramsInquiry />} />
      <Route path="/referrals" element={<ReferralManagement />} />
      <Route path="/adminUsers" element={<AdminUsersManagerPlaceholder />} />
      <Route path="/users" element={<AdminUsersList />} />
      <Route path="/settings" element={<AdminSettings />} />
      <Route path="*" element={<Navigate to="/admin/overview" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
