import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, LogOut } from 'lucide-react';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AdminUserManagement from '@/components/AdminUserManagement';
import {
  categoryData,
  therapistData,
  testimonialData,
} from '@/data/homePageData';

// Import refactored components
import HeroSectionEditor from '@/components/admin/HeroSectionEditor';
import ServicesEditor from '@/components/admin/ServicesEditor';
import ExpertsEditor from '@/components/admin/experts';
import ProgramsEditor from '@/components/admin/programs/ProgramsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import TestimonialsEditor from '@/components/admin/testimonials/TestimonialsEditor';
import ReferralSettingsEditor from '@/components/admin/ReferralSettingsEditor';
import SessionsEditor from '@/components/admin/sessions';

// Import admin tools
import useAdminTools from '@/hooks/useAdminTools';

const Admin = () => {
  // State for each section
  const [categories, setCategories] = useState(categoryData);
  const [experts, setExperts] = useState(therapistData);
  const [testimonials, setTestimonials] = useState(testimonialData);
  const [heroSettings, setHeroSettings] = useState({
    title: "Discover Your",
    subtitle: "Mental Wellness",
    description: "Connect with verified mental health experts for personalized guidance about your emotional well-being, relationships, and personal growth. Get support when you need it most.",
    videoUrl: "https://www.youtube.com/embed/rUJFj6yLWSw?autoplay=0"
  });

  const { currentUser, logout } = useAuth();
  const { ProgramResetTool } = useAdminTools();
  
  console.log('Admin component rendered, currentUser:', currentUser?.username);

  // Load data from localStorage if available
  useEffect(() => {
    const savedContent = localStorage.getItem('ifindlife-content');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.categories) setCategories(parsedContent.categories);
        if (parsedContent.experts) setExperts(parsedContent.experts);
        if (parsedContent.testimonials) setTestimonials(parsedContent.testimonials);
        if (parsedContent.heroSettings) setHeroSettings(parsedContent.heroSettings);
      } catch (e) {
        console.error("Error parsing saved content", e);
      }
    }
  }, []);

  // Add auto logout functionality
  useEffect(() => {
    let inactivityTimer;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.log('Auto logout due to inactivity');
        logout();
      }, 30 * 60 * 1000); // 30 minutes in milliseconds
    };
    
    // Reset timer on user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimer);
    });
    
    // Initialize timer
    resetTimer();
    
    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [logout]);

  // Handler for saving changes
  const handleSave = () => {
    // In a real application, this would save to a database or localStorage
    localStorage.setItem('ifindlife-content', JSON.stringify({
      categories,
      experts,
      testimonials,
      heroSettings
    }));
    alert('Changes saved successfully! In a real application, this would update your database.');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar removed for admin login */}
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-ifind-aqua hover:text-ifind-teal">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {currentUser && (
              <span className="ml-2 text-sm bg-ifind-teal/10 text-ifind-teal px-2 py-1 rounded-full">
                {currentUser.username} ({currentUser.role})
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-ifind-aqua hover:bg-ifind-teal">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <Tabs defaultValue="hero">
            <TabsList className="w-full border-b p-0 rounded-none">
              <TabsTrigger value="hero" className="rounded-none rounded-tl-lg">Hero Section</TabsTrigger>
              <TabsTrigger value="categories" className="rounded-none">Services</TabsTrigger>
              <TabsTrigger value="experts" className="rounded-none">Experts</TabsTrigger>
              <TabsTrigger value="testimonials" className="rounded-none">Testimonials</TabsTrigger>
              <TabsTrigger value="programs" className="rounded-none">Programs</TabsTrigger>
              <TabsTrigger value="sessions" className="rounded-none">Sessions</TabsTrigger>
              <TabsTrigger value="blog" className="rounded-none">Blog</TabsTrigger>
              <TabsTrigger value="referral" className="rounded-none">Referral Program</TabsTrigger>
              <TabsTrigger value="tools" className="rounded-none">Admin Tools</TabsTrigger>
              {currentUser?.role === 'superadmin' && (
                <TabsTrigger value="admins" className="rounded-none">Admin Users</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="hero" className="p-6">
              <HeroSectionEditor 
                heroSettings={heroSettings} 
                setHeroSettings={setHeroSettings} 
              />
            </TabsContent>

            <TabsContent value="categories" className="p-6">
              <ServicesEditor 
                categories={categories} 
                setCategories={setCategories} 
              />
            </TabsContent>

            <TabsContent value="experts" className="p-6">
              <ExpertsEditor 
                experts={experts} 
                setExperts={setExperts} 
              />
            </TabsContent>

            <TabsContent value="testimonials" className="p-6">
              <TestimonialsEditor 
                testimonials={testimonials} 
                setTestimonials={setTestimonials} 
              />
            </TabsContent>
            
            <TabsContent value="programs" className="p-6">
              <ProgramsEditor />
            </TabsContent>
            
            <TabsContent value="sessions" className="p-6">
              <SessionsEditor />
            </TabsContent>
            
            <TabsContent value="blog" className="p-6">
              <BlogEditor />
            </TabsContent>

            <TabsContent value="referral" className="p-6">
              <ReferralSettingsEditor />
            </TabsContent>
            
            <TabsContent value="tools" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Admin Tools</h2>
              <p className="text-muted-foreground mb-6">Tools for system maintenance and troubleshooting.</p>
              <div className="space-y-6">
                {ProgramResetTool && <ProgramResetTool />}
              </div>
            </TabsContent>

            <TabsContent value="admins" className="p-6">
              <AdminUserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
