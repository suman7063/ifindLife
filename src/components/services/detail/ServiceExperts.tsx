import React from 'react';
import { useExpertData } from '@/hooks/useExpertData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, User, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceExpertsProps {
  serviceId: string;
  serviceData: {
    color: string;
    textColor: string;
    buttonColor: string;
    gradientColor: string;
    title: string;
  };
}

const ServiceExperts: React.FC<ServiceExpertsProps> = ({ serviceId, serviceData }) => {
  const navigate = useNavigate();
  
  // Map service string IDs to database service IDs
  // Based on the experts' selected_services data (1, 2, 3, etc.)
  const serviceIdMap: Record<string, number> = {
    'mindful-listening': 1,
    'listening-with-guidance': 2,
    'therapy-sessions': 3,
    'guided-meditations': 4,
    'offline-retreats': 5,
    'life-coaching': 6
  };

  const mappedServiceId = serviceIdMap[serviceId];
  
  // Fetch experts for this service
  const { experts, loading } = useExpertData({ 
    serviceId: mappedServiceId ? mappedServiceId.toString() : undefined 
  });

  const handleExpertClick = (expertId: string) => {
    navigate(`/experts/${expertId}`);
  };

  const handleConnectClick = (expertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/experts/${expertId}?action=connect`);
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className={`h-5 w-5 ${serviceData.textColor}`} />
            <h3 className="text-xl font-semibold">Our Experts</h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!experts || experts.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className={`h-5 w-5 ${serviceData.textColor}`} />
            <h3 className="text-xl font-semibold">Our Experts</h3>
          </div>
          <p className="text-gray-600 text-center py-8">
            No experts are currently available for this service. Please check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <User className={`h-5 w-5 ${serviceData.textColor}`} />
          <h3 className="text-xl font-semibold">Our {serviceData.title} Experts</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experts.slice(0, 4).map((expert) => (
            <div
              key={expert.auth_id || `expert-${expert.email}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleExpertClick(expert.auth_id)}
            >
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={expert.profilePicture || '/placeholder-avatar.png'}
                    alt={expert.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {expert.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">{expert.name}</h4>
                    {expert.status === 'online' && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Online
                      </span>
                    )}
                  </div>
                  
                  {expert.specialization && (
                    <p className={`text-sm ${serviceData.textColor} font-medium`}>
                      {expert.specialization}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4">
                      {expert.averageRating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{expert.averageRating}</span>
                          {expert.reviewsCount > 0 && (
                            <span className="text-xs text-gray-500">({expert.reviewsCount})</span>
                          )}
                        </div>
                      )}
                      
                      {expert.experience > 0 && (
                        <span className="text-xs text-gray-500">
                          {expert.experience} years experience
                        </span>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      className={`${serviceData.buttonColor} text-white`}
                      onClick={(e) => handleConnectClick(expert.auth_id, e)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {experts.length > 4 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className={`${serviceData.textColor} border-current hover:bg-current hover:text-white`}
              onClick={() => navigate(`/experts?service=${serviceId}`)}
            >
              View All {experts.length} Experts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceExperts;