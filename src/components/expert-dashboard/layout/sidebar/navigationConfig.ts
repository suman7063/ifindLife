
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Wallet,
  UserCircle,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

export interface NavigationItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    href: "/expert/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard"
  },
  {
    href: "/expert/dashboard/profile",
    icon: UserCircle,
    label: "Profile"
  },
  {
    href: "/expert/dashboard/schedule",
    icon: Calendar,
    label: "Schedule",
    badge: "8"
  },
  {
    href: "/expert/dashboard/clients",
    icon: Users,
    label: "Clients",
    badge: "12"
  },
  {
    href: "/expert/dashboard/services",
    icon: Briefcase,
    label: "Services"
  },
  {
    href: "/expert/dashboard/messages",
    icon: MessageSquare,
    label: "Messages",
    badge: "3"
  },
  {
    href: "/expert/dashboard/earnings",
    icon: Wallet,
    label: "Earnings"
  },
  {
    href: "/expert/dashboard/reports",
    icon: AlertCircle,
    label: "Report User"
  }
];
