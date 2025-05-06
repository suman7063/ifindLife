
import React from 'react';
import { Link } from 'react-router-dom';

const ExpertLoginHeader: React.FC = () => {
  return (
    <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
      <h1 className="font-bold text-2xl text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-ifind-teal to-ifind-lavender">
        For Mental Health Professionals
      </h1>
    </Link>
  );
};

export default ExpertLoginHeader;
