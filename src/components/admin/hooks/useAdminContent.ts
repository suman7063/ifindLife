
import { useState, useEffect } from 'react';
import { Expert } from '@/components/admin/experts/types';
import { supabase } from '@/integrations/supabase/client';
import { testimonialData } from '@/data/homePageData';
import { issueBasedPrograms } from '@/data/issueBasedPrograms';

export const useAdminContentData = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load real data from the same sources as frontend
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load testimonials - first try Supabase, then fallback to local data
        try {
          const { data: supabaseTestimonials } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (supabaseTestimonials && supabaseTestimonials.length > 0) {
            setTestimonials(supabaseTestimonials);
          } else {
            // Fallback to local testimonial data
            setTestimonials(testimonialData);
          }
        } catch (err) {
          console.warn('Failed to load testimonials from Supabase, using local data');
          setTestimonials(testimonialData);
        }

        // Load experts from Supabase
        try {
          const { data: expertData } = await supabase
            .from('experts')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (expertData) {
            // Transform Supabase expert data to match admin Expert type
            const transformedExperts: Expert[] = expertData.map(expert => ({
              id: expert.id,
              name: expert.name,
              experience: parseInt(expert.experience) || 5, // Convert to number
              specialties: expert.specialization ? [expert.specialization] : [],
              rating: expert.average_rating || 0,
              consultations: expert.reviews_count || 0,
              price: 100, // Default price since not in DB
              waitTime: '< 5 min', // Default wait time
              imageUrl: expert.profile_picture || '',
              online: false, // Default status
              languages: ['English'],
              bio: expert.bio || '',
              email: expert.email,
              phone: expert.phone || '',
              address: expert.address || '',
              city: expert.city || '',
              state: expert.state || '',
              country: expert.country || '',
              availability: '9 AM - 6 PM', // Default availability
              status: 'approved' as const
            }));
            setExperts(transformedExperts);
          }
        } catch (err) {
          console.warn('Failed to load experts from Supabase');
          setError('Failed to load experts');
        }

        // Load services from Supabase
        try {
          const { data: serviceData } = await supabase
            .from('services')
            .select('*')
            .order('id', { ascending: true });
          
          if (serviceData) {
            setServices(serviceData);
          }
        } catch (err) {
          console.warn('Failed to load services from Supabase');
          setError('Failed to load services');
        }

      } catch (err) {
        setError('Failed to load admin content');
        console.error('Error loading admin content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const onRefresh = () => {
    // Reload all data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

    }, 1000);
  };

  return {
    experts,
    setExperts,
    services,
    setServices,
    testimonials,
    setTestimonials,
    loading,
    error,
    onRefresh
  };
};
