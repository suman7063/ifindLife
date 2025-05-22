
import React from 'react';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Use lazy loading for the real component
const AgoraCallModalComponent = lazy(() => 
  import('./call/modals/AgoraCallModal')
);

// This is just a wrapper that lazily loads the real component
export default function AgoraCallModal(props) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading call component...</span>
      </div>
    }>
      <AgoraCallModalComponent {...props} />
    </Suspense>
  );
}
