
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
    <div>
      <h2 className="text-2xl font-bold mb-8 text-center">Explore Other Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData
          .filter(s => s.id !== currentServiceId)
          .slice(0, 3) // Show only 3 related services
          .map(relatedService => (
            <Card key={relatedService.id} className="border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className={`${relatedService.color} h-2 w-full`}></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-full ${relatedService.color} flex-shrink-0`}>
                    {relatedService.icon}
                  </div>
                  <h3 className={`font-semibold text-lg ${relatedService.textColor} group-hover:${relatedService.textColor}`}>
                    <Link to={`/services/${relatedService.id}`} className="hover:underline">
                      {relatedService.title}
                    </Link>
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{relatedService.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{relatedService.duration}</span>
                  <Link to={`/services/${relatedService.id}`}>
                    <button className={`${relatedService.buttonColor} text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity`}>
                      Learn More
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default RelatedServices;
