
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { servicesData } from '@/components/services/detail/servicesData';
import ServiceHero from '@/components/services/detail/ServiceHero';
import ServiceDetailContent from '@/components/services/detail/ServiceDetailContent';
import BookingDialog from '@/components/services/detail/BookingDialog';

const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  
  // Find the service data from our predefined services
  const serviceData = servicesData.find(service => service.id === serviceId);
  
  useEffect(() => {
    console.log('ServiceDetailPage component rendering');
    console.log('Service ID from URL params:', serviceId);
    console.log('Found service data:', serviceData);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [serviceId, serviceData]);
  
  const handleBookNowClick = () => {
    setIsBookingDialogOpen(true);
  };
  
  // If service not found, render a placeholder
  if (!serviceData) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-20 px-4">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <p className="text-gray-700 text-justify">The service you're looking for could not be found.</p>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      
      {/* Hero Section with Cover Image */}
      <ServiceHero 
        title={serviceData.title}
        image={serviceData.image}
        description={serviceData.description}
        buttonColor={serviceData.buttonColor}
        onInquireClick={handleBookNowClick}
      />
      
      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <ServiceDetailContent 
          serviceId={serviceId || ''}
          serviceData={serviceData}
          onBookNowClick={handleBookNowClick}
        />
      </div>
      
      {/* Booking Dialog */}
      <BookingDialog 
        open={isBookingDialogOpen} 
        onOpenChange={setIsBookingDialogOpen}
        serviceTitle={serviceData.title}
        serviceType="service"
      />
      
      <Footer />
    </>
  );
};

export default ServiceDetailPage;
