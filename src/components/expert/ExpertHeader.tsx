
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ExpertHeader = () => {
  return (
    <div className="bg-astro-deep-blue text-white py-6">
      <div className="container">
        <Link to="/experts" className="inline-flex items-center text-astro-stardust hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Experts
        </Link>
      </div>
    </div>
  );
};

export default ExpertHeader;
