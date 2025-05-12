
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Search, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  // Function to scroll to top when link is clicked
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-gradient-to-r from-ifind-aqua to-ifind-teal text-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Mental Health Journey?</h2>
          <p className="text-lg mb-8">
            Take the first step towards better mental health today. Our experts are ready to help you navigate your challenges.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services/mindful-listening" onClick={handleLinkClick}>
              <Button className="bg-white text-ifind-aqua hover:bg-ifind-offwhite transition-colors text-lg py-6 px-8 flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Speak Your Heart
              </Button>
            </Link>
            <Link to="/services/therapy-sessions" onClick={handleLinkClick}>
              <Button className="bg-white text-ifind-aqua hover:bg-ifind-offwhite transition-colors text-lg py-6 px-8 flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Get Guidance
              </Button>
            </Link>
            <Link to="/mental-health-assessment" onClick={handleLinkClick}>
              <Button className="bg-white text-ifind-aqua hover:bg-ifind-offwhite transition-colors text-lg py-6 px-8 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Take a Test
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
