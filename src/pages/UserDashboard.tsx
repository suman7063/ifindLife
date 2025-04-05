
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase';
import { LogOut, User as UserIcon, Settings, CreditCard, BookOpen, Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { currentUser, isAuthenticated, logout } = useUserAuth();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      // Type assertion to treat UserProfile as compatible with User
      // This is safe because we're only using common properties
      const userForDashboard = currentUser as unknown as User;
      setUser(userForDashboard);
    } else if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/user-login');
    }
  }, [currentUser, isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-8">
        <p>Please log in to view your dashboard.</p>
        <Button asChild>
          <Link to="/login">Log In</Link>
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>View and manage your profile details.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={currentUser?.profile_picture} alt={currentUser?.name || "Profile Picture"} />
              <AvatarFallback>{currentUser?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{currentUser?.name || 'User'}</p>
              <p className="text-muted-foreground">{currentUser?.email}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/user-profile-edit">
                <UserIcon className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences and security.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                <Link to="/change-password" className="hover:underline">Change Password</Link>
              </li>
              <li className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <Link to="/billing" className="hover:underline">Billing Information</Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>View your enrolled courses and progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have enrolled in 0 courses.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/courses">
                <BookOpen className="mr-2 h-4 w-4" /> View Courses
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorites</CardTitle>
            <CardDescription>Access your favorite experts and resources.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 0 experts in your favorites.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/experts">
                <Heart className="mr-2 h-4 w-4" /> View Experts
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referrals</CardTitle>
            <CardDescription>Share your referral code and earn rewards.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Share your referral code with friends and family.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/referrals">
                <Share2 className="mr-2 h-4 w-4" /> View Referrals
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
};

export default UserDashboard;
