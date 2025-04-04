
import React from 'react';
import { Expert } from '@/types/expert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

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
  
  const viewExpertProfile = (expertId: string | number) => {
    navigate(`/experts/${expertId}`);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experts.map((expert) => (
        <Card key={expert.id} className="overflow-hidden">
          <div className="aspect-square relative overflow-hidden">
            <img 
              src={expert.profile_picture || '/placeholder-profile.jpg'} 
              alt={expert.name} 
              className="w-full h-full object-cover"
            />
            {expert.verified && (
              <Badge className="absolute top-3 right-3 bg-green-500">Verified</Badge>
            )}
          </div>
          
          <CardHeader>
            <div>
              <h3 className="text-lg font-medium">{expert.name}</h3>
              <p className="text-muted-foreground text-sm">{expert.specialization || 'Specialist'}</p>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center mb-2">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
              <span className="text-sm font-medium">
                {expert.average_rating ? expert.average_rating.toFixed(1) : '0.0'}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                ({expert.reviews_count || 0} reviews)
              </span>
            </div>
            
            <div className="text-sm">
              <p className="truncate">{expert.experience || 'Experience not specified'}</p>
              <p className="mt-1 font-medium">
                {formatCurrency(1500, 'INR')} per session
              </p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => viewExpertProfile(expert.id)}
            >
              View Profile
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ExpertsGrid;
