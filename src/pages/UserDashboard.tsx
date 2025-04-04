import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/supabase';

const UserDashboard = () => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      // Type assertion to treat UserProfile as compatible with User
      // This is safe because we're only using common properties
      const userForDashboard = currentUser as unknown as User;
      setUser(userForDashboard);
    }
  }, [currentUser, isAuthenticated]);

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
      <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>

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
          <CardContent>
            <Button asChild>
              <Link to="/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences and security.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link to="/change-password" className="hover:underline">Change Password</Link>
              </li>
              <li>
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
            <Button asChild>
              <Link to="/courses">View Courses</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorites</CardTitle>
            <CardDescription>Access your favorite experts and resources.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 0 experts in your favorites.</p>
            <Button asChild>
              <Link to="/favorites">View Favorites</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referrals</CardTitle>
            <CardDescription>Share your referral code and earn rewards.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Share your referral code with friends and family.</p>
            <Button asChild>
              <Link to="/referrals">View Referrals</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default UserDashboard;
