
import React from 'react';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HelpTicket } from "../types";

interface TicketDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTicket: HelpTicket | null;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  ticketStatus: string;
  setTicketStatus: (status: string) => void;
  isUpdating: boolean;
  onUpdateTicket: () => Promise<void>;
}

export const TicketDetailDialog: React.FC<TicketDetailDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedTicket,
  adminNotes,
  setAdminNotes,
  ticketStatus,
  setTicketStatus,
  isUpdating,
  onUpdateTicket,
}) => {
  if (!selectedTicket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onUpdateTicket} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Ticket'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
