
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { servicesData } from './servicesData';

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
  relatedServices: any; // This will be ignored as we use servicesData directly
}

const RelatedServices: React.FC<RelatedServicesProps> = ({
  currentServiceId,
  color
}) => {
  return (
    <Card className="border border-gray-200 overflow-hidden">
      <div className={`${color} h-2 w-full`}></div>
      <CardHeader>
        <CardTitle className="text-xl">Related Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {servicesData
          .filter(s => s.id !== currentServiceId)
          .map(relatedService => (
            <div key={relatedService.id} className="flex items-start gap-3 group transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg">
              <div className={`p-2 rounded-full ${relatedService.color} flex-shrink-0 mt-1`}>
                {relatedService.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium text-base group-hover:${relatedService.textColor} truncate`}>
                  <Link to={`/services/${relatedService.id}`} className="hover:underline">
                    {relatedService.title}
                  </Link>
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">{relatedService.description}</p>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default RelatedServices;
