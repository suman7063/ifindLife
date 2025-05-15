
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { useService } from '@/hooks/service/useService';

interface ServiceDetailProps {
  serviceId?: string | number;
  title?: string;
  description?: string;
  image?: string;
  rate?: number;
  duration?: string;
  category?: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = (props) => {
  const params = useParams<{ serviceId: string }>();
  const id = props.serviceId || params.serviceId;
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { getServiceById } = useService();

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Convert string id to number if needed
        const serviceId = typeof id === 'string' ? parseInt(id, 10) : id;
        const serviceData = await getServiceById(serviceId);
        if (serviceData) {
          setService(serviceData);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [id, getServiceById]);

  // Use props if available, otherwise use fetched service
  const title = props.title || service?.name || 'Service Title';
  const description = props.description || service?.description || 'Service description goes here...';
  const rate = props.rate || service?.rate_usd || 0;
  const imageUrl = props.image || service?.image || '/placeholder-service.jpg';
  
  if (loading && !props.title) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-36"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={imageUrl} 
              alt={title} 
              className="h-full w-full object-cover"
            />
          </div>
          <CardContent className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-gray-700 mb-6">{description}</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Duration: {props.duration || '60 minutes'}</li>
                <li>Category: {props.category || 'Wellness'}</li>
                <li>Price: ${rate}</li>
              </ul>
            </div>
            
            <div className="flex space-x-4">
              <Button>Book Now</Button>
              <Button variant="outline">Contact Expert</Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default ServiceDetail;
