
import React, { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Set the session timeout for 10 minutes (in milliseconds)
const SESSION_TIMEOUT = 10 * 60 * 1000; 

const Admin = () => {
  const [activeTab, setActiveTab] = useState("therapists");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Session timeout handling
  useEffect(() => {
    // Reset the activity timer on any user interaction
    const resetTimer = () => setLastActivity(Date.now());
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    
    // Check session timeout every minute
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > SESSION_TIMEOUT) {
        // Session timed out, log out
        toast.warning('Your session has expired due to inactivity.');
        handleLogout();
      }
    }, 60000); // Check every minute
    
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      clearInterval(interval);
      if (sessionTimer) clearTimeout(sessionTimer);
    };
  }, [lastActivity]);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };
  
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin Header */}
      <header className="bg-ifind-teal text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">iFindLife Admin</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-white hover:text-white/80"
              onClick={() => setActiveTab("admin-tools")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin Tools
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:text-white/80"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8 container mx-auto px-4">
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
            <TabsTrigger value="admin-tools">Admin Tools</TabsTrigger>
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

          <TabsContent value="admin-tools" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
              <div className="space-y-6">
                {/* Content Management Settings */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Content Management</h3>
                  <Button variant="outline" className="mr-2">Import Data</Button>
                  <Button variant="outline" className="mr-2">Export Data</Button>
                  <Button variant="outline">Clear Cache</Button>
                </div>
                
                {/* Security Settings */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Security</h3>
                  <Button variant="outline" className="mr-2">Change Password</Button>
                  <Button variant="outline">Manage Access</Button>
                </div>
                
                {/* System Information */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">System Information</h3>
                  <p className="text-sm text-gray-500">Current session timeout: 10 minutes</p>
                  <p className="text-sm text-gray-500">Last login: {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
