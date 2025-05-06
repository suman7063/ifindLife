
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  MessagesSquare, 
  FileText, 
  Settings, 
  DollarSign, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarNavItem from './SidebarNavItem';
import ExpertProfileSummary from './ExpertProfileSummary';

interface ExpertSidebarProps {
  expert: any;
}

const ExpertSidebar: React.FC<ExpertSidebarProps> = ({ expert }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/expert-dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Profile',
      path: '/expert-dashboard/profile',
      icon: User
    },
    {
      name: 'Schedule',
      path: '/expert-dashboard/schedule',
      icon: Calendar
    },
    {
      name: 'Messages',
      path: '/expert-dashboard/messages',
      icon: MessagesSquare
    },
    {
      name: 'Documents',
      path: '/expert-dashboard/documents',
      icon: FileText
    },
    {
      name: 'Earnings',
      path: '/expert-dashboard/earnings',
      icon: DollarSign
    },
    {
      name: 'Settings',
      path: '/expert-dashboard/settings',
      icon: Settings
    }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={cn(
        'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className={cn('overflow-hidden transition-all', collapsed ? 'w-0' : 'w-full')}>
          <h2 className="font-bold text-xl text-ifind-teal">iFind<span className="text-ifind-lavender">Life</span></h2>
        </div>
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      {/* Expert Profile Summary */}
      <ExpertProfileSummary expert={expert} collapsed={collapsed} />
      
      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navigationItems.map((item) => (
          <SidebarNavItem
            key={item.path}
            name={item.name}
            path={item.path}
            icon={item.icon}
            isActive={location.pathname === item.path}
            collapsed={collapsed}
          />
        ))}
      </nav>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        {!collapsed && <p>© {new Date().getFullYear()} iFind Life</p>}
      </div>
    </aside>
  );
};

export default ExpertSidebar;
