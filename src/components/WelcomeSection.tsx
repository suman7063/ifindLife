
import React from 'react';
import { Heart, Brain, MessageCircle } from 'lucide-react';

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-red-50">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Support</h3>
              <p className="text-gray-600">Access expert help in moments of distress with our real-time support system</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-blue-50">
                  <MessageCircle className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Personalized Guidance</h3>
              <p className="text-gray-600">Receive tailored advice and solutions for your everyday challenges</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-green-50">
                  <Brain className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Build Resilience</h3>
              <p className="text-gray-600">Develop long-term emotional strength with our comprehensive tools and resources</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
