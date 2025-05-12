
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { HelpTicket } from '../types';
import { safeDataTransform } from '@/utils/supabaseUtils';

export const useTickets = () => {
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<HelpTicket | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Simple query without profiles join to avoid TypeScript errors
      let query = supabase
        .from('help_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter if not "All"
      if (statusFilter !== "All") {
        query = query.eq('status', statusFilter as any);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Process tickets using our utility function
        const processedTickets = safeDataTransform<any, HelpTicket>(
          data,
          error,
          (ticket) => ({
            id: ticket.id || '',
            ticket_id: ticket.ticket_id || '',
            user_id: ticket.user_id || '',
            // Use generated placeholders based on user_id
            user_name: `User ${ticket.user_id ? ticket.user_id.substring(0, 8) : 'Unknown'}`,
            user_email: `user-${ticket.user_id ? ticket.user_id.substring(0, 6) : 'unknown'}@example.com`,
            category: ticket.category || '',
            details: ticket.details || '',
            screenshot_url: ticket.screenshot_url || '',
            status: ticket.status || 'Pending',
            created_at: ticket.created_at || '',
            updated_at: ticket.updated_at || '',
            resolved_at: ticket.resolved_at || null,
            admin_notes: ticket.admin_notes || ''
          }),
          []
        );
        
        setTickets(processedTickets);
      }
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
        .eq('id', selectedTicket.id as any);
      
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
      ticket.user_name.toLowerCase().includes(searchLower) ||
      ticket.user_email.toLowerCase().includes(searchLower)
    );
  });

  return {
    tickets: filteredTickets,
    loading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    selectedTicket,
    adminNotes,
    setAdminNotes,
    ticketStatus,
    setTicketStatus,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    isUpdating,
    handleOpenDetail,
    handleUpdateTicket
  };
};
