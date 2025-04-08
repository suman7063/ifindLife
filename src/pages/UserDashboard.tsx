
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';
import { useAuthSynchronization } from '@/hooks/useAuthSynchronization';
import { UserTransaction } from '@/types/supabase/tables';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

// Import dashboard components
import DashboardHeader from '@/components/user/dashboard/DashboardHeader';
import WalletSection from '@/components/user/dashboard/WalletSection';
import UserStatsSummary from '@/components/user/dashboard/UserStatsSummary';
import RechargeDialog from '@/components/user/dashboard/RechargeDialog';
import { useDashboardState } from '@/hooks/user-dashboard/useDashboardState';

const UserDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  
  const { currentUser, isAuthenticated, logout } = useUserAuth();
  const { isAuthInitialized, isAuthLoading } = useAuthSynchronization();
  const { dashboardLoading } = useDashboardState();
  const navigate = useNavigate();

  // Fetch user transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (currentUser?.id) {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('user_transactions')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('date', { ascending: false });

          if (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transaction history');
          } else {
            // Convert the response to match the UserTransaction type
            const formattedTransactions = (data || []).map(item => ({
              id: item.id,
              user_id: item.user_id,
              amount: item.amount,
              currency: item.currency || 'USD',
              type: item.type as 'credit' | 'debit',
              transaction_type: item.type,
              description: item.description,
              date: item.date || new Date().toISOString(),
              status: item.status || 'completed',
              created_at: item.date || new Date().toISOString()
            })) as UserTransaction[];
            
            setTransactions(formattedTransactions);
          }
        } catch (error) {
          console.error('Error in transaction fetch:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (isAuthenticated && currentUser) {
      fetchTransactions();
    }
  }, [currentUser, isAuthenticated]);

  // Handle logout
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
  
  // Handle recharge dialog
  const handleOpenRechargeDialog = () => {
    setIsRechargeDialogOpen(true);
  };
  
  const handleRechargeSuccess = () => {
    setIsRechargeDialogOpen(false);
    toast.success('Funds added to your wallet successfully!');
    // Refetch transactions after successful recharge
    if (currentUser?.id) {
      supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('date', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            // Convert the response to match the UserTransaction type
            const formattedTransactions = (data || []).map(item => ({
              id: item.id,
              user_id: item.user_id,
              amount: item.amount,
              currency: item.currency || 'USD',
              type: item.type as 'credit' | 'debit',
              transaction_type: item.type,
              description: item.description,
              date: item.date || new Date().toISOString(),
              status: item.status || 'completed',
              created_at: item.date || new Date().toISOString()
            })) as UserTransaction[];
            
            setTransactions(formattedTransactions);
          }
        });
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !dashboardLoading && isAuthInitialized && !isAuthenticated) {
      navigate('/user-login');
    }
  }, [isAuthenticated, isAuthLoading, dashboardLoading, isAuthInitialized, navigate]);

  // Show loading state
  if (isAuthLoading || dashboardLoading) {
    return (
      <Container className="py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  // Show if not authenticated
  if (!isAuthenticated) {
    return null; // Redirecting via useEffect
  }

  return (
    <Container className="py-8">
      <DashboardHeader user={currentUser} />
      
      <div className="mt-6">
        <UserStatsSummary user={currentUser} />
        
        <Tabs defaultValue="wallet" className="mt-6">
          <TabsList>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="purchases">Your Purchases</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <WalletSection 
                user={currentUser} 
                transactions={transactions} 
                onRecharge={handleOpenRechargeDialog} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="purchases" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Purchases</h2>
              
              <div className="bg-muted p-8 rounded-md text-center">
                <p>You haven't made any purchases yet.</p>
                <p className="text-muted-foreground mt-2">
                  Explore our services and programs to get started.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Favorites</h2>
              
              <div className="bg-muted p-8 rounded-md text-center">
                <p>You haven't added any favorites yet.</p>
                <p className="text-muted-foreground mt-2">
                  Find experts and programs you like and add them to favorites.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <RechargeDialog 
        open={isRechargeDialogOpen}
        onOpenChange={setIsRechargeDialogOpen}
        onSuccess={handleRechargeSuccess}
      />
    </Container>
  );
};

export default UserDashboard;
