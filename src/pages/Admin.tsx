
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
import { Expert } from '@/components/admin/experts/types';
import expertData from '@/data/expertData';
import { ExtendedExpert } from '@/types/expert';

// Function to convert ExtendedExpert to Expert type
const convertToExpertFormat = (extendedExperts: ExtendedExpert[]): Expert[] => {
  return extendedExperts.map(exp => ({
    id: typeof exp.id === 'string' ? parseInt(exp.id) : exp.id as number,
    name: exp.name,
    experience: typeof exp.experience === 'string' ? parseInt(exp.experience) : (exp.experience as number || 0),
    specialties: exp.specialties || [],
    rating: exp.rating || 4.5,
    consultations: exp.sessionCount || 0,
    price: exp.pricing?.consultation_fee || 0,
    waitTime: "Available",
    imageUrl: exp.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    online: true,
    languages: exp.languages || [],
    bio: exp.bio || "",
    email: exp.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: ""
  }));
};

// Sample data for services
const initialServices = [
  {
    icon: <span className="text-3xl">🧠</span>,
    title: "Mental Health Counseling",
    description: "Professional guidance for emotional well-being and mental health challenges",
    href: "/services/mental-health",
    color: "bg-ifind-teal/10"
  },
  {
    icon: <span className="text-3xl">💭</span>,
    title: "Cognitive Behavioral Therapy",
    description: "Evidence-based approach to identify and change negative thought patterns",
    href: "/services/cbt",
    color: "bg-ifind-purple/10"
  },
  {
    icon: <span className="text-3xl">🌱</span>,
    title: "Personal Growth",
    description: "Guidance for self-improvement, confidence building, and personal development",
    href: "/services/personal-growth",
    color: "bg-ifind-aqua/10"
  },
];

// Sample data for hero section
const initialHeroSettings = {
  title: "Discover Mental Wellness Solutions",
  subtitle: "Professional Support When You Need It",
  description: "Connect with experienced therapists and wellness experts for personalized guidance to improve your mental well-being and lead a more balanced life.",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
};

// Sample data for testimonials
const initialTestimonials = [
  {
    name: "Sarah Johnson",
    location: "New York",
    rating: 5,
    text: "The guidance I received was transformative. My therapist helped me develop coping strategies that I use every day.",
    date: "2 months ago",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    name: "Michael Lee",
    location: "San Francisco",
    rating: 4,
    text: "After just a few sessions, I noticed a significant improvement in my anxiety levels. Highly recommend.",
    date: "1 month ago",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
];

// Set the session timeout for 10 minutes (in milliseconds)
const SESSION_TIMEOUT = 10 * 60 * 1000; 

const Admin = () => {
  // State management for each section
  const [experts, setExperts] = useState<Expert[]>(() => convertToExpertFormat(expertData));
  const [services, setServices] = useState(initialServices);
  const [heroSettings, setHeroSettings] = useState(initialHeroSettings);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  
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
            <ExpertsEditor experts={experts} setExperts={setExperts} />
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
      </main>
    </div>
  );
};

export default Admin;
