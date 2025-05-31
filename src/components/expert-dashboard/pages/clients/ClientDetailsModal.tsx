
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MessageSquare, Phone, Video, Mail, MapPin } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  totalSessions: number;
  lastSession: string;
  nextAppointment?: string;
  notes: string;
  avatar?: string;
}

interface ClientDetailsModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ client, isOpen, onClose }) => {
  if (!client) return null;

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Client Details</DialogTitle>
          <DialogDescription>Manage client information and history</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Client Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback>
                {client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{client.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(client.status)}
                <span className="text-sm text-gray-500">
                  {client.totalSessions} sessions completed
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{client.location}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Session Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Last Session:</span>
                  <span className="ml-2">{client.lastSession}</span>
                </div>
                {client.nextAppointment && (
                  <div>
                    <span className="text-gray-500">Next Appointment:</span>
                    <span className="ml-2">{client.nextAppointment}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Total Sessions:</span>
                  <span className="ml-2">{client.totalSessions}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h4 className="font-medium mb-2">Notes</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {client.notes || 'No notes available'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4 mr-2" />
              Video Call
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsModal;
