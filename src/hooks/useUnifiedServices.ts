import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getServiceFrontendData, SERVICE_FRONTEND_MAP } from '@/data/unifiedServicesData';
import { Brain } from 'lucide-react';

export interface UnifiedService {
  id: number;
  name: string;
  description: string;
  category: string;
  rate_usd: number;
  rate_inr: number;
  rate_eur: number;
  duration: number;
  featured: boolean;
  // Frontend data
  slug: string;
  image: string;
  color: string;
  gradientColor: string;
  textColor: string;
  buttonColor: string;
  icon: any; // Lucide icon component
  detailedDescription: string;
  benefits: string[];
  process: string;
  formattedDuration: string;
}

export function useUnifiedServices() {
  const [services, setServices] = useState<UnifiedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching services from database...');
        const { data: dbServices, error } = await supabase
          .from('services')
          .select('*')
          .order('id');

        if (error) throw error;
        
        console.log('📊 Raw database services:', dbServices);

        // Map service names to frontend data (since DB uses UUIDs, not numeric IDs)
        const serviceNameToFrontendMap: Record<string, number> = {
          'Heart2Heart Listening': 1,
          'Heart2Heart Listening Sessions': 1,
          'Listening Session with Guidance': 2,
          'Listening with Guidance': 2,
          'Therapy Sessions': 3,
          'Guided Meditations': 4,
          'Offline Retreats': 5,
          'Life Coaching': 6
        };
        
        // Merge database data with frontend data
        const unifiedServices: UnifiedService[] = (dbServices || []).map(dbService => {
          console.log(`🔍 Processing service ID: ${dbService.id}, name: ${dbService.name}`);
          
          // Try to get frontend data by service name first (since DB uses UUIDs)
          const frontendId = serviceNameToFrontendMap[dbService.name];
          const frontendData = frontendId ? getServiceFrontendData(frontendId) : null;
          
          // Fallback: try by numeric ID if it's a number
          const numericId = typeof dbService.id === 'number' ? dbService.id : parseInt(dbService.id);
          const frontendDataById = !frontendData && !isNaN(numericId) ? getServiceFrontendData(numericId) : null;
          const finalFrontendData = frontendData || frontendDataById;
          
          console.log(`📋 Frontend data for "${dbService.name}":`, finalFrontendData);
          
          if (!finalFrontendData) {
            console.warn(`❌ No frontend data found for service: ${dbService.name} (ID: ${dbService.id})`);
            // Return a fallback service instead of null
            return {
              id: dbService.id,
              name: dbService.name,
              description: dbService.description,
              category: dbService.category,
              rate_usd: dbService.rate_usd,
              rate_inr: dbService.rate_inr,
              rate_eur: dbService.rate_eur,
              duration: dbService.duration,
              featured: dbService.featured,
              slug: `service-${dbService.id}`,
              image: "/lovable-uploads/placeholder.png",
              color: "bg-ifind-aqua",
              gradientColor: "from-ifind-aqua/20 to-white",
              textColor: "text-ifind-aqua",
              buttonColor: "bg-ifind-aqua hover:bg-ifind-aqua/90",
              icon: Brain, // Use imported icon
              detailedDescription: dbService.description,
              benefits: ["Professional service", "Expert guidance"],
              process: "Contact us for more details",
              formattedDuration: "50-minute sessions"
            };
          }

          return {
            // Database data (maintains original structure)
            id: dbService.id,
            name: dbService.name,
            description: dbService.description,
            category: dbService.category,
            rate_usd: dbService.rate_usd,
            rate_inr: dbService.rate_inr,
            rate_eur: dbService.rate_eur,
            duration: dbService.duration,
            featured: dbService.featured,
            // Frontend data
            slug: finalFrontendData.slug,
            image: finalFrontendData.image,
            color: finalFrontendData.color,
            gradientColor: finalFrontendData.gradientColor,
            textColor: finalFrontendData.textColor,
            buttonColor: finalFrontendData.buttonColor,
            icon: finalFrontendData.icon,
            detailedDescription: finalFrontendData.detailedDescription,
            benefits: [...finalFrontendData.benefits],
            process: finalFrontendData.process,
            formattedDuration: finalFrontendData.title.includes('Retreat') ? 'Weekend (2-3 days) to week-long retreats' : 
                              finalFrontendData.title.includes('Heart2Heart') ? '45-minute sessions' :
                              '50-minute sessions'
          };
        }).filter(Boolean) as UnifiedService[];

        console.log('✅ Final unified services:', unifiedServices);
        console.log(`📊 Total services processed: ${unifiedServices.length}`);
        
        setServices(unifiedServices);
        setError(null);
      } catch (err) {
        console.error('Error fetching unified services:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceById = (id: number) => {
    return services.find(service => service.id === id);
  };

  const getServiceBySlug = (slug: string) => {
    return services.find(service => service.slug === slug);
  };

  const getServicesByCategory = (category: string) => {
    return services.filter(service => service.category === category);
  };

  const getFeaturedServices = () => {
    return services.filter(service => service.featured);
  };

  return {
    services,
    loading,
    error,
    getServiceById,
    getServiceBySlug,
    getServicesByCategory,
    getFeaturedServices,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Re-trigger the effect
      setServices([]);
    }
  };
}