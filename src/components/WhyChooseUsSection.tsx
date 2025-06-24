
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';

const WhyChooseUsSection = () => {
  // List of benefits with only titles as shown in the screenshot
  const benefits = [
    "24/7 Availability",
    "Confidential & Secure",
    "Certified Professionals",
    "Personalized Approach",
    "Evidence-Based Methods",
    "Ongoing Support"
  ];
  
  return (
    <section className="py-20 bg-gradient-to-r from-ifind-purple/20 to-ifind-teal/20 relative">
      {/* Overlay for additional contrast */}
      <div className="absolute inset-0 bg-gray-800/10"></div>
      
      <Container className="relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">How Can We Help You Today?</h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            Discover personalized support and guidance through our comprehensive mental wellness services designed to help you thrive.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-ifind-teal"
              >
                <CheckCircle className="h-6 w-6 text-ifind-teal mr-3 flex-shrink-0" />
                <h3 className="text-lg font-medium text-gray-800">{benefit}</h3>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUsSection;
