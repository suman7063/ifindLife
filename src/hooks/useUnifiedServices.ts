import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Brain, HeartHandshake, HeartPulse, Leaf, MessageCircle, Sparkles, 
  Heart, Users, User, Shield, Star, Moon, Sun, Flower, Flower2, Smile, SmilePlus, 
  HandHeart, HandHelping, Handshake, Lightbulb, Target, Award, BookOpen, Book, 
  GraduationCap, School, Home, Building, TreePine, Mountain, Waves, Wind, Flame, 
  Zap, Activity, TrendingUp, LucideIcon 
} from 'lucide-react';

interface DbService {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  rate_usd: number;
  rate_inr: number;
  rate_eur?: number | null;
  duration?: number | null;
  location?: string | null; // Location for Offline Retreats
  service_type?: string | null; // Service type: 'regular', 'retreat', 'premium', 'exclusive'
  featured?: boolean | null;
  // UI fields
  image?: string | null;
  slug?: string | null;
  color?: string | null;
  gradient_color?: string | null;
  text_color?: string | null;
  button_color?: string | null;
  icon_name?: string | null;
  icon_image?: string | null; // Uploaded icon image URL
  detailed_description?: string | null;
  benefits?: string[] | string | null;
  process?: string | null;
}

export interface UnifiedService {
  id: string | number; // Database uses UUID (string) but can be number too
  name: string;
  description: string;
  category: string;
  rate_usd: number;
  rate_inr: number;
  rate_eur: number;
  duration: number;
  featured: boolean;
  service_type?: string | null; // Service type: 'regular', 'retreat', 'premium', 'exclusive'
  // Generated from database data
  slug: string;
  title: string; // Same as name from database
  image?: string; // Banner image from database
  iconImage?: string; // Icon image from database (uploaded)
  color: string;
  gradientColor: string;
  textColor: string;
  buttonColor: string;
  icon: LucideIcon; // Lucide icon component (from icon_name or default)
  detailedDescription?: string; // Optional, can use description
  benefits: string[]; // Always provided (default if not in database)
  process: string; // Always provided (default if not in database)
  formattedDuration?: string; // Only for retreats, includes duration, rates, location
  retreatInfo?: {
    duration: string;
    rates: string | null;
    location: string | null;
  }; // Structured retreat info for better display
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

        // Helper function to get icon from database icon_name or default
        const getIconFromName = (iconName?: string | null): LucideIcon => {
          if (!iconName) return Brain;
          
          const iconMap: Record<string, LucideIcon> = {
            'Brain': Brain,
            'HeartPulse': HeartPulse,
            'HeartHandshake': HeartHandshake,
            'MessageCircle': MessageCircle,
            'Leaf': Leaf,
            'Sparkles': Sparkles,
            'Heart': Heart,
            'Users': Users,
            'User': User,
            'Shield': Shield,
            'Star': Star,
            'Moon': Moon,
            'Sun': Sun,
            'Flower': Flower,
            'Flower2': Flower2,
            'Smile': Smile,
            'SmilePlus': SmilePlus,
            'HandHeart': HandHeart,
            'HandHelping': HandHelping,
            'Handshake': Handshake,
            'Lightbulb': Lightbulb,
            'Target': Target,
            'Award': Award,
            'BookOpen': BookOpen,
            'Book': Book,
            'GraduationCap': GraduationCap,
            'School': School,
            'Home': Home,
            'Building': Building,
            'TreePine': TreePine,
            'Mountain': Mountain,
            'Waves': Waves,
            'Wind': Wind,
            'Flame': Flame,
            'Zap': Zap,
            'Activity': Activity,
            'TrendingUp': TrendingUp,
          };
          
          return iconMap[iconName] || Brain;
        };

        // Helper function to generate slug from name if not in database (fallback only)
        const getSlug = (dbService: DbService): string => {
          if (dbService.slug) return dbService.slug;
          // Auto-generate only if not set in database
          return dbService.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        };

        // Helper function to format duration for retreats (returns structured data)
        const formatRetreatInfo = (
          duration: number, 
          rate_inr: number, 
          rate_eur: number, 
          location?: string | null
        ) => {
          // Format duration in a user-friendly way
          let formattedDuration = '';
          if (duration && duration > 0) {
            const totalMinutes = duration;
            const hours = Math.floor(totalMinutes / 60);
            const days = Math.floor(hours / 24);
            const weeks = Math.floor(days / 7);
            const months = Math.floor(days / 30);
            const years = Math.floor(days / 365);
            const remainingDays = days % 7;
            const remainingHours = hours % 24;
            const remainingMinutes = totalMinutes % 60;
            
            // Format based on duration length - make it user-friendly
            if (years > 0) {
              formattedDuration = `${years} year${years > 1 ? 's' : ''}`;
              const remainingMonths = Math.floor((days % 365) / 30);
              if (remainingMonths > 0) {
                formattedDuration += ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
              }
            } else if (months > 0) {
              formattedDuration = `${months} month${months > 1 ? 's' : ''}`;
              const remainingDaysAfterMonths = days % 30;
              if (remainingDaysAfterMonths > 0) {
                formattedDuration += ` ${remainingDaysAfterMonths} day${remainingDaysAfterMonths > 1 ? 's' : ''}`;
              }
            } else if (weeks > 0) {
              formattedDuration = `${weeks} week${weeks > 1 ? 's' : ''}`;
              if (remainingDays > 0) {
                formattedDuration += ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
              }
            } else if (days > 0) {
              formattedDuration = `${days} day${days > 1 ? 's' : ''}`;
              if (remainingHours > 0) {
                formattedDuration += ` ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
              }
            } else if (hours > 0) {
              formattedDuration = `${hours} hour${hours > 1 ? 's' : ''}`;
              if (remainingMinutes > 0) {
                formattedDuration += ` ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
              }
            } else {
              formattedDuration = `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''}`;
            }
          }
          
          // Format rates
          const rates: string[] = [];
          if (rate_inr > 0) rates.push(`₹${rate_inr.toLocaleString('en-IN')}`);
          if (rate_eur > 0) rates.push(`€${rate_eur.toLocaleString('en-IN')}`);
          
          return {
            duration: formattedDuration,
            rates: rates.length > 0 ? rates.join(' / ') : null,
            location: location || null
          };
        };
        
        // Default benefits and process (used when database values are null)
        const defaultBenefits = [
          "Experience of being fully heard and acknowledged",
          "Clarification of thoughts and feelings through verbal expression",
          "Emotional release and reduced mental burden",
          "Increased self-understanding without external judgment",
          "Development of your own solutions through self-expression"
        ];
        
        const defaultProcess = "You'll be welcomed into a comfortable, private setting where you can speak freely about whatever is on your mind. The listener will maintain attentive, supportive presence without interrupting or offering advice unless specifically requested.";
        
        // Use data directly from database - no hardcoded logic
        const unifiedServices: UnifiedService[] = (dbServices || []).map((dbService: DbService) => {
          // Parse benefits from JSONB if it's a string
          let benefits: string[] = [];
          if (dbService.benefits) {
            try {
              benefits = typeof dbService.benefits === 'string' 
                ? JSON.parse(dbService.benefits) 
                : dbService.benefits;
            } catch (e) {
              console.warn('Error parsing benefits:', e);
              benefits = [];
            }
          }
          
          // Use default benefits if null or empty
          const finalBenefits = (benefits && benefits.length > 0) ? benefits : defaultBenefits;
          
          // Use default process if null or empty
          const finalProcess = dbService.process || defaultProcess;
          
          return {
            // Database data
            id: dbService.id,
            name: dbService.name,
            description: dbService.description || '',
            category: dbService.category || '',
            rate_usd: dbService.rate_usd,
            rate_inr: dbService.rate_inr,
            rate_eur: dbService.rate_eur || 0,
            duration: dbService.duration || 60,
            featured: dbService.featured || false,
            // UI fields from database - using hex colors directly
            slug: getSlug(dbService),
            title: dbService.name, // Use database name as title
            image: dbService.image || undefined,
            iconImage: dbService.icon_image || undefined,
            // Use hex colors from database, default to aqua if not set
            color: dbService.color || '#5AC8FA',
            gradientColor: dbService.gradient_color || '#5AC8FA20', // Hex with opacity
            textColor: dbService.text_color || '#5AC8FA',
            buttonColor: dbService.button_color || '#5AC8FA|#4AB3E6', // Main|Hover format
            icon: getIconFromName(dbService.icon_name),
            detailedDescription: dbService.detailed_description || dbService.description || undefined,
            benefits: finalBenefits,
            process: finalProcess,
            service_type: dbService.service_type || null,
            // Only format duration for retreats (includes duration, rates, location)
            retreatInfo: dbService.service_type === 'retreat' 
              ? formatRetreatInfo(
                  dbService.duration || 0, 
                  dbService.rate_inr || 0, 
                  dbService.rate_eur || 0, 
                  dbService.location
                )
              : undefined,
            formattedDuration: undefined // Deprecated, use retreatInfo instead
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