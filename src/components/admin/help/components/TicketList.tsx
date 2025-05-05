
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { HelpTicket } from "../types";

interface TicketListProps {
  tickets: HelpTicket[];
  loading: boolean;
  onViewDetails: (ticket: HelpTicket) => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  loading,
  onViewDetails,
}) => {
  return (
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
          ) : tickets.length > 0 ? (
            tickets.map((ticket) => (
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
                    onClick={() => onViewDetails(ticket)}
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
  );
};
