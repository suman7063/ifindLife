
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { useUnifiedServices } from '@/hooks/useUnifiedServices';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Services = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { services, loading, error } = useUnifiedServices();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of wellness services designed to support your mental, emotional, and spiritual well-being.
            </p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-ifind-aqua"></div>
              <p className="mt-2 text-gray-600">Loading services...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading services: {error}</p>
            </div>
          )}
          
          {!loading && !error && services.length > 0 && (
            <div 
              ref={ref}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 ${
                isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'
              }`}
            >
              {services.map((service, index) => (
                <div 
                  key={service.id}
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group hover:scale-105 ${
                    isVisible ? 'animate-fade-in' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{ objectPosition: 'center 20%' }}
                    />
                    <div className={`absolute top-4 left-4 p-3 rounded-full ${service.color} shadow-lg`}>
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-3 ${service.textColor}`}>
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{service.formattedDuration}</span>
                      <Link to={`/services/${service.slug}`}>
                        <Button 
                          className={`${service.buttonColor} text-white hover:opacity-90 transition-opacity`}
                          size="sm"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No services available at the moment.</p>
            </div>
          )}

          {/* Call to Action Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-ifind-aqua to-ifind-teal rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
            <p className="text-lg mb-6 opacity-90">
              Choose a service that resonates with you and take the first step towards better mental health.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/user-signup">
                <Button className="bg-white text-ifind-aqua hover:bg-ifind-offwhite transition-colors">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-ifind-aqua transition-colors">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Services;
