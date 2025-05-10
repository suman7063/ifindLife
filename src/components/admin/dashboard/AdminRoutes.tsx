
import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ExpertsEditor from '@/components/admin/experts/ExpertsEditor';
import { ServicesEditor } from '@/components/admin/services';
import ExpertApprovals from '@/components/admin/experts/ExpertApprovals';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import AdminSettings from './AdminSettings';
import ProgramsEditor from '@/components/admin/programs/ProgramsEditor';
import { SessionsEditor } from '@/components/admin/sessions/SessionsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable';
import ReferralSettingsEditor from '@/components/admin/ReferralSettingsEditor';
import AdminUsersManager from '@/components/admin/users/AdminUsersManager';
import AdminAnalytics from '@/components/admin/analytics/AdminAnalytics';
import AdminReports from '@/components/admin/reports/AdminReports';
import AdminUsersList from '@/components/admin/users/AdminUsersList';
import ContentSearchManager from '@/components/admin/content/ContentSearchManager';

interface AdminRoutesProps {
  isSuperAdmin: boolean;
  loading: boolean;
  experts: any[];
  setExperts: React.Dispatch<React.SetStateAction<any[]>>;
  services: any[];
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  testimonials: any[];
  setTestimonials: React.Dispatch<React.SetStateAction<any[]>>;
  error: string | null;
  onRefresh: () => void;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ 
  isSuperAdmin,
  loading,
  experts,
  setExperts,
  services,
  setServices,
  testimonials,
  setTestimonials,
  error,
  onRefresh
}) => {
  const location = useLocation();
  const path = location.pathname.split('/');
  const currentTab = path.length > 2 ? path[2] : 'overview';
  
  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return <AdminDashboard />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'reports':
        return <AdminReports />;
      case 'content':
        return <ContentSearchManager />;
      case 'experts':
        return <ExpertsEditor experts={experts} setExperts={setExperts} loading={loading} error={error} onRefresh={onRefresh} />;
      case 'expertApprovals':
        return <ExpertApprovals />;
      case 'services':
        return <ServicesEditor categories={services} setCategories={setServices} loading={loading} error={error} onRefresh={onRefresh} />;
      case 'testimonials':
        return <TestimonialsEditor testimonials={testimonials} setTestimonials={setTestimonials} />;
      case 'programs':
        return <ProgramsEditor />;
      case 'sessions':
        return <SessionsEditor />;
      case 'blog':
        return <BlogEditor />;
      case 'contact':
        return <ContactSubmissionsTable />;
      case 'referrals':
        return <ReferralSettingsEditor />;
      case 'adminUsers':
        return <AdminUsersManager />;
      case 'users':
        return <AdminUsersList />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return renderContent();
};

export default AdminRoutes;
