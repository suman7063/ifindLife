
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';
import FreeAssessmentCTA from '@/components/FreeAssessmentCTA';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-ifind-aqua to-ifind-teal text-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Mental Wellness Support?</h2>
          <p className="text-lg mb-8">
            Connect with our expert therapists now and get help with your mental and emotional challenges.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-ifind-aqua hover:bg-ifind-offwhite transition-colors text-lg py-6 px-8">
              <Phone className="mr-2 h-5 w-5" />
              Talk to a Therapist
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/20 transition-colors text-lg py-6 px-8">
              <MessageCircle className="mr-2 h-5 w-5" />
              Video Consultation
            </Button>
          </div>
          
          <div className="mt-8">
            <FreeAssessmentCTA />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
