
import React from 'react';
import { Clock, Users, FileText, Shield, HeartPulse, Activity } from 'lucide-react';

const WhyChooseUsSection = () => {
  return (
    <section className="py-16 bg-gray-800 text-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-ifind-aqua bg-opacity-90 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <Clock className="h-12 w-12 text-white" />
            </div>
            <h3 className="font-semibold text-xl mb-2">24/7 Availability</h3>
            <p className="text-white/90">Access support whenever you need it, day or night</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-ifind-aqua" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Confidential & Secure</h3>
            <p className="text-gray-600">Your privacy is our top priority with end-to-end encryption</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <HeartPulse className="h-12 w-12 text-ifind-aqua" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Certified Professionals</h3>
            <p className="text-gray-600">Licensed therapists with years of clinical experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
