
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Edit, Eye } from "lucide-react";
import { Expert } from './types';

interface ApprovedExpertsListProps {
  experts: Expert[];
  onEditExpert?: (expert: Expert) => void;
  onViewDetails?: (expert: Expert) => void;
}

const ApprovedExpertsList: React.FC<ApprovedExpertsListProps> = ({
  experts,
  onEditExpert,
  onViewDetails
}) => {
  // Filter only approved experts
  const approvedExperts = experts.filter(expert => 
    expert.status === 'approved' || expert.status === undefined // undefined means approved in the legacy system
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Approved Experts ({approvedExperts.length})</span>
          <Badge variant="secondary">{approvedExperts.length} Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {approvedExperts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No approved experts found
          </div>
        ) : (
          <div className="space-y-4">
            {approvedExperts.map((expert, index) => (
              <div key={expert.auth_id || `approved-${index}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={expert.imageUrl} alt={expert.name} />
                    <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{expert.name}</h3>
                      {expert.online && <Badge variant="default" className="bg-green-500">Online</Badge>}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{expert.rating || 'N/A'}</span>
                        <span>({expert.consultations || 0} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{expert.experience} years exp.</span>
                      </div>
                      {expert.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{expert.city}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {expert.specialties && expert.specialties.slice(0, 3).map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {expert.specialties && expert.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{expert.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      ${expert.price || 30}/session
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {expert.waitTime || 'Available'}
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

export default ApprovedExpertsList;
