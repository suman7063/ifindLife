
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ServiceDetail from '@/components/services/ServiceDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  
  useEffect(() => {
    console.log('ServiceDetailPage component rendering');
    console.log('Service ID from URL params:', serviceId);
  }, [serviceId]);
  
  return (
    <>
      <Navbar />
      <ServiceDetail serviceId={serviceId} />
      <Footer />
    </>
  );
};

export default ServiceDetailPage;
