
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UnauthorizedView: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <AlertCircle className="h-16 w-16 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You're not authorized to access the expert dashboard. Please sign in with an expert account.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full bg-ifind-aqua hover:bg-ifind-teal">
            <Link to="/expert-login">Sign in as Expert</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedView;
