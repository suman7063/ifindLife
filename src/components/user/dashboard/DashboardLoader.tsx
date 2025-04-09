
import React from 'react';
import { Container } from '@/components/ui/container';
import { Loader2 } from 'lucide-react';

interface DashboardLoaderProps {
  message?: string;
}

const DashboardLoader: React.FC<DashboardLoaderProps> = ({ 
  message = "Loading dashboard..." 
}) => {
  return (
    <Container className="py-8 flex justify-center items-center min-h-[60vh]">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">{message}</p>
      </div>
    </Container>
  );
};

export default DashboardLoader;
