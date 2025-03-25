
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FreeAssessmentCTA = () => {
  return (
    <Link to="/experts">
      <Button 
        className="bg-ifind-aqua hover:bg-ifind-aqua/90 transition-opacity text-white px-6 py-2 rounded-full group relative overflow-hidden flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="font-medium">Talk to an Expert</span>
      </Button>
    </Link>
  );
};

export default FreeAssessmentCTA;
