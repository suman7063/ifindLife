import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/admin-auth';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminSettings from '@/components/admin/dashboard/AdminSettings';
import AdminOverview from '@/components/admin/dashboard/AdminOverview';
import ExpertsEditor from '@/components/admin/experts/ExpertsEditor';
import ServicesEditor from '@/components/admin/ServicesEditor';
import HeroSectionEditor from '@/components/admin/HeroSectionEditor';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import ProgramsEditor from '@/components/admin/programs/ProgramsEditor';
import { SessionsEditor } from '@/components/admin/sessions';
import ReferralSettingsEditor from '@/components/admin/ReferralSettingsEditor';
import BlogEditor from '@/components/admin/BlogEditor';
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable';
import ExpertApprovals from '@/components/admin/experts/ExpertApprovals';
import { initialHeroSettings } from '@/data/initialAdminData';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Expert } from '@/components/admin/experts/types';

const Admin = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for content sections
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState(initialHeroSettings);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Extract the current tab from the URL path
  const getCurrentTabFromPath = () => {
    const path = location.pathname.split('/');
    return path.length > 2 ? path[2] : 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getCurrentTabFromPath());
  
  // Update active tab when the URL changes
  useEffect(() => {
    setActiveTab(getCurrentTabFromPath());
  }, [location.pathname]);

  // Load content from localStorage or initialize it
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
        // Try to load content from localStorage first
        const savedContent = localStorage.getItem('ifindlife-content');
        let parsedContent = null;
        
        if (savedContent) {
          parsedContent = JSON.parse(savedContent);
          
          if (parsedContent.experts) setExperts(parsedContent.experts);
          if (parsedContent.services) setServices(parsedContent.services);
          if (parsedContent.heroSettings) setHeroSettings(parsedContent.heroSettings);
          if (parsedContent.testimonials) setTestimonials(parsedContent.testimonials);
        }
        
        // If no experts in local storage, try to fetch from Supabase
        if (!parsedContent?.experts || parsedContent.experts.length === 0) {
          const { data: expertsData, error: expertsError } = await supabase
            .from('experts')
            .select('*');
            
          if (expertsError) {
            console.error('Error fetching experts:', expertsError);
          } else if (expertsData && expertsData.length > 0) {
            // Transform experts data to match our expected format with string IDs
            const formattedExperts = expertsData.map(expert => ({
              id: expert.id.toString(), // Ensure ID is a string
              name: expert.name,
              experience: expert.experience || 0,
              specialties: expert.specialization ? [expert.specialization] : [],
              rating: expert.average_rating || 4.5,
              consultations: expert.reviews_count || 0,
              price: 30, // Default price if not specified
              waitTime: "Available",
              imageUrl: expert.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
              online: true,
              languages: [],
              bio: expert.bio || "",
              email: expert.email || "",
              phone: expert.phone || "",
              address: expert.address || "",
              city: expert.city || "",
              state: expert.state || "",
              country: expert.country || ""
            }));
            
            setExperts(formattedExperts);
            
            // Update localStorage with fetched data
            if (parsedContent) {
              parsedContent.experts = formattedExperts;
              localStorage.setItem('ifindlife-content', JSON.stringify(parsedContent));
            }
          }
        }
        
        // Initialize services if empty
        if (!parsedContent?.services || parsedContent.services.length === 0) {
          // Default services
          const defaultServices = [
            {
              icon: <span className="text-3xl">🧠</span>,
              title: "Mental Health",
              description: "Depression, Anxiety, and other mental health issues",
              href: "/services/mental-health",
              color: "bg-ifind-aqua/10"
            },
            {
              icon: <span className="text-3xl">💭</span>,
              title: "Relationship Issues",
              description: "Dating, Marriage problems, Divorce",
              href: "/services/relationships",
              color: "bg-ifind-purple/10"
            },
            {
              icon: <span className="text-3xl">✨</span>,
              title: "Self-Improvement",
              description: "Confidence, Personal growth, Motivation",
              href: "/services/self-improvement",
              color: "bg-ifind-teal/10"
            }
          ];
          setServices(defaultServices);
          
          // Update localStorage with default services
          if (parsedContent) {
            parsedContent.services = defaultServices;
            localStorage.setItem('ifindlife-content', JSON.stringify(parsedContent));
          }
        }
        
        // Initialize testimonials if empty
        if (!parsedContent?.testimonials || parsedContent.testimonials.length === 0) {
          // Default testimonials
          const defaultTestimonials = [
            {
              name: "Sarah Johnson",
              location: "New York",
              rating: 5,
              text: "I've struggled with anxiety for years and finally found the help I needed here.",
              date: "2 weeks ago",
              imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
            },
            {
              name: "Michael Chen",
              location: "Chicago",
              rating: 5,
              text: "The advice I received completely transformed my relationship with my partner.",
              date: "1 month ago",
              imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
            },
            {
              name: "Emma Rodriguez",
              location: "Los Angeles",
              rating: 4,
              text: "After just a few sessions, I've developed much healthier coping mechanisms.",
              date: "3 months ago",
              imageUrl: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=1889&auto=format&fit=crop"
            }
          ];
          setTestimonials(defaultTestimonials);
          
          // Update localStorage with default testimonials
          if (parsedContent) {
            parsedContent.testimonials = defaultTestimonials;
            localStorage.setItem('ifindlife-content', JSON.stringify(parsedContent));
          }
        }
      } catch (error) {
        console.error('Error loading content:', error);
        toast.error('Error loading content');
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);

  // Save content to localStorage whenever it changes
  useEffect(() => {
    if (loading) return;

    const content = {
      experts,
      services,
      heroSettings,
      testimonials
    };
    
    try {
      localStorage.setItem('ifindlife-content', JSON.stringify(content));
    } catch (error) {
      console.error('Error saving content to localStorage:', error);
    }
  }, [experts, services, heroSettings, testimonials, loading]);

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    console.log('Admin.tsx: Not authenticated, redirecting to admin-login');
    return <Navigate to="/admin-login" replace />;
  }

  // Check if user has any permissions
  const hasAnyPermission = currentUser && Object.values(currentUser.permissions).some(val => val === true);
  
  if (!hasAnyPermission) {
    console.log('Admin.tsx: User has no permissions');
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">Access Restricted</h1>
          <p className="mb-6 text-muted-foreground">
            You don't have any permissions assigned to your account. Please contact a super administrator.
          </p>
          <button 
            onClick={() => window.location.href = '/admin-login'}
            className="w-full rounded bg-ifind-aqua py-2 font-medium text-white hover:bg-ifind-teal"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent text-ifind-teal"></div>
          <span className="ml-2">Loading content...</span>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/overview" element={<AdminOverview />} />
          <Route path="/experts" element={<ExpertsEditor experts={experts} setExperts={setExperts} />} />
          <Route path="/expertApprovals" element={<ExpertApprovals />} />
          <Route path="/services" element={<ServicesEditor categories={services} setCategories={setServices} />} />
          <Route path="/herosection" element={<HeroSectionEditor heroSettings={heroSettings} setHeroSettings={setHeroSettings} />} />
          <Route path="/testimonials" element={<TestimonialsEditor testimonials={testimonials} setTestimonials={setTestimonials} />} />
          <Route path="/programs" element={<ProgramsEditor />} />
          <Route path="/sessions" element={<SessionsEditor />} />
          <Route path="/referrals" element={<ReferralSettingsEditor />} />
          <Route path="/blog" element={<BlogEditor />} />
          <Route path="/contact" element={<ContactSubmissionsTable />} />
          <Route path="/adminUsers" element={<AdminUserManagement />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      )}
    </AdminDashboardLayout>
  );
};

export default Admin;
