
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useMessaging } from '@/hooks/messaging/useMessaging';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquareDot, Calendar, Users, Activity, DollarSign, Settings, LogOut } from 'lucide-react';

const ExpertSidebar = () => {
  const { expertProfile, logout } = useAuth();
  const { conversations, fetchConversations } = useMessaging();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const unreadCount = conversations.reduce((count, conversation) => {
    return count + (conversation.unreadCount || 0);
  }, 0);
  
  return (
    <div className="w-64 border-r h-screen flex flex-col bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={expertProfile?.profile_picture} />
            <AvatarFallback>{expertProfile?.name?.substring(0, 2).toUpperCase() || 'EX'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{expertProfile?.name || 'Expert'}</h2>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <nav className="space-y-1">
          <NavLink to="/expert-dashboard" end
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`
            }
          >
            <Activity size={18} />
            Dashboard
          </NavLink>
          
          <NavLink to="/expert-dashboard/appointments"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`
            }
          >
            <Calendar size={18} />
            Appointments
          </NavLink>
          
          <NavLink to="/expert-dashboard/clients"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`
            }
          >
            <Users size={18} />
            Clients
          </NavLink>
          
          <NavLink to="/expert-dashboard/messages"
            className={({ isActive }) => 
              `flex items-center justify-between gap-3 px-3 py-2 rounded-md ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <MessageSquareDot size={18} />
              Messages
            </div>
            {unreadCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                isActive ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
              }`}>
                {unreadCount}
              </span>
            )}
          </NavLink>
          
          <NavLink to="/expert-dashboard/earnings"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`
            }
          >
            <DollarSign size={18} />
            Earnings
          </NavLink>
          
          <NavLink to="/expert-dashboard/settings"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>
      </ScrollArea>
      
      <div className="p-3 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ExpertSidebar;
