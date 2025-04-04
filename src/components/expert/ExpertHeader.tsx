
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ExpertHeader = () => {
  return (
    <div className="bg-gray-100 text-gray-800 py-6">
      <div className="container">
        <Link to="/experts" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Experts
        </Link>
      </div>
    </div>
  );
};

export default ExpertHeader;
