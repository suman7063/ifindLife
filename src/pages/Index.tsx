
import React from 'react';
import SimpleNavbar from '@/components/SimpleNavbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import ExpertsSection from '@/components/home/ExpertsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ProgramsSection from '@/components/home/ProgramsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <SimpleNavbar />
      <HeroSection />
      <ServicesSection />
      <ExpertsSection />
      <TestimonialsSection />
      <ProgramsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
