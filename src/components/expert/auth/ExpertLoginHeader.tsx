
import React from 'react';
import { Link } from 'react-router-dom';

const ExpertLoginHeader: React.FC = () => {
  return (
    <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
      <span className="font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-ifind-teal to-ifind-lavender text-xl text-center">
        For Mental Health Professionals
      </span>
    </Link>
  );
};

export default ExpertLoginHeader;
