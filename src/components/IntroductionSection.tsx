import React from 'react';
import { Zap } from 'lucide-react';
const IntroductionSection = () => {
  return <section className="py-16 w-full bg-white">
      <div className="container mx-auto px-0">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-ifind-aqua to-ifind-purple">
            Welcome to Your Mental Wellness Journey
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed px-4 md:px-0 text-center">
            iFindLife is your safe space for real-time mental & emotional health support—offering 
            instant access to expert help during moments of distress, personalized guidance for 
            everyday challenges, and long-term tools to build emotional resilience. Anytime, anywhere.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-gradient-to-b from-ifind-purple/10 to-transparent p-6 rounded-xl">
              <div className="w-16 h-16 bg-ifind-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-ifind-purple h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Root Cause Healing</h3>
              <p className="text-gray-600">
                Energy-aware therapists guide healing of root cause, not just manage symptoms.
              </p>
            </div>
            
            <div className="bg-gradient-to-b from-ifind-aqua/10 to-transparent p-6 rounded-xl">
              <div className="w-16 h-16 bg-ifind-aqua/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ifind-aqua">
                  <path d="M15 5v16M5 15.5c1.66-1 3.83-1.5 6-1.5 2.17 0 4.34.5 6 1.5M5 8c1.66-1 3.83-1.5 6-1.5 2.17 0 4.34.5 6 1.5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Support</h3>
              <p className="text-gray-600">
                Immediate access to experts when you need it most, providing guidance during challenging moments.
              </p>
            </div>
            
            <div className="bg-gradient-to-b from-ifind-purple/10 to-transparent p-6 rounded-xl">
              <div className="w-16 h-16 bg-ifind-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ifind-purple">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Guidance</h3>
              <p className="text-gray-600">
                Tailored advice and strategies to help you navigate your unique emotional challenges.
              </p>
            </div>
            
            <div className="bg-gradient-to-b from-ifind-teal/10 to-transparent p-6 rounded-xl">
              <div className="w-16 h-16 bg-ifind-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ifind-teal">
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Emotional Resilience</h3>
              <p className="text-gray-600">
                Building long-term skills and tools for sustainable mental wellness and growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default IntroductionSection;