
import React from 'react';

const ValuesSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              <h3 className="font-medium mb-2 text-ifind-teal">Compassion</h3>
              <p className="text-gray-600 text-sm">We approach every individual with empathy and understanding, recognizing that each person's journey is unique.</p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              <h3 className="font-medium mb-2 text-ifind-teal">Excellence</h3>
              <p className="text-gray-600 text-sm">We strive for the highest standards in the mental health services we provide, continuously improving our approach.</p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              <h3 className="font-medium mb-2 text-ifind-teal">Inclusivity</h3>
              <p className="text-gray-600 text-sm">We believe mental health support should be accessible to everyone, regardless of background or circumstances.</p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              <h3 className="font-medium mb-2 text-ifind-teal">Innovation</h3>
              <p className="text-gray-600 text-sm">We embrace technology and new approaches to enhance the effectiveness and reach of mental health support.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
