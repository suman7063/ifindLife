import React from 'react';
import { Link } from 'react-router-dom';
const ExpertLoginHeader: React.FC = () => {
  return <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
      
      <span className="font-bold text-gradient text-xl text-center">For Mental Health Professionals</span>
    </Link>;
};
export default ExpertLoginHeader;