
import React from 'react';
import { CardContent } from "@/components/ui/card";

const LoadingState: React.FC = () => {
  return (
    <CardContent className="pt-6">
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ifind-aqua"></div>
      </div>
    </CardContent>
  );
};

export default LoadingState;
