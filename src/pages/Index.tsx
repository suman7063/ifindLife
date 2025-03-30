
import React, { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load non-critical components
const TopTherapistsSection = lazy(() => import('@/components/TopTherapistsSection'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const WhyChooseUsSection = lazy(() => import('@/components/WhyChooseUsSection'));
const CTASection = lazy(() => import('@/components/CTASection'));
const Footer = lazy(() => import('@/components/Footer'));
const WhatWeDoSection = lazy(() => import('@/components/WhatWeDoSection'));
const BlogSection = lazy(() => import('@/components/BlogSection'));
const StayInTouchSection = lazy(() => import('@/components/StayInTouchSection'));

// Loading fallback component
const SectionLoadingFallback = () => (
  <div className="w-full py-12">
    <div className="container">
      <Skeleton className="w-full h-8 mb-4 rounded-lg" />
      <Skeleton className="w-3/4 h-4 mb-8 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full h-48 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Services/Categories Section - Critical for first impression */}
        <ServicesSection />

        {/* Lazy load the rest of the components */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <TopTherapistsSection />
        </Suspense>

        <Suspense fallback={<SectionLoadingFallback />}>
          <WhyChooseUsSection />
        </Suspense>

        <Suspense fallback={<SectionLoadingFallback />}>
          <TestimonialsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoadingFallback />}>
          <WhatWeDoSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoadingFallback />}>
          <BlogSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoadingFallback />}>
          <StayInTouchSection />
        </Suspense>

        <Suspense fallback={<SectionLoadingFallback />}>
          <CTASection />
        </Suspense>
      </main>

      <Suspense fallback={<div className="h-40 bg-gray-100" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
