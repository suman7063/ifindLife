
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServicesEditor from '@/components/admin/ServicesEditor';
import ExpertsEditor from '@/components/admin/experts';
import HeroSectionEditor from '@/components/admin/HeroSectionEditor';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import ProgramsEditor from '@/components/admin/programs/ProgramsEditor';
import { SessionsEditor } from '@/components/admin/sessions';
import ReferralSettingsEditor from '@/components/admin/ReferralSettingsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable';
import ExpertApprovals from '@/components/admin/experts/ExpertApprovals';
import { Expert } from '@/components/admin/experts/types';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  experts: Expert[];
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
  services: any[];
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  heroSettings: any;
  setHeroSettings: React.Dispatch<React.SetStateAction<any>>;
  testimonials: any[];
  setTestimonials: React.Dispatch<React.SetStateAction<any[]>>;
  isLoading?: boolean;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  activeTab,
  setActiveTab,
  experts,
  setExperts,
  services,
  setServices,
  heroSettings,
  setHeroSettings,
  testimonials,
  setTestimonials,
  isLoading = false
}) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-8 flex flex-wrap h-auto">
        <TabsTrigger value="experts">Experts</TabsTrigger>
        <TabsTrigger value="expertApprovals">Expert Approvals</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="herosection">Hero Section</TabsTrigger>
        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        <TabsTrigger value="programs">Programs</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="referrals">Referrals</TabsTrigger>
        <TabsTrigger value="blog">Blog</TabsTrigger>
        <TabsTrigger value="contact">Contact Submissions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="experts" className="space-y-4">
        <ExpertsEditor experts={experts} setExperts={setExperts} />
      </TabsContent>
      
      <TabsContent value="expertApprovals" className="space-y-4">
        <ExpertApprovals />
      </TabsContent>
      
      <TabsContent value="services" className="space-y-4">
        <ServicesEditor categories={services} setCategories={setServices} />
      </TabsContent>
      
      <TabsContent value="herosection" className="space-y-4">
        <HeroSectionEditor heroSettings={heroSettings} setHeroSettings={setHeroSettings} />
      </TabsContent>
      
      <TabsContent value="testimonials" className="space-y-4">
        <TestimonialsEditor testimonials={testimonials} setTestimonials={setTestimonials} />
      </TabsContent>
      
      <TabsContent value="programs" className="space-y-4">
        <ProgramsEditor />
      </TabsContent>
      
      <TabsContent value="sessions" className="space-y-4">
        <SessionsEditor />
      </TabsContent>
      
      <TabsContent value="referrals" className="space-y-4">
        <ReferralSettingsEditor />
      </TabsContent>
      
      <TabsContent value="blog" className="space-y-4">
        <BlogEditor />
      </TabsContent>

      <TabsContent value="contact" className="space-y-4">
        <ContactSubmissionsTable />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
