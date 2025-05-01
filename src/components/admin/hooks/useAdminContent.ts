
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Expert } from '@/components/admin/experts/types';
import { initialHeroSettings } from '@/data/initialAdminData';

interface AdminContent {
  experts: Expert[];
  services: any[];
  heroSettings: {
    title: string;
    subtitle: string;
    description: string;
    videoUrl: string;
  };
  testimonials: any[];
  loading: boolean;
}

export const useAdminContent = (): AdminContent & {
  setExperts: React.Dispatch<React.SetStateAction<Expert[]>>;
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  setHeroSettings: React.Dispatch<React.SetStateAction<any>>;
  setTestimonials: React.Dispatch<React.SetStateAction<any[]>>;
} => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState(initialHeroSettings);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          await loadExpertsFromSupabase(parsedContent);
        }
        
        // Initialize services if empty
        if (!parsedContent?.services || parsedContent.services.length === 0) {
          await initializeDefaultServices(parsedContent);
        }
        
        // Initialize testimonials if empty
        if (!parsedContent?.testimonials || parsedContent.testimonials.length === 0) {
          await initializeDefaultTestimonials(parsedContent);
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

  // Helper function to load experts from Supabase
  const loadExpertsFromSupabase = async (parsedContent: any) => {
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
  };

  // Helper function to initialize default services
  const initializeDefaultServices = async (parsedContent: any) => {
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
  };

  // Helper function to initialize default testimonials
  const initializeDefaultTestimonials = async (parsedContent: any) => {
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
  };

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

  return {
    experts,
    setExperts,
    services,
    setServices,
    heroSettings,
    setHeroSettings,
    testimonials,
    setTestimonials,
    loading
  };
};
