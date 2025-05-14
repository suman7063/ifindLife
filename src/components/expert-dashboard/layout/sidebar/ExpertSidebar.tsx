
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Users,
  MessageSquare,
  FileText,
  LogOut,
  PieChart,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth/AuthContext';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, children, isActive = false }) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className={cn(
      "w-full justify-start",
      isActive ? "bg-muted font-medium" : "font-normal"
    )}
    asChild
  >
    <Link to={href} className="flex items-center">
      <span className="mr-2">{icon}</span>
      <span>{children}</span>
      {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
  </Button>
);

const ExpertSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center">
          <img src="/ifindlife-logo.png" alt="iFind Life Logo" className="h-8" />
          <h1 className="text-xl font-bold ml-2">Expert Portal</h1>
        </div>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-2">
          <SidebarLink
            href="/expert-dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard")}
          >
            Dashboard
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/appointments"
            icon={<Calendar className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/appointments")}
          >
            Appointments
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/clients"
            icon={<Users className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/clients")}
          >
            Clients
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/messages"
            icon={<MessageSquare className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/messages")}
          >
            Messages
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/earnings"
            icon={<FileText className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/earnings")}
          >
            Earnings
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/analytics"
            icon={<PieChart className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/analytics")}
          >
            Analytics
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/settings"
            icon={<Settings className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/settings")}
          >
            Settings
          </SidebarLink>
        </div>
      </ScrollArea>
      
      <div className="p-4 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        {sidebarContent}
      </aside>
      
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="ml-2 mt-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ExpertSidebar;
