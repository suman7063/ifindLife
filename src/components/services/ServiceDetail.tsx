
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import { toast } from 'sonner';

// Import refactored components
import ServiceHero from './detail/ServiceHero';
import ServiceDetailContent from './detail/ServiceDetailContent';
import InquiryDialog from './detail/InquiryDialog';
import BookingDialog from './detail/BookingDialog';
import { useExpertMatching } from './detail/useExpertMatching';

// Import service data
import { servicesData } from './detail/servicesData';

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [isInquiryDialogOpen, setIsInquiryDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  
  // Get authentication state for the inquiry form
  const { isAuthenticated, currentUser } = useAuthSynchronization();
  
  // Find the service data based on the URL parameter
  const serviceData = servicesData.find(service => service.id === serviceId);
  
  // Use the expert matching hook
  const { matchingExperts, selectedExpert, setSelectedExpert } = useExpertMatching(serviceData);
  
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
    setIsInquiryDialogOpen(true);
  };
  
  // Handler for the book now button click
  const handleBookNowClick = () => {
    console.log("Book Now button clicked");
    
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
  
  // Handler for the back to services button to ensure scrolling to top
  const handleBackToServices = () => {
    navigate('/services');
    window.scrollTo(0, 0);
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
      <ServiceDetailContent 
        serviceId={serviceId as string}
        serviceData={serviceData}
        dialogTriggerElement={dialogTriggerElement}
        onBookNowClick={handleBookNowClick}
      />
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBackToServices} className="px-6">
          Back to Services
        </Button>
      </div>
      
      {/* Dialogs */}
      <InquiryDialog 
        isOpen={isInquiryDialogOpen}
        onOpenChange={setIsInquiryDialogOpen}
        serviceName={serviceData.title}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onSuccess={() => setIsInquiryDialogOpen(false)}
      />
      
      <BookingDialog 
        isOpen={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        serviceName={serviceData.title}
        matchingExperts={matchingExperts}
        selectedExpert={selectedExpert}
        setSelectedExpert={setSelectedExpert}
        onBookingComplete={handleBookingComplete}
      />
    </div>
  );
};

export default ServiceDetail;
