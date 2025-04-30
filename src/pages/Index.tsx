
import React, { useEffect, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Lazy load non-critical components
const TopTherapistsSection = lazy(() => import('@/components/TopTherapistsSection'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const WhyChooseUsSection = lazy(() => import('@/components/WhyChooseUsSection'));
const CTASection = lazy(() => import('@/components/CTASection'));
const Footer = lazy(() => import('@/components/Footer'));
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
  console.log('Index component rendering');
  
  useEffect(() => {
    console.log('Index component mounted');
    // Add a visible element to debug white screen
    const debugElement = document.createElement('div');
    debugElement.style.position = 'fixed';
    debugElement.style.top = '0';
    debugElement.style.left = '0';
    debugElement.style.backgroundColor = 'red';
    debugElement.style.color = 'white';
    debugElement.style.padding = '10px';
    debugElement.style.zIndex = '9999';
    debugElement.textContent = 'Debug: Index component loaded';
    document.body.appendChild(debugElement);
    
    return () => {
      if (document.body.contains(debugElement)) {
        document.body.removeChild(debugElement);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Services/Categories Section - Critical for first impression */}
        <ServicesSection />
        
        {/* Programs Section for Organizations - Updated for row alignment of buttons */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
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
          <BlogSection />
        </Suspense>
        
        {/* CTA section positioned above Stay in Touch section */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <CTASection />
        </Suspense>
        
        {/* Stay in Touch section after CTA section */}
        <Suspense fallback={<SectionLoadingFallback />}>
          <StayInTouchSection />
        </Suspense>
      </main>

      <Suspense fallback={<div className="h-40 bg-gray-100" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
