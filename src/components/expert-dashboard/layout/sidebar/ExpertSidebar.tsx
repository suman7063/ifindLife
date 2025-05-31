
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Wallet,
  LogOut,
  ChevronRight,
  Menu,
  UserCircle,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useUnifiedAuth } from '@/contexts/auth/UnifiedAuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badge?: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, children, isActive = false, badge }) => (
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
      <span className="flex-1">{children}</span>
      {badge && (
        <Badge variant="secondary" className="ml-auto text-xs">
          {badge}
        </Badge>
      )}
      {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
  </Button>
);

const ExpertSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, expert } = useUnifiedAuth();
  
  // Function to check if a path is active - improved logic
  const isActive = (path: string) => {
    if (path === "/expert-dashboard") {
      return location.pathname === "/expert-dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/expert-login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center">
          <img src="/lovable-uploads/55b74deb-7ab0-4410-a3db-d3706db1d19a.png" alt="iFind Life Logo" className="h-8" />
          <h1 className="text-xl font-bold ml-2">Expert Portal</h1>
        </div>
        
        {/* Expert Profile Summary */}
        {expert && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium truncate">{expert.name || expert.full_name || 'Expert'}</p>
            <Badge 
              variant={expert.status === 'approved' ? 'default' : 'secondary'}
              className="mt-1"
            >
              {expert.status === 'approved' ? 'Verified' : expert.status || 'Pending'}
            </Badge>
          </div>
        )}
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-2">
          <SidebarLink
            href="/expert-dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard") && location.pathname === "/expert-dashboard"}
          >
            Dashboard
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/profile"
            icon={<UserCircle className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/profile")}
          >
            Profile
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/schedule"
            icon={<Calendar className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/schedule")}
            badge="8"
          >
            Schedule
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/clients"
            icon={<Users className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/clients")}
            badge="12"
          >
            Clients
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/services"
            icon={<Briefcase className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/services")}
          >
            Services
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/messages"
            icon={<MessageSquare className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/messages")}
            badge="3"
          >
            Messages
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/earnings"
            icon={<Wallet className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/earnings")}
          >
            Earnings
          </SidebarLink>
          
          <SidebarLink
            href="/expert-dashboard/reports"
            icon={<AlertCircle className="h-5 w-5" />}
            isActive={isActive("/expert-dashboard/reports")}
          >
            Report User
          </SidebarLink>
        </div>
      </ScrollArea>
      
      <div className="p-4 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
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
