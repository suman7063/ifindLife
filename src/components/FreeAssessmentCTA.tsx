
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const FreeAssessmentCTA = () => {
  return (
    <Link to="/experts">
      <Button 
        className="bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 transition-all duration-300 text-white px-8 py-6 rounded-full group shadow-lg transform hover:scale-105"
        size="lg"
      >
        <Phone className="h-5 w-5 mr-3 group-hover:animate-pulse" />
        <span className="font-medium text-lg">Talk to an Expert Now</span>
      </Button>
    </Link>
  );
};

export default FreeAssessmentCTA;
