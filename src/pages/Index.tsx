
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import TopExpertsSection from '../components/TopTherapistsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FreeAssessmentCTA from '../components/FreeAssessmentCTA';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <Hero />
        <ServicesSection />
        <TopExpertsSection />
        <TestimonialsSection />
        <div className="container mx-auto py-16 flex justify-center">
          <FreeAssessmentCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
