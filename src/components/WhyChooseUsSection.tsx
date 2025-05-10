
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';

const WhyChooseUsSection = () => {
  // List of benefits without descriptions
  const benefits = [
    "24/7 Availability",
    "Confidential & Secure",
    "Certified Professionals",
    "Personalized Approach",
    "Evidence-Based Methods",
    "Ongoing Support",
  ];
  
  return (
    <section className="py-20 bg-gradient-to-r from-ifind-purple/50 to-ifind-teal/50 relative">
      {/* Overlay for additional contrast */}
      <div className="absolute inset-0 bg-gray-800/20"></div>
      
      <Container className="px-6 sm:px-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Why Choose Us</h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-ifind-teal"
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
