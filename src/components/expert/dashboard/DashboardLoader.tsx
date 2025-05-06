
import React from 'react';
import { Loader2 } from 'lucide-react';

const DashboardLoader = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center flex-col">
      <Loader2 className="h-10 w-10 text-ifind-aqua animate-spin mb-4" />
      <p className="text-muted-foreground">Loading expert dashboard...</p>
    </div>
  );
};

export default DashboardLoader;
