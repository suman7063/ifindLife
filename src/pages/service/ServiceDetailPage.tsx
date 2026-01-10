
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useUnifiedServices } from '@/hooks/useUnifiedServices';
import { getDatabaseIdBySlug, getServiceBySlug as getStaticServiceBySlug, SERVICE_FRONTEND_MAP } from '@/data/unifiedServicesData';
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
    
    console.log('🔍 Looking for service with ID/slug:', serviceId);
    
    // If services are loaded, try to find in database first
    if (!loading && services.length > 0) {
      console.log('📊 Available services:', services.map(s => ({ id: s.id, slug: s.slug, name: s.name })));
      
      // Try to find by slug first
      let service = getServiceBySlug(serviceId);
      
      // If not found by slug, try by database ID (for backward compatibility)
      if (!service) {
        const numericId = parseInt(serviceId);
        if (!isNaN(numericId)) {
          service = getServiceById(numericId);
        }
      }
      
      if (service) {
        console.log('✅ Found service in database:', service);
        return service;
      }
    }
    
    // If not found in database (or database not loaded), try using static data as fallback
    console.log('⚠️ Service not found in database, trying static data...');
    const staticService = getStaticServiceBySlug(serviceId);
    if (staticService) {
      console.log('✅ Found service in static data:', staticService);
      // Try to find the database service by the database ID from static data
      const dbId = getDatabaseIdBySlug(serviceId);
      if (dbId) {
        // If services are loaded, try to get from database
        if (!loading && services.length > 0) {
          const dbService = getServiceById(dbId);
          if (dbService) {
            // Merge static frontend data with database data
            console.log('✅ Merging static and database data');
            return {
              ...dbService,
              slug: staticService.slug,
              image: staticService.image,
              color: staticService.color,
              gradientColor: staticService.gradientColor,
              textColor: staticService.textColor,
              buttonColor: staticService.buttonColor,
              icon: staticService.icon,
              detailedDescription: staticService.detailedDescription,
              benefits: staticService.benefits,
              process: staticService.process,
            };
          }
        }
        
        // Database service not found, but we have static data - create a service object from static data
        // This handles cases where the service exists in frontend but not yet in database
        console.log('⚠️ Database service not found, creating from static data only');
        return {
          id: dbId,
          name: staticService.title,
          description: staticService.description,
          category: 'wellness',
          rate_usd: 0,
          rate_inr: 0,
          rate_eur: 0,
          duration: 50,
          featured: false,
          slug: staticService.slug,
          image: staticService.image,
          color: staticService.color,
          gradientColor: staticService.gradientColor,
          textColor: staticService.textColor,
          buttonColor: staticService.buttonColor,
          icon: staticService.icon,
          detailedDescription: staticService.detailedDescription,
          benefits: staticService.benefits,
          process: staticService.process,
          formattedDuration: staticService.title.includes('Retreat') ? 'Weekend (2-3 days) to week-long retreats' : 
                            staticService.title.includes('Heart2Heart') ? '45-minute sessions' :
                            '50-minute sessions'
        };
      }
    }
    
    console.error('❌ Service not found in database or static data:', serviceId);
    return null;
  }, [serviceId, services, loading, getServiceById, getServiceBySlug]);
  
  useEffect(() => {
    console.log('ServiceDetailPage component rendering with unified services');
    console.log('Service ID from URL params:', serviceId);
    console.log('Loading state:', loading);
    console.log('Services count:', services.length);
    console.log('Found service data:', serviceData);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [serviceId, serviceData, loading, services.length]);
  
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
  if (!serviceData && !loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <p className="text-gray-700 mb-6">The service you're looking for could not be found.</p>
          <p className="text-sm text-gray-500 mb-8">Service ID/Slug: {serviceId}</p>
          <Link to="/services" className="inline-block">
            <Button className="bg-ifind-purple hover:bg-ifind-purple/90 text-white">
              View All Services
            </Button>
          </Link>
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
