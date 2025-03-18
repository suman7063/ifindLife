
import React from 'react';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import TopExpertsSection from '../components/TopTherapistsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FreeAssessmentCTA from '../components/FreeAssessmentCTA';

const Index: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <Hero />
      <ServicesSection />
      <TopExpertsSection />
      <TestimonialsSection />
      <FreeAssessmentCTA />
    </div>
  );
};

export default Index;
