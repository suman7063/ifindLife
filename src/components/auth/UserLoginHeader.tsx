import React from 'react';
import { Link } from 'react-router-dom';
const UserLoginHeader: React.FC = () => {
  return <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
      
      <span className="font-bold text-2xl text-gradient">Welcome to iFindLife</span>
    </Link>;
};
export default UserLoginHeader;