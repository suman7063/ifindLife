
import React, { useEffect, useState } from 'react';
import ExpertProfileSummary from './ExpertProfileSummary';
import SidebarNavItem from './SidebarNavItem';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard,
  User,
  Calendar,
  Users,
  BarChart,
  Settings,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMessaging } from '@/hooks/useMessaging';

const ExpertSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, expertProfile } = useAuth();
  // Fix: Pass the current expert profile ID to the useMessaging hook
  const { conversations, fetchConversations } = useMessaging(expertProfile);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread message count
  useEffect(() => {
    if (expertProfile?.id) {
      fetchConversations();
    }
  }, [expertProfile?.id, fetchConversations]);

  useEffect(() => {
    // Calculate total unread messages
    const totalUnread = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);
    setUnreadCount(totalUnread);
  }, [conversations]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/expert-login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="w-64 border-r h-screen flex flex-col bg-background">
      <div className="p-4">
        {expertProfile && <ExpertProfileSummary expert={expertProfile} />}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        <SidebarNavItem to="/expert-dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <SidebarNavItem to="/expert-dashboard/profile" icon={<User size={18} />} label="Profile" />
        <SidebarNavItem to="/expert-dashboard/schedule" icon={<Calendar size={18} />} label="Schedule" />
        <SidebarNavItem to="/expert-dashboard/clients" icon={<Users size={18} />} label="Clients" />
        <SidebarNavItem 
          to="/expert-dashboard/messages" 
          icon={<MessageSquare size={18} />} 
          label="Messages"
          badge={unreadCount}
        />
        <SidebarNavItem to="/expert-dashboard/analytics" icon={<BarChart size={18} />} label="Analytics" />
        <SidebarNavItem to="/expert-dashboard/settings" icon={<Settings size={18} />} label="Settings" />
      </nav>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
};

export default ExpertSidebar;
