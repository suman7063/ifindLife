
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { HelpTicket } from '../types';

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
      // Start building the query with direct join to profiles
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
      
      if (data) {
        // Process and map the data to the HelpTicket interface
        const formattedData = data.map(ticket => {
          // Set default values
          let userName = 'Unknown User';
          let userEmail = 'No Email';
          
          // Simplified profile data access with proper null checks
          if (ticket.profiles) {
            // TypeScript should now properly understand this isn't null
            if (ticket.profiles.name) {
              userName = ticket.profiles.name;
            }
            
            if (ticket.profiles.email) {
              userEmail = ticket.profiles.email;
            }
          }
          
          // Create a new object explicitly matching HelpTicket interface
          const helpTicket: HelpTicket = {
            id: ticket.id,
            ticket_id: ticket.ticket_id,
            user_id: ticket.user_id,
            user_name: userName,
            user_email: userEmail,
            category: ticket.category,
            details: ticket.details,
            screenshot_url: ticket.screenshot_url,
            status: ticket.status,
            created_at: ticket.created_at,
            updated_at: ticket.updated_at,
            resolved_at: ticket.resolved_at,
            admin_notes: ticket.admin_notes
          };
          
          return helpTicket;
        });
        
        setTickets(formattedData);
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
