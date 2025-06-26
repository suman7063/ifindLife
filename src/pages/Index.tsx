import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ServicesSection from '@/components/ServicesSection';
import WhatWeDoSection from '@/components/WhatWeDoSection';
import { Skeleton } from '@/components/ui/skeleton';
import EnhancedHero from '@/components/hero/EnhancedHero';
import MindfulnessCommunitySection from '@/components/MindfulnessCommunitySection';
import IntroductionSection from '@/components/IntroductionSection';
import { lazy, Suspense } from 'react';
import HomepageIssueSessions from '@/components/HomepageIssueSessions';
import ExpertsOnlineSection from '@/components/ExpertsOnlineSection';
import Footer from '@/components/Footer';
import SimpleAuthTest from '@/components/debug/SimpleAuthTest';

// Lazy load non-critical components
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const WhyChooseUsSection = lazy(() => import('@/components/WhyChooseUsSection'));
const CTASection = lazy(() => import('@/components/CTASection'));
const BlogSection = lazy(() => import('@/components/BlogSection'));

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
  // Ensure page loads from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col home-page">
      <Navbar />
      
      {/* Temporary debug component */}
      <div className="container mx-auto px-4 py-4">
        <SimpleAuthTest />
      </div>
      
      <main className="flex-1">
        {/* Section 1: Hero Banner with enhanced slider and service cards */}
        <EnhancedHero />
        
        {/* Section 2: Introduction Section - Full Width with grey background */}
        <div className="full-width-section bg-gray-50">
          <IntroductionSection />
        </div>
        
        {/* Section 3: Experts Currently Online - Moved up after Introduction */}
        <ExpertsOnlineSection />
        
        {/* Section 4: IFL Programs for Individuals (What We Do) - Moved down */}
        <WhatWeDoSection />
        
        {/* Section 5: How Can We Help You Today */}
        <HomepageIssueSessions />
        
        {/* Section 6: Join Our Mindfulness Community */}
        <MindfulnessCommunitySection />
        
        {/* Section 7: Programs for Organizations (Services Section) */}
        <ServicesSection />
        
        {/* Section 8: Why Choose Us */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <WhyChooseUsSection />
        </Suspense>

        {/* Section 9: Testimonials */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <TestimonialsSection />
        </Suspense>
        
        {/* Section 10: CTA Section */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <CTASection />
        </Suspense>
        
        {/* Section 11: Blog Section */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <BlogSection />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
