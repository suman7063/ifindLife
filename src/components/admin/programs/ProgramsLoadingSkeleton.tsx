
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProgramsLoadingSkeletonProps {
  count?: number;
}

const ProgramsLoadingSkeleton: React.FC<ProgramsLoadingSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded-t-lg" />
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-16 bg-gray-200 rounded mb-2" />
            <div className="flex gap-2 mt-3">
              <div className="h-5 bg-gray-200 rounded w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProgramsLoadingSkeleton;
