
import React from 'react';
import { Clock, Users, FileText } from 'lucide-react';

const WhyChooseUsSection = () => {
  return (
    <section className="py-16 bg-gray-700 text-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-2xl font-bold mb-12 text-center">Why Choose iFind Life ?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-ifind-aqua rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <Clock className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-semibold text-xl mb-2">24/7</h3>
            <p className="text-white/90">Available round the clock</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-10 w-10 text-ifind-aqua" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Personalized Advice & Support</h3>
            <p className="text-gray-600">Tailored guidance for your needs</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <FileText className="h-10 w-10 text-ifind-aqua" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-gray-800">Certified Experts</h3>
            <p className="text-gray-600">Verified professionals you can trust</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
