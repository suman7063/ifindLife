import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthContext';
import { UserProfile } from '@/types/supabase';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { CalendarIcon, CreditCard, Settings, User2 } from 'lucide-react';
import { format } from 'date-fns';
import { UserTransaction } from '@/types/supabase/transactions';

const UserDashboard: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (state.userProfile) {
      setProfile(state.userProfile);
    }
  }, [state.userProfile]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Mock transactions data
        const mockTransactions = [
          { id: '1', user_id: 'user1', amount: 50, currency: 'USD', status: 'completed', created_at: '2024-01-20T10:00:00Z', transaction_type: 'deposit', type: 'deposit', description: 'Wallet deposit' },
          { id: '2', user_id: 'user1', amount: 20, currency: 'USD', status: 'completed', created_at: '2024-01-15T14:30:00Z', transaction_type: 'withdrawal', type: 'withdrawal', description: 'Wallet withdrawal' },
          { id: '3', user_id: 'user1', amount: 30, currency: 'USD', status: 'completed', created_at: '2024-01-10T08:45:00Z', transaction_type: 'payment', type: 'payment', description: 'Service payment' },
        ];
        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserSettings = async () => {
      try {
        // Mock user settings data
        const mockUserSettings = {
          theme: 'light',
          notificationsEnabled: true,
        };
        setUserSettings(mockUserSettings);
      } catch (error) {
        console.error('Failed to fetch user settings:', error);
      }
    };

    fetchTransactions();
    fetchUserSettings();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formattedTransactions = transactions.map(transaction => ({
    ...transaction,
    date: transaction.date || new Date(transaction.created_at).toLocaleDateString(),
    type: transaction.type || transaction.transaction_type,
    payment_id: transaction.payment_id || '',
    payment_method: transaction.payment_method || 'Wallet',
    description: transaction.description || 'Transaction' // Ensure description is always present
  })) as UserTransaction[];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={profile?.profile_picture} alt={profile?.name} />
              <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{profile?.name}</h2>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <User2 className="mr-2 h-4 w-4 inline-block" />
                    User ID: {state.user?.id}
                  </p>
                  <p>
                    <CalendarIcon className="mr-2 h-4 w-4 inline-block" />
                    Joined: {state.user?.created_at}
                  </p>
                  <p>
                    <Settings className="mr-2 h-4 w-4 inline-block" />
                    Theme: {userSettings?.theme}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xl font-semibold">
                    <CreditCard className="mr-2 h-5 w-5 inline-block" />
                    Balance: ${state.walletBalance}
                  </p>
                  <Button size="sm" asChild>
                    <Link to="/add-funds">Add Funds</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent transactions on iFind</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formattedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.date}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>
                          {transaction.status === 'completed' ? (
                            <Badge variant="outline">Completed</Badge>
                          ) : (
                            transaction.status
                          )}
                        </TableCell>
                        <TableCell className="text-right">${transaction.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button onClick={() => navigate('/user-profile-edit')}>Edit Profile</Button>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
