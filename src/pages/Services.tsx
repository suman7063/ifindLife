
import React, { useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowDown, Brain, HeartPulse, Leaf, MessageCircle, Sparkles } from 'lucide-react';
import { servicesData } from '@/components/services/detail/servicesData';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Services = () => {
  // References for scrolling to sections
  const servicesRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to services section
  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Function to get image positioning based on service ID
  const getImagePosition = (serviceId: string) => {
    switch (serviceId) {
      case 'therapy-sessions':
        return 'object-position: center 20%;'; // Position to show faces better for therapy sessions
      case 'guided-meditations':
        return 'object-position: center 30%;'; // Position to show faces better for guided meditations
      case 'mindful-listening':
        return 'object-position: center 25%;'; // Position to show faces better for Heart2Heart listening
      default:
        return '';
    }
  };
  
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Comprehensive mental wellness services tailored to your unique needs and journey.
              </p>
              
              {/* Service Navigation Menu - Fixed for better visibility */}
              <div className="flex justify-center mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                  {servicesData.map((service) => (
                    <a 
                      key={service.id}
                      href={`#${service.id}`} 
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${service.buttonColor} text-white h-10 px-4 py-2 m-1 shadow-sm hover:shadow-md`}
                    >
                      {service.title}
                    </a>
                  ))}
                </div>
              </div>
              
              <Button onClick={scrollToServices} variant="outline" className="mt-4 animate-bounce">
                <ArrowDown className="mr-2 h-4 w-4" /> Explore Our Services
              </Button>
            </div>
            
            <div ref={servicesRef} className="space-y-24">
              {servicesData.map((service, index) => {
                // Use our custom hook for each service card
                const { ref, isVisible } = useScrollAnimation();
                
                return (
                  <section 
                    key={service.id} 
                    id={service.id} 
                    ref={ref}
                    className={`scroll-mt-24 ${index % 2 === 0 ? '' : 'bg-gray-50 dark:bg-gray-900 py-8 rounded-xl'} transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                      <div className="md:w-1/2">
                        <div className="p-4 rounded-xl overflow-hidden h-80 shadow-md border border-gray-200">
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover object-center" 
                            style={{ 
                              ...(getImagePosition(service.id) && { objectPosition: 
                                service.id === 'therapy-sessions' ? 'center 20%' : 
                                service.id === 'guided-meditations' ? 'center 30%' : 
                                service.id === 'mindful-listening' ? 'center 25%' : 'center center'
                              })
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="md:w-1/2 space-y-4">
                        <div className="flex flex-col items-center md:items-start">
                          <div className={`p-3 rounded-full mb-2 ${service.color}`}>
                            {service.icon}
                          </div>
                          <h2 className={`text-3xl font-bold ${service.textColor}`}>{service.title}</h2>
                        </div>
                        
                        <p className="text-lg text-gray-700 dark:text-gray-300">{service.description}</p>
                        <p className="text-gray-600 dark:text-gray-400">{service.detailedDescription.substring(0, 150)}...</p>
                        
                        <div className="pt-4">
                          <Button asChild className={`${service.buttonColor}`}>
                            <Link to={`/services/${service.id}`}>Learn More</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-ifind-lavender/10">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose Our Services?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-10">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-ifind-teal">
                <div className="w-12 h-12 bg-ifind-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ifind-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Practitioners</h3>
                <p className="text-gray-600 dark:text-gray-300">Qualified professionals with extensive experience and a passion for helping others.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-ifind-purple">
                <div className="w-12 h-12 bg-ifind-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ifind-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Approach</h3>
                <p className="text-gray-600 dark:text-gray-300">Tailored solutions designed to meet your unique needs and wellness goals.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border-t-4 border-ifind-pink">
                <div className="w-12 h-12 bg-ifind-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ifind-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600 dark:text-gray-300">Convenient appointment times that work with your busy lifestyle.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Services;
