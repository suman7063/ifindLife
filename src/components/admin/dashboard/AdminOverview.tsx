
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/admin-auth';
import { Users, Briefcase, MessageSquare, FileText, ClipboardCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminOverviewProps {
  expertCount: number;
  servicesCount: number;
  testimonialsCount: number;
  isLoading: boolean;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({
  expertCount,
  servicesCount,
  testimonialsCount,
  isLoading
}) => {
  const { currentUser } = useAuth();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-16 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Experts',
      count: expertCount,
      description: 'Registered professional experts',
      icon: <Users className="h-8 w-8 text-blue-500" />,
      permission: 'experts'
    },
    {
      title: 'Services',
      count: servicesCount,
      description: 'Available wellness services',
      icon: <Briefcase className="h-8 w-8 text-green-500" />,
      permission: 'services'
    },
    {
      title: 'Testimonials',
      count: testimonialsCount,
      description: 'Client reviews',
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
      permission: 'testimonials'
    },
    {
      title: 'Blog Posts',
      count: 12, // This would be real data from supabase in a full implementation
      description: 'Published articles',
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      permission: 'blog'
    },
    {
      title: 'Contact Inquiries',
      count: 24, // This would be real data from supabase in a full implementation
      description: 'Pending responses',
      icon: <ClipboardCheck className="h-8 w-8 text-red-500" />,
      permission: 'contact'
    }
  ];

  // Filter cards based on user permissions
  const filteredCards = statCards.filter(card => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;
    return currentUser.permissions[card.permission as keyof typeof currentUser.permissions];
  });

  return (
    <div className="space-y-6">
      <div className="border-b pb-4 mb-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {currentUser?.username}! Here's an overview of your platform.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{card.count}</span>
                {card.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
