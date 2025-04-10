import React from 'react';
import { Expert } from '@/types/expert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Star, PhoneCall, Calendar } from 'lucide-react';

interface ExpertsGridProps {
  experts: Expert[];
  onResetFilters: () => void;
}

const ExpertsGrid: React.FC<ExpertsGridProps> = ({ experts, onResetFilters }) => {
  const navigate = useNavigate();
  
  if (!experts.length) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-gray-700">No experts found</h3>
        <p className="text-gray-500 mt-2 mb-6">Try adjusting your filters to find more experts</p>
        <Button onClick={onResetFilters}>Reset Filters</Button>
      </div>
    );
  }
  
  const handleViewProfile = (expertId: string | number) => {
    navigate(`/experts/${expertId}`);
  };
  
  const handleCallNow = (e: React.MouseEvent, expertId: string | number) => {
    e.stopPropagation();
    navigate(`/experts/${expertId}?call=true`);
  };
  
  const handleBookAppointment = (e: React.MouseEvent, expertId: string | number) => {
    e.stopPropagation();
    navigate(`/experts/${expertId}?book=true`);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experts.map((expert) => {
        // Extract specialties from specialization or default to empty array
        const specialtiesArray = expert.specialization ? [expert.specialization] : [];
        
        // Get price from expert.pricing if it exists, otherwise use default
        const expertPrice = expert.price_per_min || expert.pricing || 0;
        
        // Check online status from verified property
        const isOnline = expert.verified || false;
        
        return (
          <Card 
            key={expert.id}
            className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer border bg-card h-full"
            onClick={() => handleViewProfile(expert.id)}
          >
            <div className="relative">
              <img 
                src={expert.profile_picture || '/placeholder.svg'} 
                alt={expert.name}
                className="w-full h-40 object-cover"
              />
              {isOnline && (
                <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                  Online
                </Badge>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold">{expert.name}</h3>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="ml-1 text-sm text-foreground">{expert.average_rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">
                {expert.experience || '0'} years experience
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {specialtiesArray.slice(0, 2).map((specialty, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-secondary/10">
                    {specialty}
                  </Badge>
                ))}
                {specialtiesArray.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{specialtiesArray.length - 2}
                  </Badge>
                )}
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-muted-foreground">Available</span>
                <span className="font-medium text-sm">₹{expertPrice}/min</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  className="w-full flex items-center justify-center text-xs"
                  onClick={(e) => handleCallNow(e, expert.id)}
                  disabled={!isOnline}
                >
                  <PhoneCall className="h-3 w-3 mr-1" />
                  Call Now
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full flex items-center justify-center text-xs"
                  onClick={(e) => handleBookAppointment(e, expert.id)}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Book
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ExpertsGrid;
