
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUserAuth } from '@/hooks/user-auth';
import ClientDetailsDialog from './ClientDetailsDialog';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  profile_picture?: string;
  appointment_count?: number;
  joined_at?: string;
  last_appointment?: string;
}

const ClientManagement: React.FC = () => {
  const { currentUser } = useUserAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchClients = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // First get all appointments to find unique clients
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('expert_id', currentUser.id);
          
        if (appointmentsError) throw appointmentsError;
        
        setAppointments(appointmentsData || []);
          
        // Get unique client IDs
        const uniqueClientIds = Array.from(new Set(appointmentsData?.map(apt => apt.user_id) || []));
        
        if (uniqueClientIds.length === 0) {
          setClients([]);
          setFilteredClients([]);
          setLoading(false);
          return;
        }
        
        // Fetch client details
        const { data: clientsData, error: clientsError } = await supabase
          .from('users')
          .select('id, name, email, phone, city, country, profile_picture, created_at')
          .in('id', uniqueClientIds);
          
        if (clientsError) throw clientsError;
        
        // Enhance client data with appointment statistics
        const enhancedClients = (clientsData || []).map(client => {
          const clientAppointments = appointmentsData?.filter(apt => apt.user_id === client.id) || [];
          const lastAppointment = clientAppointments.sort((a, b) => 
            new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()
          )[0];
          
          return {
            ...client,
            appointment_count: clientAppointments.length,
            joined_at: client.created_at,
            last_appointment: lastAppointment?.appointment_date
          };
        });
        
        setClients(enhancedClients);
        setFilteredClients(enhancedClients);
      } catch (err) {
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [currentUser]);
  
  // Handle search and filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredClients(clients);
      return;
    }
    
    const filtered = clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredClients(filtered);
  }, [searchTerm, clients]);
  
  // Handle sorting
  useEffect(() => {
    const sorted = [...filteredClients].sort((a, b) => {
      let valueA: any = a[sortField as keyof Client];
      let valueB: any = b[sortField as keyof Client];
      
      // Handle undefined/null values
      if (valueA === undefined || valueA === null) valueA = sortDirection === 'asc' ? '' : 'zzz';
      if (valueB === undefined || valueB === null) valueB = sortDirection === 'asc' ? '' : 'zzz';
      
      // Compare based on direction
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredClients(sorted);
  }, [sortField, sortDirection]);
  
  // Function to get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Client Management</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Your Clients</CardTitle>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px] md:w-[250px]"
                />
              </div>
              
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="appointment_count">Sessions</SelectItem>
                  <SelectItem value="joined_at">Join Date</SelectItem>
                  <SelectItem value="last_appointment">Last Session</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading clients...</p>
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map(client => (
                <Card key={client.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={client.profile_picture} />
                        <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{client.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">
                            {client.appointment_count} sessions
                          </Badge>
                          {client.city && client.country && (
                            <Badge variant="outline">
                              {client.city}, {client.country}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleViewClient(client)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Clients Yet</h3>
              <p className="text-muted-foreground text-center mt-1 max-w-md">
                You don't have any clients yet. As you conduct sessions, your clients will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedClient && (
        <ClientDetailsDialog
          client={selectedClient}
          open={showClientDetails}
          onOpenChange={setShowClientDetails}
          appointments={appointments.filter(apt => apt.user_id === selectedClient.id)}
        />
      )}
    </div>
  );
};

export default ClientManagement;
