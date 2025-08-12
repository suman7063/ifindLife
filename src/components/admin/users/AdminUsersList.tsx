
import React, { useState } from 'react';
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
  AlertCircle 
} from 'lucide-react';

// Sample user data for demonstration
const users = [
  { 
    id: "1", 
    name: "John Doe", 
    email: "john@example.com", 
    role: "Client", 
    status: "Active",
    joinDate: "2025-01-15",
    lastActive: "2025-04-07"
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    email: "jane@example.com", 
    role: "Client", 
    status: "Active",
    joinDate: "2025-02-20",
    lastActive: "2025-04-06"
  },
  { 
    id: "3", 
    name: "Robert Johnson", 
    email: "robert@example.com", 
    role: "Client", 
    status: "Inactive",
    joinDate: "2025-03-05",
    lastActive: "2025-03-15"
  },
  { 
    id: "4", 
    name: "Sarah Williams", 
    email: "sarah@example.com", 
    role: "Client", 
    status: "Suspended",
    joinDate: "2025-01-10",
    lastActive: "2025-02-25"
  },
  { 
    id: "5", 
    name: "Michael Brown", 
    email: "michael@example.com", 
    role: "Client", 
    status: "Active",
    joinDate: "2025-03-28",
    lastActive: "2025-04-05"
  }
];

const AdminUsersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className="text-muted-foreground">View and manage platform users</p>
        </div>
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <div className="flex flex-col items-center py-4">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
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
                            {user.status === 'Active' ? (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
