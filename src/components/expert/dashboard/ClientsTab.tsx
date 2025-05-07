
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '@/hooks/user-auth';
import { useAppointments } from '@/hooks/useAppointments';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ClientDetailsDialog from './clients/ClientDetailsDialog';
import { Search, Calendar } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const ClientsTab: React.FC = () => {
  const { currentUser } = useUserAuth();
  const { fetchAppointments, loading } = useAppointments(currentUser);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch appointments
        const appointmentsData = await fetchAppointments();
        setAppointments(appointmentsData || []);
        
        // Extract unique clients from appointments
        const uniqueClientsMap = new Map();
        
        appointmentsData?.forEach((apt: any) => {
          if (apt.user_id && !uniqueClientsMap.has(apt.user_id)) {
            uniqueClientsMap.set(apt.user_id, {
              id: apt.user_id,
              name: apt.user_name || 'Client',
              email: apt.user_email,
              phone: apt.user_phone,
              appointmentCount: 1,
              lastAppointment: apt.appointment_date,
              joined_at: apt.created_at
            });
          } else if (apt.user_id) {
            const client = uniqueClientsMap.get(apt.user_id);
            client.appointmentCount += 1;
            
            // Update last appointment if this one is more recent
            if (new Date(apt.appointment_date) > new Date(client.lastAppointment)) {
              client.lastAppointment = apt.appointment_date;
            }
          }
        });
        
        setClients(Array.from(uniqueClientsMap.values()));
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    };
    
    loadData();
  }, [currentUser, fetchAppointments]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm) ||
    (client.email && client.email.toLowerCase().includes(searchTerm))
  );
  
  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Your Clients</h1>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
      </div>
      
      {clients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-medium mb-2">No Clients Yet</h3>
            <p className="text-muted-foreground">
              When you have appointments with clients, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : filteredClients.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No clients match your search criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.profile_picture} alt={client.name} />
                      <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                    </Avatar>
                    
                    <Badge variant="outline">
                      {client.appointmentCount} {client.appointmentCount === 1 ? 'appointment' : 'appointments'}
                    </Badge>
                  </div>
                  
                  <h3 className="font-medium">{client.name}</h3>
                  {client.email && <p className="text-sm text-muted-foreground">{client.email}</p>}
                  
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Last appointment: {client.lastAppointment}</span>
                  </div>
                </div>
                
                <div className="border-t p-3 bg-muted/30">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => handleViewClient(client)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {selectedClient && (
        <ClientDetailsDialog 
          client={selectedClient}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          appointments={appointments.filter(apt => apt.user_id === selectedClient.id)}
        />
      )}
    </div>
  );
};

export default ClientsTab;
