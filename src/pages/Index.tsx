
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
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';

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
  const { isAuthenticated, user, sessionType, isLoading } = useEnhancedUnifiedAuth();
  
  // Comprehensive logging for homepage state
  console.log('🔒 HomePage rendering with state:', { 
    isAuthenticated: Boolean(isAuthenticated), 
    hasUser: Boolean(user),
    sessionType,
    isLoading: Boolean(isLoading),
    userEmail: user?.email,
    timestamp: new Date().toISOString()
  });

  // Ensure page loads from top and add mounting logs
  useEffect(() => {
    console.log('🔒 HomePage mounting');
    window.scrollTo(0, 0);
    
    // Debug DOM structure
    setTimeout(() => {
      const navbar = document.querySelector('[data-navbar="main"]');
      const homePage = document.querySelector('.home-page');
      console.log('🔒 HomePage mounted - DOM check:', {
        navbarExists: Boolean(navbar),
        homePageExists: Boolean(homePage),
        bodyChildren: document.body.children.length
      });
    }, 100);

    return () => {
      console.log('🔒 HomePage unmounting');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col home-page" style={{ minHeight: '100vh', width: '100%' }}>
      {/* Always render Navbar with guaranteed visibility */}
      <div 
        style={{ 
          minHeight: '80px', 
          width: '100%', 
          position: 'relative', 
          zIndex: 50,
          display: 'block',
          visibility: 'visible'
        }}
      >
        <Navbar />
      </div>
      
      <main className="flex-1 main-content" style={{ paddingTop: '0px', flex: 1 }}>
        {/* Authentication-aware content */}
        {isAuthenticated && user && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Welcome back, {user.email}! You are logged in as {sessionType}.
                </p>
              </div>
            </div>
          </div>
        )}
        
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
