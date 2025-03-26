
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Wallet, Users, ShoppingBag, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Label } from '@/components/ui/label';
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserProfile, UserTransaction } from '@/types/supabase';
import ReferralDashboardCard from '@/components/user/ReferralDashboardCard';
import RazorPayCheckout from '@/components/user/RazorPayCheckout';

const WalletBalanceCard: React.FC<{ userProfile: UserProfile | null; onRecharge: () => void }> = ({ userProfile, onRecharge }) => {
  return (
    <Card className="border-ifind-aqua/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Wallet className="mr-2 h-4 w-4 text-ifind-aqua" />
          Wallet Balance
        </CardTitle>
        <CreditCard className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {userProfile?.currency} {userProfile?.walletBalance?.toFixed(2) || '0.00'}
        </div>
        <p className="text-xs text-gray-500">
          Available for transactions and course enrollments
        </p>
      </CardContent>
      <Button onClick={onRecharge} className="w-full mt-4 bg-ifind-aqua hover:bg-ifind-teal transition-colors">
        Recharge Wallet
      </Button>
    </Card>
  );
};

const RecentTransactionsCard: React.FC<{ transactions: UserTransaction[] }> = ({ transactions }) => {
  return (
    <Card className="border-ifind-aqua/10">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center">
          <CreditCard className="mr-2 h-4 w-4 text-ifind-aqua" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 5).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell className="text-right">{transaction.currency} {transaction.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4 text-gray-500">No recent transactions</div>
        )}
      </CardContent>
    </Card>
  );
};

const UserDashboard = () => {
  const { currentUser, isAuthenticated, logout, authLoading, user } = useUserAuth();
  const navigate = useNavigate();
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    // Set a timer to stop showing the loading state after a maximum time
    // This prevents an indefinite loading state if something goes wrong
    const timer = setTimeout(() => {
      setDashboardLoading(false);
    }, 3000);

    // If we have a user or a current user, stop loading
    if ((isAuthenticated && currentUser) || user) {
      setDashboardLoading(false);
      clearTimeout(timer);
    }

    // If not authenticated and finished loading, redirect to login
    if (!isAuthenticated && !authLoading) {
      console.log("Not authenticated, redirecting to login");
      navigate('/user-login');
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, currentUser, authLoading, user]);

  const handleLogout = async () => {
    await logout();
  };

  const handleOpenRechargeDialog = () => {
    setIsRechargeDialogOpen(true);
  };

  const handleCloseRechargeDialog = () => {
    setIsRechargeDialogOpen(false);
    setRechargeAmount('');
  };

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Your wallet has been recharged.');
    handleCloseRechargeDialog();
    // The wallet balance will be updated by the edge function
  };

  const handlePaymentCancel = () => {
    toast.info('Payment was cancelled.');
    setIsProcessingPayment(false);
  };

  // Show loading state if dashboard is still initializing
  if (dashboardLoading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-ifind-aqua" />
            <h2 className="text-2xl font-semibold">Loading your dashboard...</h2>
            <p className="text-gray-500">Please wait while we fetch your information</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Safety check - if somehow we get here without being authenticated, redirect to login
  if (!isAuthenticated && !user) {
    console.log("Not authenticated (safety check), redirecting to login");
    navigate('/user-login');
    return null;
  }

  // This renders a basic dashboard if we have a user but not a current user profile yet
  if (!currentUser && user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-10">
          <div className="container max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gradient mb-2">Welcome, {user.email?.split('@')[0] || 'User'}!</h1>
              <p className="text-gray-600">Your profile is being set up.</p>
            </div>
            
            <Card className="border-ifind-aqua/10 p-6">
              <CardTitle className="mb-4">Setting Up Your Profile</CardTitle>
              <CardDescription className="text-base">
                We're currently setting up your user profile. This may take a moment. If this persists,
                please try logging out and logging back in.
              </CardDescription>
              <Button onClick={handleLogout} className="mt-6 bg-ifind-aqua hover:bg-ifind-teal transition-colors">Logout</Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">Welcome, {currentUser?.name || user?.email?.split('@')[0] || 'User'}!</h1>
            <p className="text-gray-600">Here's an overview of your account.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <WalletBalanceCard userProfile={currentUser} onRecharge={handleOpenRechargeDialog} />
            <RecentTransactionsCard transactions={currentUser?.transactions || []} />
            <ReferralDashboardCard userProfile={currentUser || { id: user?.id || '', referralCode: '', email: user?.email || '' } as UserProfile} />
          </div>

          <Dialog open={isRechargeDialogOpen} onOpenChange={setIsRechargeDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Recharge Wallet</DialogTitle>
                <DialogDescription>
                  Enter the amount you want to add to your wallet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    type="number"
                    id="amount"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              
              {parseFloat(rechargeAmount) > 0 ? (
                <RazorPayCheckout 
                  amount={parseFloat(rechargeAmount)}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                />
              ) : (
                <Button disabled className="w-full bg-ifind-aqua/50">
                  Enter an amount to continue
                </Button>
              )}
              
              <Button type="button" variant="secondary" onClick={handleCloseRechargeDialog} className="mt-2 w-full">
                Cancel
              </Button>
            </DialogContent>
          </Dialog>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-ifind-aqua/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="mr-2 h-4 w-4 text-ifind-aqua" />
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentUser?.enrolledCourses?.length || 0}</div>
                <p className="text-xs text-gray-500">Courses you've enrolled in</p>
              </CardContent>
            </Card>

            <Card className="border-ifind-aqua/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4 text-ifind-aqua" />
                  Purchased Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-gray-500">Services you've purchased</p>
              </CardContent>
            </Card>

            <Card className="border-ifind-aqua/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4 text-ifind-aqua" />
                  Reviews Given
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentUser?.reviews?.length || 0}</div>
                <p className="text-xs text-gray-500">Reviews you've submitted</p>
              </CardContent>
            </Card>

            <Card className="border-ifind-aqua/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <ShieldCheck className="mr-2 h-4 w-4 text-ifind-aqua" />
                  Reports Submitted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentUser?.reports?.length || 0}</div>
                <p className="text-xs text-gray-500">Reports you've submitted</p>
              </CardContent>
            </Card>
          </div>

          <Button onClick={handleLogout} className="mt-8 bg-ifind-aqua hover:bg-ifind-teal transition-colors">Logout</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
