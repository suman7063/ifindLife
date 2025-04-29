
import React from 'react';
import { UserProfile } from '@/types/supabase/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { Expert } from '@/types/expert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FavoritesSectionProps {
  user: UserProfile | null;
}

// Mock data for experts
const mockExperts: Expert[] = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    specialization: 'Clinical Psychologist',
    profile_picture: 'https://randomuser.me/api/portraits/women/44.jpg',
    experience: '10 years',
    average_rating: 4.9,
    reviews_count: 124
  },
  {
    id: '2',
    name: 'Dr. Michael Johnson',
    specialization: 'Relationship Counselor',
    profile_picture: 'https://randomuser.me/api/portraits/men/32.jpg',
    experience: '8 years',
    average_rating: 4.7,
    reviews_count: 98
  },
  {
    id: '3',
    name: 'Dr. Sarah Williams',
    specialization: 'Career Guidance',
    profile_picture: 'https://randomuser.me/api/portraits/women/68.jpg',
    experience: '12 years',
    average_rating: 4.8,
    reviews_count: 156
  },
];

// Mock data for favorite services
const mockServices = [
  {
    id: '1',
    name: 'Stress Management Session',
    provider: 'Dr. Jane Smith',
    duration: '60 min',
    price: 75
  },
  {
    id: '2',
    name: 'Career Counselling',
    provider: 'Dr. Michael Johnson',
    duration: '45 min',
    price: 60
  },
  {
    id: '3',
    name: 'Relationship Therapy',
    provider: 'Dr. Sarah Williams',
    duration: '90 min',
    price: 120
  },
];

const ExpertCard: React.FC<{ expert: Expert }> = ({ expert }) => {
  const removeFromFavorites = () => {
    toast.success(`${expert.name} removed from favorites`);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={expert.profile_picture} alt={expert.name} />
            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold">{expert.name}</h3>
            <p className="text-sm text-muted-foreground">{expert.specialization}</p>
            
            <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                {expert.average_rating} ({expert.reviews_count} reviews)
              </Badge>
              
              <span className="text-xs text-muted-foreground">{expert.experience} experience</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Book Session
            </Button>
            
            <Button variant="outline" size="sm" onClick={removeFromFavorites}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
            
            <Button size="sm" variant="link" className="w-full">
              View Profile <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ServiceCard: React.FC<{ service: any }> = ({ service }) => {
  const removeFromFavorites = () => {
    toast.success(`${service.name} removed from favorites`);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <p className="text-sm text-muted-foreground">by {service.provider}</p>
            
            <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {service.duration}
              </Badge>
              
              <span className="text-sm font-medium">${service.price}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
            
            <Button variant="outline" size="sm" onClick={removeFromFavorites}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Favorites</h2>
        <p className="text-muted-foreground">
          Manage your favorite experts and services
        </p>
      </div>
      
      <Tabs defaultValue="experts">
        <TabsList>
          <TabsTrigger value="experts">Saved Experts ({mockExperts.length})</TabsTrigger>
          <TabsTrigger value="services">Favorite Services ({mockServices.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="experts">
          {mockExperts.length > 0 ? (
            <div className="space-y-4">
              {mockExperts.map(expert => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="py-6">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No saved experts</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any experts to your favorites yet.
                  </p>
                  <Button>Browse Experts</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="services">
          {mockServices.length > 0 ? (
            <div className="space-y-4">
              {mockServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="py-6">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorite services</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any services to your favorites yet.
                  </p>
                  <Button>Browse Services</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FavoritesSection;
