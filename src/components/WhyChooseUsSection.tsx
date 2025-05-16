
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';

const WhyChooseUsSection = () => {
  // List of benefits with detailed descriptions
  const benefits = [
    {
      title: "24/7 Availability",
      description: "Our platform is available around the clock for whenever you need support."
    },
    {
      title: "Confidential & Secure",
      description: "Your privacy is our top priority with encrypted communications and strict confidentiality."
    },
    {
      title: "Certified Professionals",
      description: "All our experts are certified and experienced in their respective fields."
    },
    {
      title: "Personalized Approach",
      description: "We tailor our solutions to your unique needs and circumstances."
    },
    {
      title: "Evidence-Based Methods",
      description: "Our approaches are grounded in research and proven therapeutic techniques."
    },
    {
      title: "Ongoing Support",
      description: "We're committed to your long-term wellbeing with continuous support."
    },
  ];
  
  return (
    <section className="py-20 bg-gradient-to-r from-ifind-purple/50 to-ifind-teal/50 relative">
      {/* Overlay for additional contrast */}
      <div className="absolute inset-0 bg-gray-800/20"></div>
      
      <Container className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Why Choose Us</h2>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex flex-col p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-ifind-teal"
              >
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-6 w-6 text-ifind-teal mr-3 flex-shrink-0" />
                  <h3 className="text-lg font-medium text-gray-800">{benefit.title}</h3>
                </div>
                <p className="text-gray-600 mt-2">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUsSection;
