
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { 
  MoreHorizontal, 
  Ban, 
  CheckCircle2, 
  Pencil, 
  Search, 
  Mail, 
  Eye, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  currency: string | null;
  wallet_balance: number | null;
  created_at: string | null;
  reward_points: number | null;
}

const AdminUsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('AdminUsersList: Fetching users from Supabase...');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('AdminUsersList: Error fetching users:', error);
        throw error;
      }
      
      console.log('AdminUsersList: Found users:', data?.length || 0);
      setUsers(data as User[] || []);
      
    } catch (error) {
      console.error('AdminUsersList: Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const handleSuspendUser = (userId: string) => {
    toast.success(`User ${userId} suspended`);
  };

  const handleActivateUser = (userId: string) => {
    toast.success(`User ${userId} activated`);
  };

  const handleSendEmail = (userId: string) => {
    toast.success(`Email being composed for user ${userId}`);
  };

  const handleViewDetails = (userId: string) => {
    toast.info(`Viewing details for user ${userId}`);
  };

  const confirmDelete = () => {
    if (selectedUserId) {
      toast.success(`User ${selectedUserId} deleted`);
      setDeleteConfirmOpen(false);
      setSelectedUserId(null);
    }
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteConfirmOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getUserStatus = (user: User) => {
    // Simple logic - could be enhanced based on business rules
    const hasRecentActivity = user.created_at && 
      new Date(user.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
    return hasRecentActivity ? 'Active' : 'Inactive';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'Inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'Suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-muted-foreground">
            {loading ? 'Loading users...' : 
             error ? 'Error loading users' :
             `${users.length} ${users.length === 1 ? 'user' : 'users'} found`}
          </p>
        </div>
        <Button 
          onClick={fetchUsers} 
          disabled={loading}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Users</CardTitle>
          <CardDescription>
            Manage users registered on the platform
          </CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ifind-teal"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-500 font-medium">{error}</p>
              <Button onClick={fetchUsers} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        <div className="flex flex-col items-center py-4">
                          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            {searchTerm ? 'No users match your search' : 'No users found'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const status = getUserStatus(user);
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                          <TableCell>{user.email || 'N/A'}</TableCell>
                          <TableCell>{user.phone || 'N/A'}</TableCell>
                          <TableCell>
                            {user.city && user.country ? `${user.city}, ${user.country}` : 
                             user.country || user.city || 'N/A'}
                          </TableCell>
                          <TableCell>{getStatusBadge(status)}</TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {user.currency || 'USD'} {(user.wallet_balance || 0).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewDetails(user.id)}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendEmail(user.id)}>
                                  <Mail className="mr-2 h-4 w-4" /> Send Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {status === 'Active' ? (
                                  <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                                    <Ban className="mr-2 h-4 w-4" /> Suspend
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Activate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteClick(user.id)}
                                  className="text-red-600"
                                >
                                  Delete Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsersList;
