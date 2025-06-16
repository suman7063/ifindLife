
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';

const Experts = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Experts</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with qualified professionals who are here to support your wellness journey.
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-8">
              Our expert directory is currently being updated. Please check back soon to browse and connect with our qualified professionals.
            </p>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Experts;
