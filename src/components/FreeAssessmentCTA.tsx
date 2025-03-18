
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';

const FreeAssessmentCTA = () => {
  return (
    <Link to="/mental-health-assessment">
      <Button 
        className="bg-gradient-to-r from-ifind-purple to-ifind-aqua hover:opacity-90 transition-opacity text-white px-6 py-6 h-auto"
      >
        <BrainCircuit className="h-5 w-5 mr-2" />
        <span className="font-medium">Take Free Mental Health Assessment</span>
      </Button>
    </Link>
  );
};

export default FreeAssessmentCTA;
