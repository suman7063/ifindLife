import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  SlidersHorizontal,
  X,
  Heart,
  Video,
  Phone
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ExpertCardSimplified from '@/components/expert-card/ExpertCardSimplified';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Expert {
  id: string;
  name: string;
  email: string;
  profile_picture?: string;
  specialization?: string;
  bio?: string;
  experience?: string;
  average_rating?: number;
  reviews_count?: number;
  selected_services?: number[];
}

interface Service {
  id: number;
  name: string;
  category?: string;
}

interface SearchFilters {
  searchTerm: string;
  specialization: string;
  priceRange: [number, number];
  rating: number;
  availability: string;
  experience: string;
  service: string;
}

export const EnhancedExpertSearch: React.FC = () => {
  const { user } = useAuth();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    specialization: '',
    priceRange: [0, 200],
    rating: 0,
    availability: '',
    experience: '',
    service: ''
  });

  const specializations = [
    'Life Coaching',
    'Career Counseling',
    'Relationship Therapy',
    'Stress Management',
    'Mindfulness',
    'Nutrition',
    'Fitness',
    'Mental Health',
    'Spiritual Guidance',
    'Financial Planning'
  ];

  useEffect(() => {
    fetchExperts();
    fetchServices();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchExperts = async () => {
    try {
      // Fetch experts without selected_services field
      const { data: expertsData, error: expertsError } = await supabase
        .from('expert_accounts')
        .select(`
          auth_id,
          name,
          email,
          profile_picture,
          specialization,
          bio,
          experience,
          average_rating,
          reviews_count
        `)
        .eq('status', 'approved')
        .order('average_rating', { ascending: false });

      if (expertsError) throw expertsError;

      // Fetch services for each expert from expert_service_specializations
      if (expertsData && expertsData.length > 0) {
        const expertIds = expertsData.map(e => e.auth_id);
        const { data: specializationsData, error: specError } = await supabase
          .from('expert_service_specializations')
          .select('expert_id, service_id')
          .in('expert_id', expertIds);

        if (specError) {
          console.error('Error fetching specializations:', specError);
        }

        // Map services to experts
        const expertsWithServices = expertsData.map(expert => {
          const services = specializationsData
            ?.filter(s => s.expert_id === expert.auth_id)
            .map(s => s.service_id) || [];
          
          return {
            ...expert,
            selected_services: services
          };
        });

        setExperts(expertsWithServices);
      } else {
        setExperts([]);
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
      toast.error('Failed to load experts');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, category')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('expert_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.expert_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (expertId: string) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    const isFavorite = favorites.includes(expertId);
    
    try {
      if (isFavorite) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('expert_id', expertId);
        
        setFavorites(prev => prev.filter(id => id !== expertId));
        toast.success('Removed from favorites');
      } else {
        await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, expert_id: expertId });
        
        setFavorites(prev => [...prev, expertId]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const filteredExperts = useMemo(() => {
    return experts.filter(expert => {
      // Search term filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        if (
          !expert.name.toLowerCase().includes(searchTerm) &&
          !expert.specialization?.toLowerCase().includes(searchTerm) &&
          !expert.bio?.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      // Specialization filter
      if (filters.specialization && expert.specialization !== filters.specialization) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && (expert.average_rating || 0) < filters.rating) {
        return false;
      }

      // Experience filter
      if (filters.experience) {
        const experienceYears = parseInt(expert.experience || '0');
        switch (filters.experience) {
          case 'entry':
            if (experienceYears >= 3) return false;
            break;
          case 'mid':
            if (experienceYears < 3 || experienceYears >= 8) return false;
            break;
          case 'senior':
            if (experienceYears < 8) return false;
            break;
        }
      }

      // Service filter
      if (filters.service) {
        const serviceId = parseInt(filters.service);
        if (!expert.selected_services?.includes(serviceId)) {
          return false;
        }
      }

      return true;
    });
  }, [experts, filters]);

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      specialization: '',
      priceRange: [0, 200],
      rating: 0,
      availability: '',
      experience: '',
      service: ''
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.specialization) count++;
    if (filters.rating > 0) count++;
    if (filters.experience) count++;
    if (filters.service) count++;
    return count;
  }, [filters]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Find Your Perfect Expert</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with certified wellness experts who can guide you on your journey to better health and happiness
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialization, or expertise..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="pl-10 h-12"
          />
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Specialization</label>
                <Select 
                  value={filters.specialization} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, specialization: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any specialization</SelectItem>
                    {specializations.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Service</label>
                <Select 
                  value={filters.service} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, service: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any service</SelectItem>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Experience Level</label>
                <Select 
                  value={filters.experience} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any experience</SelectItem>
                    <SelectItem value="entry">Entry (0-3 years)</SelectItem>
                    <SelectItem value="mid">Mid-level (3-8 years)</SelectItem>
                    <SelectItem value="senior">Senior (8+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                <Select 
                  value={filters.rating.toString()} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, rating: parseFloat(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.8">4.8+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''} found
                </p>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {filteredExperts.length} Expert{filteredExperts.length !== 1 ? 's' : ''} Available
          </h2>
          <Select defaultValue="rating">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="experience">Most Experienced</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredExperts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No experts found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map(expert => (
              <div key={expert.auth_id || `expert-${expert.email}`} className="relative">
                <ExpertCardSimplified
                  expert={{
                    id: expert.auth_id,
                    name: expert.name,
                    profilePicture: expert.profile_picture,
                    specialization: expert.specialization || 'Wellness Expert',
                    experience: parseInt(expert.experience || '0'),
                    averageRating: expert.average_rating || 0,
                    reviewsCount: expert.reviews_count || 0,
                    price: 50, // This should come from pricing data
                    verified: true,
                    status: 'online',
                    waitTime: 'Available Now',
                    pricing_set: false,
                    availability_set: false
                  }}
                  onConnectNow={(type) => {
                    console.log(`Connecting to ${expert.name} via ${type}`);
                  }}
                  onClick={() => {
                    console.log(`Viewing ${expert.name}'s profile`);
                  }}
                />

                {/* Favorite Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(expert.auth_id);
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      favorites.includes(expert.auth_id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-500'
                    }`} 
                  />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      {filteredExperts.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our experts are here to support you every step of the way. Book a session today and take the first step towards a better you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Book Video Call
              </Button>
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Book Voice Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};