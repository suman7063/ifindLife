
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Expert } from '@/components/admin/experts/types';
import { initialServices, initialTestimonials } from '@/data/initialAdminData';

// Load experts from Supabase or use defaults
export async function loadExpertsData(parsedContent: any | null = null): Promise<Expert[]> {
  try {
    const { data: expertsData, error: expertsError } = await supabase
      .from('experts')
      .select('*');
      
    if (expertsError) {
      console.error('Error fetching experts:', expertsError);
      return [];
    } 
    
    if (expertsData && expertsData.length > 0) {
      // Transform experts data to match our expected format with string IDs
      const formattedExperts = expertsData.map(expert => ({
        id: expert.id.toString(), // Ensure ID is a string
        name: expert.name,
        experience: Number(expert.experience) || 0, // Convert to number
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
      
      // Update localStorage if parsedContent is provided
      if (parsedContent) {
        parsedContent.experts = formattedExperts;
        localStorage.setItem('ifindlife-content', JSON.stringify(parsedContent));
      }
      
      return formattedExperts;
    }
    
    return [];
  } catch (error) {
    console.error('Error loading experts:', error);
    return [];
  }
}

// Get default services
export function getDefaultServices() {
  return initialServices;
}

// Get default testimonials
export function getDefaultTestimonials() {
  return initialTestimonials;
}

// Save content to localStorage
export function saveContentToLocalStorage(content: any) {
  try {
    localStorage.setItem('ifindlife-content', JSON.stringify(content));
  } catch (error) {
    console.error('Error saving content to localStorage:', error);
    toast.error('Error saving content to localStorage');
  }
}

// Load content from localStorage
export function loadContentFromLocalStorage() {
  try {
    const savedContent = localStorage.getItem('ifindlife-content');
    return savedContent ? JSON.parse(savedContent) : null;
  } catch (error) {
    console.error('Error loading content from localStorage:', error);
    toast.error('Error loading content from localStorage');
    return null;
  }
}
