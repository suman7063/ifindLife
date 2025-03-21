
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';

const FreeAssessmentCTA = () => {
  return (
    <Link to="/mental-health-assessment">
      <Button 
        className="bg-gradient-to-r from-ifind-purple to-ifind-aqua hover:opacity-90 transition-opacity text-white px-6 py-6 h-auto group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        <BrainCircuit className="h-5 w-5 mr-2 animate-pulse" />
        <span className="font-medium relative z-10">Take Free Mental Health Assessment</span>
      </Button>
    </Link>
  );
};

export default FreeAssessmentCTA;
