
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-ifind-aqua to-ifind-teal text-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Mental Health Journey?</h2>
          <p className="text-lg mb-8">
            Take the first step towards better mental health today. Our experts are ready to help you navigate your challenges.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-ifind-aqua hover:bg-ifind-offwhite transition-colors text-lg py-6 px-8 flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Talk to a Therapist
            </Button>
            <Button className="bg-white text-ifind-aqua hover:bg-ifind-offwhite transition-colors text-lg py-6 px-8 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Book an Appointment
            </Button>
          </div>
          
          <div className="mt-8">
            <Link to="/mental-health-assessment">
              <Button variant="outline" className="border-white text-white hover:bg-white/20 transition-colors">
                Take Free Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
