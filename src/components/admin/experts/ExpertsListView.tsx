import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Edit, Eye } from "lucide-react";
import { usePublicExpertsData } from '@/hooks/usePublicExpertsData';
import { ExpertCardData } from '@/components/expert-card/types';

interface ExpertsListViewProps {
  onEditExpert?: (expert: ExpertCardData) => void;
  onViewDetails?: (expert: ExpertCardData) => void;
}

const ExpertsListView: React.FC<ExpertsListViewProps> = ({
  onEditExpert,
  onViewDetails
}) => {
  const { experts, loading, error } = usePublicExpertsData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Experts...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Experts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Approved Experts ({experts.length})</span>
          <Badge variant="secondary">{experts.length} Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {experts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No approved experts found
          </div>
        ) : (
          <div className="space-y-4">
            {experts.map((expert) => (
              <div key={expert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={expert.profilePicture} alt={expert.name} />
                    <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{expert.name}</h3>
                      {expert.status === 'online' && <Badge variant="default" className="bg-green-500">Online</Badge>}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{expert.averageRating || 'N/A'}</span>
                        <span>({expert.reviewsCount || 0} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{expert.experience} years exp.</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {expert.specialization}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      ${expert.price}/session
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {expert.waitTime}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {onViewDetails && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewDetails(expert)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEditExpert && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditExpert(expert)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpertsListView;