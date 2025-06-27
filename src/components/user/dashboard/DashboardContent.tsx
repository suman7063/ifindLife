
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from '@/types/database/unified';
import { Calendar, MessageCircle, Heart, Trophy, DollarSign, Users } from 'lucide-react';

interface Props {
  user?: UserProfile | any;
  currentUser?: any;
  [key: string]: any;
}

const DashboardContent: React.FC<Props> = ({ user, ...otherProps }) => {
  if (!user) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Favorite Experts",
      value: user.favorite_experts?.length || 0,
      icon: Heart,
      description: "Experts you've favorited"
    },
    {
      title: "Enrolled Programs",
      value: user.favorite_programs?.length || 0,
      icon: Trophy,
      description: "Programs you're enrolled in"
    },
    {
      title: "Wallet Balance",
      value: `$${user.wallet_balance || 0}`,
      icon: DollarSign,
      description: "Your current balance"
    },
    {
      title: "Recent Activities",
      value: user.recent_activities?.length || 0,
      icon: Calendar,
      description: "Activities this month"
    },
    {
      title: "Messages",
      value: "0", // Placeholder
      icon: MessageCircle,
      description: "Unread messages"
    },
    {
      title: "Reviews",
      value: user.reviews?.length || 0,
      icon: Users,
      description: "Reviews given"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardContent;
