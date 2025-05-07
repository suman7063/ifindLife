
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ClientDetailsDialogProps {
  client: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointments?: any[];
}

const ClientDetailsDialog: React.FC<ClientDetailsDialogProps> = ({
  client,
  open,
  onOpenChange,
  appointments = []
}) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const clientAppointments = appointments.filter(apt => apt.user_id === client.id);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Client Details</DialogTitle>
          <DialogDescription>
            View detailed information about this client.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={client.profile_picture} alt={client.name} />
            <AvatarFallback className="text-lg">{getInitials(client.name || 'Client')}</AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-semibold">{client.name || 'Client'}</h3>
          
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{clientAppointments.length} appointments</Badge>
            <Badge variant="outline">
              Client since {formatDistanceToNow(new Date(client.joined_at || new Date()), { addSuffix: true })}
            </Badge>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{client.email || 'No email provided'}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{client.phone || 'No phone provided'}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>
              {client.city && client.country ? `${client.city}, ${client.country}` : 'No location provided'}
            </span>
          </div>
        </div>
        
        <Separator />
        
        <div className="py-2">
          <h4 className="font-medium mb-3">Recent Appointments</h4>
          
          {clientAppointments.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {clientAppointments.slice(0, 3).map((appointment, index) => (
                <Card key={index} className="bg-muted/40">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.appointment_date}</span>
                      </div>
                      <Badge 
                        variant={appointment.status === 'completed' ? 'default' : 'outline'}
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.start_time} - {appointment.end_time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {clientAppointments.length > 3 && (
                <p className="text-sm text-center text-muted-foreground">
                  {clientAppointments.length - 3} more appointments not shown
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No appointments found for this client.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;
