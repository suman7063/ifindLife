
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { FileText, Brain, Heart, Shield } from 'lucide-react';

const MentalHealthAssessment = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/lovable-uploads/35d6ff96-c06b-4787-84bc-64318cfa9fb0.png)' }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mental Health Assessment</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover insights about your mental wellbeing through our comprehensive assessment
          </p>
        </div>
      </section>

      {/* Assessment Content */}
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Take Your Free Mental Health Assessment</h2>
            <p className="text-lg text-gray-600">
              Our scientifically-backed assessment helps you understand your current mental health status 
              and provides personalized recommendations for your wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <Brain className="h-12 w-12 text-ifind-teal mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comprehensive</h3>
              <p className="text-gray-600">
                Covers all aspects of mental wellness including stress, anxiety, and mood
              </p>
            </div>
            
            <div className="text-center p-6">
              <Heart className="h-12 w-12 text-ifind-purple mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized</h3>
              <p className="text-gray-600">
                Get tailored recommendations based on your unique responses
              </p>
            </div>
            
            <div className="text-center p-6">
              <Shield className="h-12 w-12 text-ifind-aqua mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Confidential</h3>
              <p className="text-gray-600">
                Your responses are completely private and secure
              </p>
            </div>
          </div>

          <div className="text-center bg-gray-50 p-8 rounded-lg">
            <FileText className="h-16 w-16 text-ifind-teal mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Ready to Begin?</h3>
            <p className="text-lg text-gray-600 mb-6">
              The assessment takes approximately 10-15 minutes to complete.
            </p>
            <Button className="bg-ifind-teal hover:bg-ifind-teal/90 text-white px-8 py-3 text-lg">
              Start Assessment
            </Button>
          </div>
        </div>
      </Container>

      <Footer />
    </>
  );
};

export default MentalHealthAssessment;
