
import React from 'react';
import { useParams } from 'react-router-dom';
import ServiceDetail from '@/components/services/ServiceDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ServiceDetailPage: React.FC = () => {
  console.log('ServiceDetailPage component rendering');
  const { serviceId } = useParams<{ serviceId: string }>();
  console.log('Service ID from URL params:', serviceId);
  
  return (
    <>
      <Navbar />
      <ServiceDetail />
      <Footer />
    </>
  );
};

export default ServiceDetailPage;
