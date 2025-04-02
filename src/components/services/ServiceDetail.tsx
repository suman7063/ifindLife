
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import InquiryForm from './InquiryForm';
import { toast } from 'sonner';

// Import refactored components
import ServiceHero from './detail/ServiceHero';
import ServiceAbout from './detail/ServiceAbout';
import ServiceFAQ from './detail/ServiceFAQ';
import ServiceCTA from './detail/ServiceCTA';
import RelatedServices from './detail/RelatedServices';
import ServiceTestimonial from './detail/ServiceTestimonial';
import ExpertBookingCalendar from '../booking/ExpertBookingCalendar';

// Import service data
import { servicesData } from './detail/servicesData';
import { supabase } from '@/lib/supabase';

interface Expert {
  id: string;
  name: string;
  specialization?: string;
  status?: string;
  [key: string]: any;
}

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [isInquiryDialogOpen, setIsInquiryDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [matchingExperts, setMatchingExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  
  // Get authentication state for the inquiry form
  const { isAuthenticated, currentUser } = useAuthSynchronization();
  
  // Find the service data based on the URL parameter
  const serviceData = servicesData.find(service => service.id === serviceId);
  
  // Handle case where service is not found
  useEffect(() => {
    if (!serviceData && serviceId) {
      toast.error("Service not found");
      navigate('/services');
    }
  }, [serviceData, serviceId, navigate]);
  
  // Fetch matching experts when service changes
  useEffect(() => {
    const fetchMatchingExperts = async () => {
      if (!serviceData) return;
      
      try {
        // Match experts based on specialization that might include this service title or keywords
        const { data, error } = await supabase
          .from('experts')
          .select('*')
          .neq('status', 'inactive');
          
        if (error) throw error;
        
        // Filter experts that have specializations matching this service
        // This is a simple implementation - in a real app, you'd have a more robust matching system
        const serviceKeywords = serviceData.title.toLowerCase().split(' ');
        
        const filteredExperts = data?.filter(expert => {
          if (!expert.specialization) return false;
          
          // Convert specialization string to lowercase for case-insensitive comparison
          const expertSpecialization = expert.specialization.toLowerCase();
              
          return serviceKeywords.some(keyword => 
            expertSpecialization.includes(keyword.toLowerCase())
          );
        }) || [];
        
        setMatchingExperts(filteredExperts);
        
        // Set the first expert as selected by default if available
        if (filteredExperts.length > 0) {
          setSelectedExpert(filteredExperts[0]);
        }
      } catch (error) {
        console.error('Error fetching matching experts:', error);
      }
    };
    
    fetchMatchingExperts();
  }, [serviceData]);
  
  if (!serviceData) {
    return null;
  }
  
  // Handler for the inquiry button click
  const handleInquireClick = () => {
    setIsInquiryDialogOpen(true);
  };
  
  // Handler for the book now button click
  const handleBookNowClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a session");
      navigate('/login');
      return;
    }
    
    if (matchingExperts.length === 0) {
      toast.error("No experts are currently available for this service");
      return;
    }
    
    setIsBookingDialogOpen(true);
  };
  
  // Create the dialog trigger element for the CTA component
  const dialogTriggerElement = (
    <Button className={`w-full ${serviceData.buttonColor} text-lg py-6`} onClick={handleInquireClick}>
      Inquire Now
    </Button>
  );
  
  // Handle booking completion
  const handleBookingComplete = () => {
    setIsBookingDialogOpen(false);
    toast.success(`Booking completed with ${selectedExpert?.name || 'the expert'}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <ServiceHero 
        title={serviceData.title}
        description={serviceData.description}
        image={serviceData.image}
        buttonColor={serviceData.buttonColor}
        onInquireClick={handleInquireClick}
      />
      
      {/* Main Content Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          {/* About Service */}
          <ServiceAbout 
            title={serviceData.title}
            icon={serviceData.icon}
            textColor={serviceData.textColor}
            color={serviceData.color}
            gradientColor={serviceData.gradientColor}
            detailedDescription={serviceData.detailedDescription}
            benefits={serviceData.benefits}
            duration={serviceData.duration}
            process={serviceData.process}
          />
          
          {/* FAQ Section */}
          <ServiceFAQ color={serviceData.color} />
        </div>
        
        <div className="space-y-8">
          {/* Call to Action */}
          <ServiceCTA 
            title={serviceData.title}
            color={serviceData.color}
            textColor={serviceData.textColor}
            buttonColor={serviceData.buttonColor}
            gradientColor={serviceData.gradientColor}
            dialogTriggerElement={dialogTriggerElement}
            onBookNowClick={handleBookNowClick}
          />
          
          {/* Related Services */}
          <RelatedServices 
            currentServiceId={serviceId as string}
            color={serviceData.color}
            relatedServices={servicesData}
          />
          
          {/* Testimonial */}
          <ServiceTestimonial />
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/services')} className="px-6">
          Back to Services
        </Button>
      </div>
      
      {/* Inquiry Dialog */}
      <Dialog open={isInquiryDialogOpen} onOpenChange={setIsInquiryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Inquire about {serviceData.title}</DialogTitle>
            <DialogDescription>
              Please provide your information and we'll get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          <InquiryForm 
            serviceName={serviceData.title} 
            currentUser={currentUser} 
            isAuthenticated={isAuthenticated} 
            onSuccess={() => setIsInquiryDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Book a {serviceData.title} Session</DialogTitle>
            <DialogDescription>
              Select an expert and schedule your appointment.
            </DialogDescription>
          </DialogHeader>
          
          {matchingExperts.length > 0 ? (
            <div className="space-y-4">
              {matchingExperts.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Choose an Expert:</h3>
                  <div className="flex flex-wrap gap-2">
                    {matchingExperts.map(expert => (
                      <Button 
                        key={expert.id} 
                        variant={selectedExpert?.id === expert.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedExpert(expert)}
                      >
                        {expert.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedExpert && (
                <ExpertBookingCalendar 
                  expertId={selectedExpert.id.toString()} 
                  expertName={selectedExpert.name}
                  onBookingComplete={handleBookingComplete}
                />
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No experts are currently available for this service.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDetail;
