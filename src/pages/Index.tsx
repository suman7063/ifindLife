
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import TopTherapistsSection from '@/components/TopTherapistsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import WhatWeDoSection from '@/components/WhatWeDoSection';
import BlogSection from '@/components/BlogSection';
import StayInTouchSection from '@/components/StayInTouchSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Services/Categories Section */}
        <ServicesSection />

        {/* Top Therapists Section */}
        <TopTherapistsSection />

        {/* Why Choose Us Section */}
        <WhyChooseUsSection />

        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* What We Do Section */}
        <WhatWeDoSection />
        
        {/* Blog Section */}
        <BlogSection />
        
        {/* Stay In Touch Section */}
        <StayInTouchSection />

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
