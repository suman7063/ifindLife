
import React, { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Set the session timeout for 10 minutes (in milliseconds)
const SESSION_TIMEOUT = 10 * 60 * 1000; 

const Admin = () => {
  const [activeTab, setActiveTab] = useState("experts");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Session timeout handling
  useEffect(() => {
    // Reset the activity timer on any user interaction
    const resetTimer = () => {
      setLastActivity(Date.now());
      console.log("Admin activity detected, resetting session timer");
    };
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    
    // Check session timeout every minute
    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastActivity;
      console.log(`Time since last activity: ${Math.round(timeElapsed / 1000)} seconds`);
      
      if (timeElapsed > SESSION_TIMEOUT) {
        // Session timed out, log out
        console.log("Session timeout reached, logging out");
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin Header - No header visible when logged in */}
      <header className="bg-ifind-teal text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">iFindLife Admin</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-white hover:text-white/80"
              onClick={() => navigate('/')}
            >
              View Site
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
            <TabsTrigger value="experts">Experts</TabsTrigger>
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
            <ExpertsEditor />
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <ServicesEditor />
          </TabsContent>
          
          <TabsContent value="herosection" className="space-y-4">
            <HeroSectionEditor />
          </TabsContent>
          
          <TabsContent value="testimonials" className="space-y-4">
            <TestimonialsEditor />
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
      </main>
    </div>
  );
};

export default Admin;
