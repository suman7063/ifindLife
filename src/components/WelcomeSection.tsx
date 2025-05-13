
import React from 'react';

const WelcomeSection = () => {
  return (
    <section className="py-14 bg-gradient-to-br from-white to-ifind-offwhite">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-ifind-teal">Welcome to Your Mental Wellness Journey</h2>
          
          <div className="prose prose-lg mx-auto mb-10 text-gray-700">
            <p className="text-xl italic">
              iFindLife is your safe space for real-time mental & emotional health support—offering instant access 
              to expert help during moments of distress, personalized guidance for everyday challenges, and 
              long-term tools to build emotional resilience. Anytime, anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
