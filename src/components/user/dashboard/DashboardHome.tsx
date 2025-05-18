
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/database/unified';
import { 
  Calendar, 
  CreditCard, 
  Heart, 
  BookOpen, 
  MessageSquare,
  ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DashboardHomeProps {
  user: UserProfile | null;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Manage your profile, consultations, and more from your personal dashboard.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.currency} {user.wallet_balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Available balance in your account
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/user-dashboard/wallet" className="text-sm flex items-center">
                Manage wallet <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Upcoming consultations scheduled
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/user-dashboard/appointments" className="text-sm flex items-center">
                View appointments <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Messages awaiting your response
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link to="/user-dashboard/messages" className="text-sm flex items-center">
                View messages <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.favorite_experts && user.favorite_experts.length > 0 ? (
              <div>
                <p>You have {user.favorite_experts.length} saved favorite experts.</p>
                <Button variant="link" className="p-0 h-auto mt-2" asChild>
                  <Link to="/user-dashboard/favorites" className="text-sm flex items-center">
                    View all favorites <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground">You haven't favorited any experts yet.</p>
                <Button variant="link" className="p-0 h-auto mt-2" asChild>
                  <Link to="/experts" className="text-sm flex items-center">
                    Browse experts <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
              My Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.enrolled_courses && user.enrolled_courses.length > 0 ? (
              <div>
                <p>You are enrolled in {user.enrolled_courses.length} programs.</p>
                <Button variant="link" className="p-0 h-auto mt-2" asChild>
                  <Link to="/user-dashboard/programs" className="text-sm flex items-center">
                    View my programs <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground">You aren't enrolled in any programs yet.</p>
                <Button variant="link" className="p-0 h-auto mt-2" asChild>
                  <Link to="/programs" className="text-sm flex items-center">
                    Explore programs <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
