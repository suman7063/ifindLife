
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TicketFilter } from './components/TicketFilter';
import { TicketList } from './components/TicketList';
import { TicketDetailDialog } from './components/TicketDetailDialog';
import { useTickets } from './hooks/useTickets';

const statusOptions = ["All", "Pending", "In Progress", "Resolved", "Closed"];

const HelpTicketsManager: React.FC = () => {
  const {
    tickets,
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
  } = useTickets();

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
          {/* Filter Component */}
          <TicketFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            statusOptions={statusOptions}
          />

          {/* Tickets List Component */}
          <TicketList 
            tickets={tickets}
            loading={loading}
            onViewDetails={handleOpenDetail}
          />
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog Component */}
      <TicketDetailDialog 
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        selectedTicket={selectedTicket}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        ticketStatus={ticketStatus}
        setTicketStatus={setTicketStatus}
        isUpdating={isUpdating}
        onUpdateTicket={handleUpdateTicket}
      />
    </div>
  );
};

export default HelpTicketsManager;
