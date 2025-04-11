
import React from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

// Import necessary components here

const UserDashboard = () => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  
  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!currentUser) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we load your dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {currentUser.name}</h1>
        <Button 
          onClick={() => navigate('/wallet')}
          className="bg-ifind-aqua hover:bg-ifind-teal"
        >
          Recharge Wallet
        </Button>
      </div>
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="consultations">My Consultations</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Wallet Balance</CardTitle>
                <CardDescription>Your current balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹ {currentUser.wallet_balance || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Consultations</CardTitle>
                <CardDescription>Total sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentUser.consultation_count || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lifetime consultations
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Referrals</CardTitle>
                <CardDescription>Friends referred</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentUser.referral_count || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Earn rewards when friends sign up!
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest consultations and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Recent activity would be rendered here */}
              <p className="text-muted-foreground">No recent activity to display</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consultations">
          <Card>
            <CardHeader>
              <CardTitle>My Consultations</CardTitle>
              <CardDescription>History of your sessions with experts</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Consultations would be rendered here */}
              <p className="text-muted-foreground">No consultations to display</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Experts</CardTitle>
              <CardDescription>Experts you've added to your favorites</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Favorites would be rendered here */}
              <p className="text-muted-foreground">No favorites to display</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Referrals</CardTitle>
              <CardDescription>Manage your referrals and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Referrals would be rendered here */}
              <p className="text-muted-foreground">No referrals to display</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
