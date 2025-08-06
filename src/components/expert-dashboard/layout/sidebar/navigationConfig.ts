
import { 
  Home, 
  User, 
  Calendar, 
  Users, 
  MessageSquare, 
  Briefcase, 
  DollarSign,
  BarChart3,
  Flag,
  Phone,
  LogOut,
  type LucideIcon
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
}

// Expert category mappings
export const expertCategoryLabels = {
  'listening-volunteer': 'Listening Volunteer',
  'listening-expert': 'Listening Expert', 
  'mindfulness-expert': 'Mindfulness Expert',
  'life-coach': 'Life Coach',
  'spiritual-mentor': 'Spiritual Mentor'
} as const;

export const navigationItems: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/expert-dashboard',
    icon: Home,
    description: 'Overview and quick stats'
  },
  {
    name: 'Analytics', 
    href: '/expert-dashboard/analytics',
    icon: BarChart3,
    description: 'Detailed performance insights'
  },
  {
    name: 'Profile',
    href: '/expert-dashboard/profile',
    icon: User,
    description: 'Manage your professional profile'
  },
  {
    name: 'Schedule',
    href: '/expert-dashboard/schedule',
    icon: Calendar,
    description: 'Manage appointments and availability'
  },
  {
    name: 'Call Management',
    href: '/expert-dashboard/calls',
    icon: Phone,
    description: 'Manage live calls and communication'
  },
  {
    name: 'Clients',
    href: '/expert-dashboard/clients',
    icon: Users,
    description: 'View and manage your clients'
  },
  {
    name: 'Messages',
    href: '/expert-dashboard/messages',
    icon: MessageSquare,
    description: 'Communicate with clients',
    badge: '3'
  },
  {
    name: 'Earnings',
    href: '/expert-dashboard/earnings',
    icon: DollarSign,
    description: 'Track earnings and payouts'
  },
  {
    name: 'Reports',
    href: '/expert-dashboard/reports',
    icon: Flag,
    description: 'Handle user reports'
  },
  {
    name: 'Log Out',
    href: '/logout',
    icon: LogOut,
    description: 'Sign out of your account'
  }
];
