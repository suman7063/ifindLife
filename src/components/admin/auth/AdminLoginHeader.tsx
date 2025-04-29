
import React from 'react';
import { ShieldAlert } from 'lucide-react';

const AdminLoginHeader: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-center mb-6">
        <ShieldAlert className="h-12 w-12 text-ifind-teal" />
      </div>
      <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
    </>
  );
};

export default AdminLoginHeader;
