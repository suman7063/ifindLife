import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const StatCardSkeleton: React.FC = () => {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Icon skeleton */}
          <Skeleton className="h-10 w-10 rounded-xl" />
          
          {/* Value skeleton */}
          <Skeleton className="h-7 w-20" />
          
          {/* Label skeleton */}
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};
