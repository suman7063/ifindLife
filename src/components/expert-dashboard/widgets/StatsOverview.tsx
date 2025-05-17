
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Stat {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

interface StatsOverviewProps {
  stats: Stat[];
  isLoading?: boolean;
  columns?: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ 
  stats,
  isLoading = false,
  columns = 4
}) => {
  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`}>
      {isLoading ? (
        // Loading skeletons
        Array.from({ length: columns }).map((_, i) => (
          <Card key={`skeleton-${i}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-24" />
            </CardContent>
          </Card>
        ))
      ) : (
        // Actual stats
        stats.map((stat, i) => (
          <Card key={`stat-${i}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-0.5">
                <CardTitle className="text-base font-medium">{stat.title}</CardTitle>
                {stat.description && <CardDescription>{stat.description}</CardDescription>}
              </div>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default StatsOverview;
