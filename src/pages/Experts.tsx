
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExpertsGrid from '@/components/experts/ExpertsGrid';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Expert, ExpertFilterParams } from '@/types/expert';

const ExpertsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ExpertFilterParams>({});
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const mockExperts: Expert[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      experience: 8,
      specialties: ["Anxiety", "Depression", "Relationships"],
      rating: 4.9,
      consultations: 243,
      price: 85,
      waitTime: "2-3 days",
      imageUrl: "https://randomuser.me/api/portraits/women/54.jpg",
      online: true,
      languages: ["English", "Spanish"]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "michael.chen@example.com",
      experience: 12,
      specialties: ["Trauma", "PTSD", "Anxiety"],
      rating: 4.8,
      consultations: 349,
      price: 95,
      waitTime: "1-2 days",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      online: true,
      languages: ["English", "Mandarin"]
    },
    {
      id: 3,
      name: "Dr. Olivia Rodriguez",
      email: "olivia.rodriguez@example.com",
      experience: 6,
      specialties: ["Couples Therapy", "Family Counseling"],
      rating: 4.7,
      consultations: 187,
      price: 75,
      waitTime: "Same day",
      imageUrl: "https://randomuser.me/api/portraits/women/25.jpg",
      online: true,
      languages: ["English", "Spanish", "Portuguese"]
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      email: "james.wilson@example.com",
      experience: 15,
      specialties: ["Addiction", "Substance Abuse", "Recovery"],
      rating: 4.9,
      consultations: 412,
      price: 100,
      waitTime: "3-4 days",
      imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      online: true,
      languages: ["English", "French"]
    },
    {
      id: 5,
      name: "Dr. Emily Patel",
      email: "emily.patel@example.com",
      experience: 9,
      specialties: ["Child Psychology", "ADHD", "Autism"],
      rating: 4.8,
      consultations: 256,
      price: 90,
      waitTime: "2 days",
      imageUrl: "https://randomuser.me/api/portraits/women/37.jpg",
      online: true,
      languages: ["English", "Hindi", "Gujarati"]
    },
    {
      id: 6,
      name: "Dr. Robert Kim",
      email: "robert.kim@example.com",
      experience: 11,
      specialties: ["Stress Management", "Work-Life Balance", "Burnout"],
      rating: 4.6,
      consultations: 198,
      price: 80,
      waitTime: "1-2 days",
      imageUrl: "https://randomuser.me/api/portraits/men/52.jpg",
      online: true,
      languages: ["English", "Korean"]
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setExperts(mockExperts);
      setFilteredExperts(mockExperts);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, experts]);

  const applyFilters = () => {
    let filtered = [...experts];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expert => 
        expert.name.toLowerCase().includes(query) || 
        expert.specialties?.some(s => s.toLowerCase().includes(query))
      );
    }

    // Apply specialty filter
    if (filters.specialty) {
      filtered = filtered.filter(expert => 
        expert.specialties?.some(s => 
          s.toLowerCase() === filters.specialty?.toLowerCase()
        )
      );
    }

    // Apply rating filter
    if (filters.rating) {
      const ratingValue = Number(filters.rating);
      filtered = filtered.filter(expert => 
        (expert.rating || 0) >= ratingValue
      );
    }

    // Apply price filter
    if (filters.price) {
      const [min, max] = priceRange;
      filtered = filtered.filter(expert => 
        (expert.price || 0) >= min && 
        (expert.price || 0) <= max
      );
    }

    // Apply language filter
    if (filters.language) {
      filtered = filtered.filter(expert => 
        expert.languages?.some(l => 
          l.toLowerCase() === filters.language?.toLowerCase()
        )
      );
    }

    // Apply sort
    if (filters.sort) {
      switch (filters.sort) {
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'experience':
          filtered.sort((a, b) => {
            const expA = typeof a.experience === 'string' ? parseInt(a.experience) : a.experience;
            const expB = typeof b.experience === 'string' ? parseInt(b.experience) : b.experience;
            return Number(expB) - Number(expA);
          });
          break;
        case 'price':
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    setFilteredExperts(filtered);
  };

  const handleFilterChange = (key: keyof ExpertFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPriceRange([0, 200]);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input 
                  id="search" 
                  placeholder="Search experts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Separator />

              {/* Specialty */}
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Select
                  value={filters.specialty || ''}
                  onValueChange={(value) => handleFilterChange('specialty', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="Anxiety">Anxiety</SelectItem>
                    <SelectItem value="Depression">Depression</SelectItem>
                    <SelectItem value="Relationships">Relationships</SelectItem>
                    <SelectItem value="Trauma">Trauma</SelectItem>
                    <SelectItem value="PTSD">PTSD</SelectItem>
                    <SelectItem value="Addiction">Addiction</SelectItem>
                    <SelectItem value="Child Psychology">Child Psychology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Select
                  value={filters.rating?.toString() || ''}
                  onValueChange={(value) => handleFilterChange('rating', value ? Number(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select minimum rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="4.5">4.5+</SelectItem>
                    <SelectItem value="4.0">4.0+</SelectItem>
                    <SelectItem value="3.5">3.5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Price Range</Label>
                  <span className="text-sm text-gray-500">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  min={0}
                  max={200}
                  step={5}
                  onValueChange={(value) => {
                    setPriceRange(value as [number, number]);
                    handleFilterChange('price', 'custom');
                  }}
                />
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={filters.language || ''}
                  onValueChange={(value) => handleFilterChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="Mandarin">Mandarin</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Korean">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={filters.sort || ''}
                  onValueChange={(value) => handleFilterChange('sort', value as 'rating' | 'experience' | 'price' | 'name')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="price">Lowest Price</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Expert Counselors</h1>
            <p className="text-gray-600 mt-2">
              Connect with licensed professionals ready to help you navigate life's challenges
            </p>
          </div>

          <ExpertsGrid experts={filteredExperts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ExpertsPage;
