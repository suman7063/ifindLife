
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search } from 'lucide-react';

// Define the type for a help ticket
interface HelpTicket {
  id: string;
  ticket_id: string;
  user_id: string;
  category: string;
  details: string;
  screenshot_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  admin_notes: string | null;
  resolved_at: string | null;
  user_name?: string;
  user_email?: string;
}

const statusOptions = ["All", "Pending", "In Progress", "Resolved", "Closed"];

const HelpTicketsManager: React.FC = () => {
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<HelpTicket | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch help tickets from Supabase
  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Start building the query
      let query = supabase
        .from('help_tickets')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      // Apply status filter if not "All"
      if (statusFilter !== "All") {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Format the data to include user name and email from profiles
      const formattedData = data.map(ticket => ({
        ...ticket,
        user_name: ticket.profiles?.name || 'Unknown User',
        user_email: ticket.profiles?.email || 'No Email'
      }));
      
      setTickets(formattedData);
    } catch (error) {
      console.error('Error fetching help tickets:', error);
      toast.error('Failed to load help tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (ticket: HelpTicket) => {
    setSelectedTicket(ticket);
    setAdminNotes(ticket.admin_notes || '');
    setTicketStatus(ticket.status);
    setIsDetailDialogOpen(true);
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    
    setIsUpdating(true);
    try {
      // Determine if we need to set resolved_at timestamp
      const wasResolved = selectedTicket.status !== 'Resolved' && ticketStatus === 'Resolved';
      const wasReopened = selectedTicket.status === 'Resolved' && ticketStatus !== 'Resolved';
      
      const updateData: any = {
        status: ticketStatus,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      };
      
      // Set or clear resolved_at based on status change
      if (wasResolved) {
        updateData.resolved_at = new Date().toISOString();
      } else if (wasReopened) {
        updateData.resolved_at = null;
      }
      
      const { error } = await supabase
        .from('help_tickets')
        .update(updateData)
        .eq('id', selectedTicket.id);
      
      if (error) throw error;
      
      toast.success('Ticket updated successfully');
      setIsDetailDialogOpen(false);
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter tickets by search term
  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.ticket_id.toLowerCase().includes(searchLower) ||
      ticket.category.toLowerCase().includes(searchLower) ||
      ticket.details.toLowerCase().includes(searchLower) ||
      ticket.user_name?.toLowerCase().includes(searchLower) ||
      ticket.user_email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Help Tickets</CardTitle>
          <CardDescription>
            Manage and respond to user help requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tickets..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-[180px]">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading tickets...
                    </TableCell>
                  </TableRow>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono">{ticket.ticket_id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.user_name}</div>
                          <div className="text-xs text-muted-foreground">{ticket.user_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${ticket.status === 'Pending' ? 'bg-amber-100 text-amber-800' : ''}
                          ${ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : ''}
                          ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' : ''}
                          ${ticket.status === 'Closed' ? 'bg-gray-100 text-gray-800' : ''}
                        `}>
                          {ticket.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        {ticket.created_at
                          ? format(new Date(ticket.created_at), 'MMM d, yyyy')
                          : 'Unknown date'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenDetail(ticket)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No tickets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>Ticket {selectedTicket.ticket_id}</DialogTitle>
                <DialogDescription>
                  Submitted {format(new Date(selectedTicket.created_at), 'PPpp')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="col-span-1">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm">Status</h3>
                      <Select
                        value={ticketStatus}
                        onValueChange={setTicketStatus}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm">User Info</h3>
                      <div className="mt-1 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedTicket.user_name}</p>
                        <p><span className="font-medium">Email:</span> {selectedTicket.user_email}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm">Admin Notes</h3>
                      <Textarea 
                        value={adminNotes} 
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add internal notes here..."
                        className="mt-1"
                        rows={5}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div>
                    <h3 className="font-medium text-sm">Category</h3>
                    <p className="mt-1">{selectedTicket.category}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm">Issue Details</h3>
                    <div className="mt-1 bg-muted p-3 rounded-md whitespace-pre-wrap">
                      {selectedTicket.details}
                    </div>
                  </div>
                  
                  {selectedTicket.screenshot_url && (
                    <div>
                      <h3 className="font-medium text-sm">Screenshot</h3>
                      <div className="mt-1 border rounded-md overflow-hidden">
                        <a 
                          href={selectedTicket.screenshot_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <img 
                            src={selectedTicket.screenshot_url} 
                            alt="User provided screenshot" 
                            className="max-h-[300px] object-contain"
                          />
                        </a>
                        <div className="bg-muted p-2 flex justify-end">
                          <a 
                            href={selectedTicket.screenshot_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary flex items-center gap-1"
                          >
                            Open full image <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateTicket} disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Ticket'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpTicketsManager;
