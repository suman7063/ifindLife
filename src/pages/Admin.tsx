
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TherapistsEditor from '@/components/admin/TherapistsEditor';
import ServicesEditor from '@/components/admin/ServicesEditor';
import ExpertsEditor from '@/components/admin/experts'; 
import HeroSectionEditor from '@/components/admin/HeroSectionEditor';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import ProgramsEditor from '@/components/admin/programs/ProgramsEditor'; 
import { SessionsEditor } from '@/components/admin/sessions';
import ReferralSettingsEditor from '@/components/admin/ReferralSettingsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("therapists");
  
  // Dummy data for props
  const dummyTherapists = [];
  const dummyCategories = [];
  const dummyExperts = [];
  const dummyHeroSettings = {
    title: "You Are Not Alone!",
    subtitle: "Is there a situation, you need immediate help with?",
    description: "Connect with our currently online experts through an instant call",
    videoUrl: ""
  };
  const dummyTestimonials = [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 flex flex-wrap h-auto">
              <TabsTrigger value="therapists">Therapists</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="experts">Experts</TabsTrigger>
              <TabsTrigger value="herosection">Hero Section</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="contact">Contact Submissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="therapists" className="space-y-4">
              <TherapistsEditor therapists={dummyTherapists} setTherapists={() => {}} />
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4">
              <ServicesEditor categories={dummyCategories} setCategories={() => {}} />
            </TabsContent>
            
            <TabsContent value="experts" className="space-y-4">
              <ExpertsEditor experts={dummyExperts} setExperts={() => {}} />
            </TabsContent>
            
            <TabsContent value="herosection" className="space-y-4">
              <HeroSectionEditor heroSettings={dummyHeroSettings} setHeroSettings={() => {}} />
            </TabsContent>
            
            <TabsContent value="testimonials" className="space-y-4">
              <TestimonialsEditor testimonials={dummyTestimonials} setTestimonials={() => {}} />
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
