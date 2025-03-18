
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';

const FreeAssessmentCTA = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link to="/mental-health-assessment">
        <Button 
          className="bg-gradient-to-r from-ifind-purple to-ifind-aqua hover:opacity-90 transition-opacity text-white px-6 py-6 h-auto shadow-lg"
        >
          <BrainCircuit className="h-5 w-5 mr-2" />
          <span className="font-medium">Take Free Mental Health Assessment</span>
        </Button>
      </Link>
    </div>
  );
};

export default FreeAssessmentCTA;
