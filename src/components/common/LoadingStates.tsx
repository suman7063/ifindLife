import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

// Expert Card Loading Skeleton
export const ExpertCardSkeleton: React.FC = () => (
  <Card className="h-full">
    <CardHeader className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-24" />
      </div>
    </CardContent>
  </Card>
);

// Expert Grid Loading
export const ExpertGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ExpertCardSkeleton key={i} />
    ))}
  </div>
);

// Booking Calendar Skeleton
export const BookingCalendarSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Call Interface Skeleton
export const CallInterfaceSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-white animate-spin" />
    </div>
    <div className="flex justify-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  </div>
);

// Appointment List Skeleton
export const AppointmentListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Full Page Loading
export const FullPageLoader: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{message}</h3>
        <p className="text-muted-foreground">Please wait while we load your content</p>
      </div>
    </div>
  </div>
);

// Inline Spinner
export const InlineLoader: React.FC<{ size?: 'sm' | 'md' | 'lg'; message?: string }> = ({ 
  size = 'md', 
  message 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  );
};

// Component Loading Wrapper
export const LoadingWrapper: React.FC<{
  loading: boolean;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
}> = ({ loading, skeleton, children }) => {
  if (loading) {
    return skeleton || <InlineLoader />;
  }
  return <>{children}</>;
};