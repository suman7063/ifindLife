
import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserProfile } from '@/types/supabase/user';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import UserDashboardSidebar from './UserDashboardSidebar';
import Navbar from '@/components/Navbar';
import { Container } from '@/components/ui/container';

interface UserDashboardLayoutProps {
  user: UserProfile | null;
  onLogout: () => Promise<boolean>;
  isLoggingOut: boolean;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({
  user,
  onLogout,
  isLoggingOut
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex pt-24"> {/* Added top padding to prevent overlap */}
        <SidebarProvider defaultOpen>
          <UserDashboardSidebar 
            user={user}
            onLogout={onLogout}
            isLoggingOut={isLoggingOut}
          />
          
          <SidebarInset>
            <main className="flex-1 p-6">
              <div className="md:hidden flex items-center mb-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold ml-2">Dashboard</h1>
              </div>
              
              <Container>
                <Outlet />
              </Container>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
