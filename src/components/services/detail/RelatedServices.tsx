
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
  relatedServices: RelatedService[];
}

const RelatedServices: React.FC<RelatedServicesProps> = ({
  currentServiceId,
  color,
  relatedServices
}) => {
  return (
    <Card className="border border-gray-200 overflow-hidden">
      <div className={`${color} h-2 w-full`}></div>
      <CardHeader>
        <CardTitle className="text-xl">Related Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {relatedServices
          .filter(s => s.id !== currentServiceId)
          .slice(0, 3)
          .map(relatedService => (
            <div key={relatedService.id} className="flex items-center gap-4 group transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg">
              <div className={`p-3 rounded-full ${relatedService.color}`}>
                {relatedService.icon}
              </div>
              <div>
                <h4 className={`font-medium text-lg group-hover:${relatedService.textColor}`}>
                  <Link to={`/services/${relatedService.id}`} className="hover:underline">
                    {relatedService.title}
                  </Link>
                </h4>
                <p className="text-sm text-gray-500 truncate">{relatedService.description.substring(0, 60)}...</p>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default RelatedServices;
