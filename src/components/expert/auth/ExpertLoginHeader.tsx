
import React from 'react';
import { Link } from 'react-router-dom';

const ExpertLoginHeader: React.FC = () => {
  return (
    <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
      <h1 className="font-bold text-2xl text-center text-ifind-teal">
        For Mental Health Professionals
      </h1>
    </Link>
  );
};

export default ExpertLoginHeader;
