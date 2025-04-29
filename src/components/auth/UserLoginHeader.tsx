
import React from 'react';
import { Link } from 'react-router-dom';

const UserLoginHeader = () => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
      <p className="mt-2 text-sm text-gray-600">
        Sign in to your account or{' '}
        <Link to="/register" className="text-ifind-aqua hover:underline">
          create a new account
        </Link>
      </p>
    </div>
  );
};

export default UserLoginHeader;
