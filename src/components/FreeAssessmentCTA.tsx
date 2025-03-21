
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';

const FreeAssessmentCTA = () => {
  return (
    <Link to="/mental-health-assessment">
      <Button 
        className="bg-ifind-aqua hover:bg-ifind-aqua/90 transition-opacity text-white px-6 py-2 rounded-full group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        <span className="font-medium relative z-10">Talk to an Expert</span>
      </Button>
    </Link>
  );
};

export default FreeAssessmentCTA;
