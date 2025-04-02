
import React from 'react';
import { useParams } from 'react-router-dom';
import ServiceDetail from '@/components/services/ServiceDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ServiceDetailPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <ServiceDetail />
      <Footer />
    </>
  );
};

export default ServiceDetailPage;
