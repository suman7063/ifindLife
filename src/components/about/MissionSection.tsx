
import React from 'react';
import { Award, Globe, BrainCircuit } from 'lucide-react';

const MissionSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-700 mb-8">
            At iFindLife, we believe that mental wellbeing is fundamental to living a fulfilled life. Our mission is to bridge the gap between traditional mental healthcare and modern technology, providing personalized mental wellness solutions that are accessible to everyone, regardless of their background or location.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 bg-ifind-aqua/10 rounded-lg">
              <div className="bg-ifind-aqua text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-medium mb-2">Quality Care</h3>
              <p className="text-gray-600 text-sm">Expert mental health professionals with proven track records</p>
            </div>
            
            <div className="text-center p-6 bg-ifind-purple/10 rounded-lg">
              <div className="bg-ifind-purple text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-medium mb-2">Accessibility</h3>
              <p className="text-gray-600 text-sm">Breaking barriers to mental healthcare through technology</p>
            </div>
            
            <div className="text-center p-6 bg-ifind-teal/10 rounded-lg">
              <div className="bg-ifind-teal text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="font-medium mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">Applying the latest research and technology to mental wellness</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
