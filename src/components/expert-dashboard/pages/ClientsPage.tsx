import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Calendar, 
  MessageSquare, 
  AlertCircle,
  ChevronsUpDown, 
  User 
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Client {
  id: string;
  name: string;
  email: string;
  profile_picture: string | null;
  sessionCount: number;
  lastSession: string | null;
  notes: string | null;
}

interface ClientSession {
  id: string;
  date: string;
  duration: number;
  status: string;
  notes: string | null;
  service_name?: string;
}

const ClientsPage = () => {
  const { expertProfile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientDetailOpen, setIsClientDetailOpen] = useState(false);
  const [clientSessions, setClientSessions] = useState<ClientSession[]>([]);
  const [sessionIsLoading, setSessionIsLoading] = useState(false);
  const [clientNotes, setClientNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client,
    direction: 'ascending' | 'descending'
  }>({
    key: 'name',
    direction: 'ascending'
  });

  useEffect(() => {
    if (expertProfile?.id) {
      fetchClients();
    }
  }, [expertProfile]);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clients, searchQuery]);

  const fetchClients = async () => {
    if (!expertProfile?.id) return;
    
    setIsLoading(true);
    try {
      // Get all appointments for this expert
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          user_id,
          appointment_date,
          status,
          expert_id
        `)
        .eq('expert_id', expertProfile.id);
        
      if (appointmentsError) throw appointmentsError;
      
      if (!appointments || appointments.length === 0) {
        setClients([]);
        setIsLoading(false);
        return;
      }
      
      // Get unique client IDs
      const clientIds = [...new Set(appointments.map(app => app.user_id))];
      
      // Get client profiles
      const { data: clientProfiles, error: clientsError } = await supabase
        .from('users')
        .select('id, name, email, profile_picture')
        .in('id', clientIds);
        
      if (clientsError) throw clientsError;
      
      if (!clientProfiles) {
        setClients([]);
        setIsLoading(false);
        return;
      }
      
      // Build client list with session count and last session date
      const clientsWithStats = clientProfiles.map(profile => {
        const clientAppointments = appointments.filter(app => app.user_id === profile.id);
        const lastSession = clientAppointments.length > 0
          ? clientAppointments.sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())[0].appointment_date
          : null;
          
        return {
          ...profile,
          sessionCount: clientAppointments.length,
          lastSession,
          notes: null // Will fetch these separately
        };
      });
      
      setClients(clientsWithStats);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load client list');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientSessions = async (clientId: string) => {
    if (!expertProfile?.id) return;
    
    setSessionIsLoading(true);
    try {
      // Get all appointments for this client
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          duration,
          status,
          notes,
          service_id,
          services (name)
        `)
        .eq('expert_id', expertProfile.id)
        .eq('user_id', clientId)
        .order('appointment_date', { ascending: false });
        
      if (appointmentsError) throw appointmentsError;
      
      // Get client notes if any exist
      const { data: notesData, error: notesError } = await supabase
        .from('client_notes')
        .select('notes')
        .eq('expert_id', expertProfile.id)
        .eq('client_id', clientId)
        .single();
        
      if (!notesError && notesData) {
        setClientNotes(notesData.notes);
      } else {
        setClientNotes('');
      }
      
      // Map the appointments data to match the ClientSession type
      setClientSessions((appointments || []).map(item => ({
        id: item.id,
        date: item.appointment_date,
        duration: item.duration || 0,
        status: item.status || 'unknown',
        notes: item.notes,
        // Correctly access the service name from the services object
        service_name: item.services?.name || 'Unknown Service'
      })));
    } catch (error) {
      console.error('Error fetching client sessions:', error);
      toast.error('Failed to load client sessions');
    } finally {
      setSessionIsLoading(false);
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    fetchClientSessions(client.id);
    setIsClientDetailOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!expertProfile?.id || !selectedClient?.id) return;
    
    setIsSavingNotes(true);
    try {
      // Check if notes already exist
      const { data: existingNotes, error: checkError } = await supabase
        .from('client_notes')
        .select('id')
        .eq('expert_id', expertProfile.id)
        .eq('client_id', selectedClient.id)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is code for no rows returned
        throw checkError;
      }
      
      if (existingNotes) {
        // Update existing notes
        const { error: updateError } = await supabase
          .from('client_notes')
          .update({ notes: clientNotes, updated_at: new Date().toISOString() })
          .eq('id', existingNotes.id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new notes
        const { error: insertError } = await supabase
          .from('client_notes')
          .insert({
            expert_id: expertProfile.id,
            client_id: selectedClient.id,
            notes: clientNotes
          });
          
        if (insertError) throw insertError;
      }
      
      toast.success('Client notes saved successfully');
    } catch (error) {
      console.error('Error saving client notes:', error);
      toast.error('Failed to save client notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleSort = (key: keyof Client) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedClients = [...filteredClients].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredClients(sortedClients);
  };

  const handleReportClient = async () => {
    if (!expertProfile?.id || !selectedClient?.id) return;
    
    try {
      // Navigate to reporting page or show reporting dialog
      toast.info('Redirecting to client reporting form...');
      // Implement the reporting flow as needed
    } catch (error) {
      console.error('Error reporting client:', error);
      toast.error('Failed to initiate client report');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Client Management</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Your Clients</CardTitle>
            <CardDescription>
              View and manage your client relationships
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading clients...</div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {clients.length === 0 
                ? "You don't have any clients yet."
                : "No clients match your search criteria."}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <button 
                        className="flex items-center space-x-1"
                        onClick={() => handleSort('name')}
                      >
                        <span>Client</span>
                        <ChevronsUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">
                      <button 
                        className="flex items-center space-x-1"
                        onClick={() => handleSort('sessionCount')}
                      >
                        <span>Sessions</span>
                        <ChevronsUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right">
                      <button 
                        className="flex items-center space-x-1"
                        onClick={() => handleSort('lastSession')}
                      >
                        <span>Last Session</span>
                        <ChevronsUpDown className="h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={client.profile_picture || ''} />
                            <AvatarFallback>
                              {client.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell className="text-right">{client.sessionCount}</TableCell>
                      <TableCell className="text-right">
                        {client.lastSession 
                          ? format(new Date(client.lastSession), 'MMM d, yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewClient(client)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Client Detail Dialog */}
      <Dialog open={isClientDetailOpen} onOpenChange={setIsClientDetailOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              {selectedClient && (
                <div className="flex items-center space-x-3 mt-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedClient.profile_picture || ''} />
                    <AvatarFallback>{selectedClient.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{selectedClient.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedClient.email}</div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="sessions">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sessions">
                <Calendar className="h-4 w-4 mr-2" />
                Sessions
              </TabsTrigger>
              <TabsTrigger value="notes">
                <MessageSquare className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="report">
                <AlertCircle className="h-4 w-4 mr-2" />
                Report
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions" className="space-y-4 mt-4">
              <h3 className="text-lg font-medium">Session History</h3>
              {sessionIsLoading ? (
                <div className="text-center py-4">Loading sessions...</div>
              ) : clientSessions.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No sessions found for this client.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            {format(new Date(session.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>{session.duration} min</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              session.status === 'canceled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {session.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {session.notes ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    View Notes
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="text-sm">{session.notes}</div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <span className="text-muted-foreground text-sm">No notes</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Client Notes</h3>
                <Button 
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  size="sm"
                >
                  {isSavingNotes ? 'Saving...' : 'Save Notes'}
                </Button>
              </div>
              <Textarea 
                placeholder="Add private notes about this client here..."
                className="min-h-[200px]"
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                These notes are private and only visible to you.
              </p>
            </TabsContent>
            
            <TabsContent value="report" className="space-y-4 mt-4">
              <div className="bg-muted rounded-md p-4">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                  <h3 className="text-lg font-medium">Report Client</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Use this feature if the client has violated our community guidelines or terms of service.
                  Reporting a client will be reviewed by our moderation team.
                </p>
                <Button 
                  variant="destructive"
                  onClick={handleReportClient}
                >
                  Report Inappropriate Behavior
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsPage;
