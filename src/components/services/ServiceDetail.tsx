
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

// Import service data
import { servicesData } from './detail/servicesData';

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
  
  if (!serviceData) {
    return null;
  }
  
  // Handler for the inquiry button click
  const handleInquireClick = () => {
    setIsDialogOpen(true);
  };
  
  // Create the dialog trigger element for the CTA component
  const dialogTriggerElement = (
    <Button className={`w-full ${serviceData.buttonColor} text-lg py-6`}>
      Inquire Now
    </Button>
  );
  
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
      {isDialogOpen && (
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
            onSuccess={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      )}
    </div>
  );
};

export default ServiceDetail;
