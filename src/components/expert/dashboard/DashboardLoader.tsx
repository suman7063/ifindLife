
import React from 'react';
import { Loader2 } from 'lucide-react';

const DashboardLoader: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-12 w-12 animate-spin text-ifind-aqua" />
      <p className="mt-4 text-muted-foreground">Loading expert dashboard...</p>
    </div>
  );
};

export default DashboardLoader;
