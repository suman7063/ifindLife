import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useUnifiedServices } from '@/hooks/useUnifiedServices';

interface RelatedService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
}

interface RelatedServicesProps {
  currentServiceId: string;
  color: string;
  relatedServices?: unknown; // This will be ignored as we use servicesData directly
}

const RelatedServices: React.FC<RelatedServicesProps> = ({
  currentServiceId,
  color
}) => {
  const { services } = useUnifiedServices();
  
  // Filter out current service by slug or ID
  const filteredServices = services.filter(s => {
    // Normalize both values for comparison
    const serviceSlug = (s.slug || '').toLowerCase().trim();
    const currentSlug = (currentServiceId || '').toLowerCase().trim();
    
    // Exclude current service - check slug and ID
    const isCurrentBySlug = serviceSlug === currentSlug && serviceSlug !== '';
    const isCurrentById = s.id.toString() === currentServiceId;
    
    const shouldExclude = isCurrentBySlug || isCurrentById;
    
    return !shouldExclude;
  });
  
  // Limit to 5 services (excluding current one)
  const displayServices = filteredServices.slice(0, 5);
  
  return (
    <Card className="border border-gray-200 overflow-hidden">
      <div className={`${color} h-2 w-full`}></div>
      <CardHeader>
        <CardTitle className="text-xl">Related Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayServices.length === 0 ? (
          <p className="text-sm text-gray-500">No related services available.</p>
        ) : (
          displayServices.map(relatedService => {
            const IconComponent = relatedService.icon;
            return (
              <div key={relatedService.id} className="flex items-start gap-3 group transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg">
                <div className={`p-2 rounded-full ${relatedService.color} flex-shrink-0 mt-1`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-base group-hover:${relatedService.textColor} truncate`}>
                    <Link to={`/services/${relatedService.slug}`} className="hover:underline">
                      {relatedService.name}
                    </Link>
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2">{relatedService.description}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedServices;
