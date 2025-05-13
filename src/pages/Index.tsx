
import React from 'react';
import Navbar from '@/components/Navbar';
import ServicesSection from '@/components/ServicesSection';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import EnhancedHero from '@/components/hero/EnhancedHero';
import { lazy, Suspense } from 'react';
import WelcomeSection from '@/components/WelcomeSection';

// Lazy load non-critical components
const TopTherapistsSection = lazy(() => import('@/components/TopTherapistsSection'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const WhyChooseUsSection = lazy(() => import('@/components/WhyChooseUsSection'));
const CTASection = lazy(() => import('@/components/CTASection'));
const BlogSection = lazy(() => import('@/components/BlogSection'));
const Footer = lazy(() => import('@/components/Footer'));
const StayInTouchSection = lazy(() => import('@/components/StayInTouchSection'));
const IssueSessions = lazy(() => import('@/components/services/IssueSessions'));

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
  // Only log in development mode
  if (import.meta.env.DEV) {
    console.log('Index component rendering with EnhancedHero');
  }
  
  const handleCategoryClick = (category: any) => {
    console.log("Category clicked:", category);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Section 1: Enhanced Hero Banner with tabs */}
        <EnhancedHero />
        
        {/* Welcome Section */}
        <WelcomeSection />
        
        {/* IFL Programs for Individuals - Moved up here */}
        <ServicesSection />
        
        {/* Section: How Can We Help You Today? (renamed from Issue Based Sessions) */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 sm:px-12">
            <Suspense fallback={<SectionLoadingFallback />}>
              <IssueSessions onCategoryClick={handleCategoryClick} />
            </Suspense>
          </div>
        </section>
        
        {/* Programs for Organizations */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 sm:px-12">
            <h2 className="text-3xl font-bold mb-8">Programs for Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-semibold mb-4 text-ifind-teal">For Academic Institutes</h3>
                <p className="mb-6 text-gray-700">
                  Comprehensive mental health programs designed for schools, colleges, and universities to support students, teachers, and staff.
                </p>
                <div className="flex flex-row justify-center space-x-4">
                  <Link to="/programs-for-academic-institutes" className="w-full">
                    <Button className="w-full">View Academic Programs</Button>
                  </Link>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-semibold mb-4 text-ifind-teal">For Businesses</h3>
                <p className="mb-6 text-gray-700">
                  Mental health and wellness solutions to support your organization, improve productivity, and create a positive work environment.
                </p>
                <div className="flex flex-row justify-center space-x-4">
                  <Link to="/programs-for-business" className="w-full">
                    <Button className="w-full">View Business Programs</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Experts Currently Online */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <TopTherapistsSection />
        </Suspense>

        {/* Why Choose Us */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <WhyChooseUsSection />
        </Suspense>

        {/* Testimonials */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <TestimonialsSection />
        </Suspense>
        
        {/* CTA Section */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <CTASection />
        </Suspense>
        
        {/* Blog Section */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <BlogSection />
        </Suspense>
        
        {/* Stay in Touch section */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <StayInTouchSection />
        </Suspense>
      </main>

      {/* Footer */}
      <Suspense fallback={<div className="h-40 bg-gray-100" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
