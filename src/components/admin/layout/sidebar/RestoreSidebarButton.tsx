
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

/**
 * A persistent button that appears when sidebar is collapsed
 * to allow users to restore the sidebar
 */
const RestoreSidebarButton = () => {
  const { state, toggleSidebar } = useSidebar();
  
  if (state === 'expanded') {
    // Don't show the button when sidebar is already visible
    return null;
  }
  
  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 left-4 z-50 rounded-full shadow-md border-slate-200"
      onClick={toggleSidebar}
      title="Show sidebar"
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Show sidebar</span>
    </Button>
  );
};

export default RestoreSidebarButton;
