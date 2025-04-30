
import React, { useState, ReactNode } from 'react';
import AdminHeader from '../AdminHeader';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  Users, Settings, LayoutDashboard, UserCheck, BookOpen, 
  MessageSquare, PanelLeft, Phone, List, Palette, BookText,
  BarChart3, MonitorSmartphone 
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type AdminDashboardLayoutProps = {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

type SidebarLink = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children,
  activeTab,
  setActiveTab
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };
  
  const sidebarLinks: SidebarLink[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'experts', label: 'Experts', icon: <Users size={20} /> },
    { id: 'expertApprovals', label: 'Expert Approvals', icon: <UserCheck size={20} /> },
    { id: 'services', label: 'Services', icon: <List size={20} /> },
    { id: 'herosection', label: 'Hero Section', icon: <Palette size={20} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={20} /> },
    { id: 'programs', label: 'Programs', icon: <BookOpen size={20} /> },
    { id: 'sessions', label: 'Sessions', icon: <MonitorSmartphone size={20} /> },
    { id: 'referrals', label: 'Referrals', icon: <BarChart3 size={20} /> },
    { id: 'blog', label: 'Blog', icon: <BookText size={20} /> },
    { id: 'contact', label: 'Contact Submissions', icon: <Phone size={20} /> },
    { id: 'adminUsers', label: 'Admin Users', icon: <Users size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];
  
  return (
    <div className="min-h-screen bg-muted/40">
      <AdminHeader toggleSidebar={toggleSidebar} />
      
      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={cn(
            "h-[calc(100vh-4rem)] bg-background border-r transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "w-[60px]" : "w-[240px]"
          )}
        >
          <ScrollArea className="h-full">
            <div className="p-2">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-2 py-2 mb-1 rounded-md text-sm transition-colors",
                    activeTab === link.id 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <div className="flex-shrink-0">
                    {link.icon}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="truncate">{link.label}</span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>
        
        {/* Main content */}
        <main className={cn(
          "flex-1 p-6 transition-all",
          sidebarCollapsed ? "ml-[60px]" : "ml-[240px]"
        )}>
          <div className="container max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
