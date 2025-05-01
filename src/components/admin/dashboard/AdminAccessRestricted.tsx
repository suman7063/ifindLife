
import React from 'react';

const AdminAccessRestricted: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Access Restricted</h1>
        <p className="mb-6 text-muted-foreground">
          You don't have any permissions assigned to your account. Please contact a super administrator.
        </p>
        <button 
          onClick={() => window.location.href = '/admin-login'}
          className="w-full rounded bg-ifind-aqua py-2 font-medium text-white hover:bg-ifind-teal"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default AdminAccessRestricted;
