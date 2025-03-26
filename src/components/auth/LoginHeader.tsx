
import React from 'react';
import { Link } from 'react-router-dom';

const LoginHeader: React.FC = () => {
  return (
    <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
      <div className="relative w-8 h-8">
        <div className="absolute w-8 h-8 bg-ifind-aqua rounded-full opacity-70"></div>
        <div className="absolute w-4 h-4 bg-ifind-teal rounded-full top-1 left-2"></div>
      </div>
      <span className="font-bold text-2xl text-gradient">iFindLife</span>
    </Link>
  );
};

export default LoginHeader;
