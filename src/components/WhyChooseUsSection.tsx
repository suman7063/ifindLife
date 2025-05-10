
import React from 'react';
import { Clock, Users, Shield, HeartPulse, Activity, Sparkles } from 'lucide-react';

const WhyChooseUsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Why Choose Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine expert knowledge, innovative approaches, and personalized care to provide 
            the most effective mental health support for your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-ifind-aqua to-ifind-purple flex items-center justify-center shadow-md">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-xl font-semibold mt-2 mb-4 text-gray-800">24/7 Availability</h3>
                <p className="text-gray-600">
                  Access support whenever you need it, day or night. Our platform is always available to provide help when you need it most.
                </p>
              </div>
            </div>
          </div>
          
          <div className="group hover:scale-105 transition-all duration-300 mt-8 md:mt-0">
            <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-ifind-teal to-ifind-aqua flex items-center justify-center shadow-md">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-xl font-semibold mt-2 mb-4 text-gray-800">Confidential & Secure</h3>
                <p className="text-gray-600">
                  Your privacy is our top priority with end-to-end encryption and strict confidentiality protocols.
                </p>
              </div>
            </div>
          </div>
          
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-ifind-purple to-ifind-teal flex items-center justify-center shadow-md">
                <HeartPulse className="h-8 w-8 text-white" />
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-xl font-semibold mt-2 mb-4 text-gray-800">Certified Professionals</h3>
                <p className="text-gray-600">
                  All our therapists are licensed professionals with years of clinical experience and specialized training.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow group hover:scale-105 transition-all duration-300">
            <div className="flex items-start">
              <div className="bg-gradient-to-r from-ifind-purple/80 to-ifind-purple rounded-full p-3 mr-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Personalized Approach</h3>
                <p className="text-gray-600">
                  We tailor our therapeutic approaches to your unique needs and preferences, ensuring you receive the most effective support for your specific situation.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow group hover:scale-105 transition-all duration-300">
            <div className="flex items-start">
              <div className="bg-gradient-to-r from-ifind-teal/80 to-ifind-teal rounded-full p-3 mr-4">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Evidence-Based Methods</h3>
                <p className="text-gray-600">
                  Our therapeutic approaches are grounded in research and clinical evidence, ensuring you receive the highest standard of care with proven effectiveness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
