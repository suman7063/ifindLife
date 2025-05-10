
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServicesEditor from '@/components/admin/ServicesEditor';
import ExpertsEditor from '@/components/admin/experts';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import ProgramsEditor from '@/components/admin/programs/ProgramsEditor';
import { SessionsEditor } from '@/components/admin/sessions';
import ReferralSettingsEditor from '@/components/admin/ReferralSettingsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable';
import ExpertApprovals from '@/components/admin/experts/ExpertApprovals';
import { Expert } from '@/components/admin/experts/types';

// This component is kept for backward compatibility but is no longer used
// All routes are now directly managed in Admin.tsx
interface AdminTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  experts: Expert[];
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
  services: any[];
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  testimonials: any[];
  setTestimonials: React.Dispatch<React.SetStateAction<any[]>>;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  activeTab,
  setActiveTab,
  experts,
  setExperts,
  services,
  setServices,
  testimonials,
  setTestimonials
}) => {
  console.warn('AdminTabs component is deprecated and will be removed in a future update.');
  
  // This component is no longer used, routes are managed directly in Admin.tsx
  return null;
};

export default AdminTabs;
