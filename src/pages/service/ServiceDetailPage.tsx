
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUnifiedServices } from '@/hooks/useUnifiedServices';
import { getDatabaseIdBySlug } from '@/data/unifiedServicesData';
import ServiceHero from '@/components/services/detail/ServiceHero';
import ServiceDetailContent from '@/components/services/detail/ServiceDetailContent';
import ProtectedBookingDialog from '@/components/services/detail/ProtectedBookingDialog';

const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const { services, loading, getServiceById, getServiceBySlug } = useUnifiedServices();
  
  // Find service by slug or database ID (backward compatibility)
  const serviceData = React.useMemo(() => {
    if (!serviceId) return null;
    
    // Try to find by slug first
    let service = getServiceBySlug(serviceId);
    
    // If not found by slug, try by database ID (for backward compatibility)
    if (!service) {
      const numericId = parseInt(serviceId);
      if (!isNaN(numericId)) {
        service = getServiceById(numericId);
      }
    }
    
    return service;
  }, [serviceId, services, getServiceById, getServiceBySlug]);
  
  useEffect(() => {
    console.log('ServiceDetailPage component rendering with unified services');
    console.log('Service ID from URL params:', serviceId);
    console.log('Found service data:', serviceData);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [serviceId, serviceData]);
  
  const handleBookNowClick = () => {
    console.log('🔒 Book now clicked - starting protected booking flow');
    setIsBookingDialogOpen(true);
  };
  
  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-20 px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-ifind-aqua"></div>
          <p className="mt-2 text-gray-600">Loading service...</p>
        </div>
        <Footer />
      </>
    );
  }

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
        title={serviceData.name}
        image={serviceData.image}
        description={serviceData.description}
        buttonColor={serviceData.buttonColor}
        onInquireClick={handleBookNowClick}
      />
      
      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <ServiceDetailContent 
          serviceId={serviceData.id.toString()}
          serviceData={serviceData}
          onBookNowClick={handleBookNowClick}
        />
      </div>
      
      {/* Protected Booking Dialog */}
      <ProtectedBookingDialog 
        open={isBookingDialogOpen} 
        onOpenChange={setIsBookingDialogOpen}
        serviceTitle={serviceData.name}
        serviceId={serviceData.id.toString()}
        serviceType="service"
      />
      
      <Footer />
    </>
  );
};

export default ServiceDetailPage;
