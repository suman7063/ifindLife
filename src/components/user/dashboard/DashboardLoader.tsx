
import React from 'react';
import { Loader2 } from 'lucide-react';

const DashboardLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-medium">Loading Dashboard...</h2>
      <p className="text-muted-foreground">Please wait while we set up your dashboard</p>
    </div>
  );
};

export default DashboardLoader;
