
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-ifind-aqua to-ifind-teal text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Mental Health Journey?</h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto text-center">
          Take the first step towards better mental health with our professional guidance and support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-white text-ifind-aqua hover:bg-gray-100">
            <Link 
              to="/services/therapy-sessions"
              onClick={() => window.scrollTo(0, 0)}
            >
              Get Guidance
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-ifind-aqua"
          >
            <Link 
              to="/assessment"
              onClick={() => window.scrollTo(0, 0)}
            >
              Take a Test
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
