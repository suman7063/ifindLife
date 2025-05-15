
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Service, Expert } from '@/types/service';
import BookingDialog from '@/components/booking/BookingDialog';
import { supabase } from '@/lib/supabase';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [relatedExperts, setRelatedExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  // Fetch service data
  const { data: serviceData, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      if (!id) throw new Error('Service ID is required');
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Service;
    },
    enabled: !!id
  });

  // Fetch experts for this service
  useEffect(() => {
    if (service?.id) {
      const fetchExperts = async () => {
        try {
          const { data, error } = await supabase
            .from('experts')
            .select('*')
            .contains('selected_services', [service.id]);
            
          if (error) {
            console.error('Error fetching experts:', error);
            return;
          }
          
          if (data && Array.isArray(data)) {
            setRelatedExperts(data as Expert[]);
          }
        } catch (err) {
          console.error('Error fetching experts:', err);
        }
      };
      
      fetchExperts();
    }
  }, [service?.id]);

  // Update service state when data changes
  useEffect(() => {
    if (serviceData) {
      setService(serviceData);
    }
  }, [serviceData]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Service Not Found</h2>
          <p className="text-gray-500 mb-4">The service you're looking for doesn't exist or has been removed.</p>
          <Button variant="outline" onClick={() => navigate('/services')}>
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Button variant="outline" className="mb-6" onClick={() => navigate('/services')}>
        ← Back to Services
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
          <p className="text-gray-600 mb-6">{service.description}</p>
          
          <h2 className="text-xl font-semibold mb-2">Service Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Price (USD)</p>
              <p className="font-medium">${service.rate_usd}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price (INR)</p>
              <p className="font-medium">₹{service.rate_inr}</p>
            </div>
            {service.duration && (
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{service.duration} minutes</p>
              </div>
            )}
            {service.category && (
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{service.category}</p>
              </div>
            )}
          </div>
          
          <Button 
            className="w-full mb-8" 
            onClick={() => setIsBookingOpen(true)}
          >
            Book this Service
          </Button>
          
          <Separator className="my-8" />
          
          {relatedExperts.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Available Experts</h2>
              <div className="grid grid-cols-1 gap-4">
                {relatedExperts.map((expert) => (
                  <Card key={expert.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                          {expert.profile_picture ? (
                            <img 
                              src={expert.profile_picture} 
                              alt={expert.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-gray-500">{expert.name.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{expert.name}</h3>
                          <p className="text-sm text-gray-500">{expert.specialization || "Expert"}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedExpert(expert);
                            setIsBookingOpen(true);
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Book this Service</h3>
              <p className="text-sm text-gray-500 mb-4">
                Connect with our qualified experts and get the help you need.
              </p>
              <Button 
                className="w-full" 
                onClick={() => setIsBookingOpen(true)}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {isBookingOpen && service && (
        <BookingDialog
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedExpert(null);
          }}
          service={service}
          expert={selectedExpert || undefined}
        />
      )}
    </div>
  );
};

export default ServiceDetail;
