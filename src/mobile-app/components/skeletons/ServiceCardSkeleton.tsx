import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const ServiceCardSkeleton: React.FC = () => {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Icon skeleton */}
          <Skeleton className="h-12 w-12 rounded-xl" />
          
          <div className="flex-1 space-y-2">
            {/* Title skeleton */}
            <Skeleton className="h-5 w-40" />
            
            {/* Description skeleton */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            
            {/* Price skeleton */}
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
