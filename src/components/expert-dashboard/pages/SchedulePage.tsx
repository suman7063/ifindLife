
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components - only load when tab is active
const SessionManager = lazy(() => import('./sessions/SessionManager'));
const AvailabilityManagement = lazy(() => import('@/components/expert/availability/AvailabilityManagement').then(module => ({ default: module.default })));
const BookingCalendar = lazy(() => import('./schedule/BookingCalendar'));

// Loading fallback component
const TabLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-12">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const SchedulePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize active tab from URL params or default to 'availability'
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tabFromUrl = searchParams.get('tab');
    // Validate that the tab from URL is one of the valid tabs
    if (tabFromUrl && ['availability', 'sessions', 'calendar'].includes(tabFromUrl)) {
      return tabFromUrl;
    }
    return 'availability';
  });

  // Update URL params when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', value);
    setSearchParams(newSearchParams, { replace: true });
  };

  // Sync with URL params if they change externally
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['availability', 'sessions', 'calendar'].includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Schedule & Sessions</h1>
          <p className="text-muted-foreground">
            Manage your availability, appointments, and sessions
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="availability">Availability Management</TabsTrigger>
          <TabsTrigger value="sessions">Session Management</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Only render active tab content - lazy loaded */}
        <TabsContent value="availability" className="mt-6">
          {activeTab === 'availability' && (
            <Suspense fallback={<TabLoadingFallback />}>
              <div className="space-y-6">
                <AvailabilityManagement />
              </div>
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          {activeTab === 'sessions' && (
            <Suspense fallback={<TabLoadingFallback />}>
              <SessionManager />
            </Suspense>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          {activeTab === 'calendar' && (
            <Suspense fallback={<TabLoadingFallback />}>
              <BookingCalendar />
            </Suspense>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchedulePage;
