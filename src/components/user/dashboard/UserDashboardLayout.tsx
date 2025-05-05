
import React, { useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import UserDashboardSidebar from './UserDashboardSidebar';
import Navbar from '@/components/Navbar';
import { Container } from '@/components/ui/container';

interface UserDashboardLayoutProps {
  user: UserProfile | null;
  onLogout: () => Promise<boolean>;
  isLoggingOut: boolean;
  children: React.ReactNode;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({
  user,
  onLogout,
  isLoggingOut,
  children
}) => {
  // Add debug logging
  useEffect(() => {
    console.log('UserDashboardLayout rendering with user:', user?.id);
    
    // Check element dimensions for debugging
    setTimeout(() => {
      const contentEl = document.querySelector('.dashboard-content');
      console.log('Dashboard content element:', contentEl);
      console.log('Dashboard content dimensions:', contentEl ? {
        width: contentEl.clientWidth,
        height: contentEl.clientHeight,
        offsetWidth: contentEl.offsetWidth,
        offsetHeight: contentEl.offsetHeight
      } : null);
    }, 100);
  }, [user]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex w-full mt-24">
        <SidebarProvider defaultOpen>
          <div className="grid grid-cols-[250px_1fr] w-full">
            <UserDashboardSidebar 
              user={user}
              onLogout={onLogout}
              isLoggingOut={isLoggingOut}
              className="h-[calc(100vh-6rem)] border-r overflow-y-auto"
            />
            
            <SidebarInset className="overflow-y-auto">
              <main className="p-6 dashboard-content">
                <div className="md:hidden flex items-center mb-4">
                  <SidebarTrigger />
                  <h1 className="text-2xl font-bold ml-2">Dashboard</h1>
                </div>
                
                <Container>
                  {children}
                </Container>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
