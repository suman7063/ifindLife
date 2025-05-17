
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AlertCircle, Search, UserX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from 'date-fns';

interface Client {
  id: string;
  name: string;
  email: string;
  profile_picture: string | null;
}

interface Report {
  id: string;
  user_id: string;
  reason: string;
  details: string;
  date: string;
  status: string;
  user_name: string;
}

const reportReasons = [
  "Inappropriate behavior",
  "Harassment",
  "Missed appointments",
  "Payment issues",
  "Disrespectful communication",
  "False information",
  "Other"
];

const ReportPage = () => {
  const { expertProfile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (expertProfile?.id) {
      fetchClients();
      fetchReports();
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
          user_id
        `)
        .eq('expert_id', expertProfile.id)
        .is('canceled_at', null);
        
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
      
      setClients(clientProfiles || []);
      setFilteredClients(clientProfiles || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load client list');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReports = async () => {
    if (!expertProfile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select('*')
        .eq('expert_id', expertProfile.id)
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    }
  };

  const handleReportUser = async () => {
    if (!expertProfile?.id || !selectedClient) return;
    
    if (!reportReason) {
      toast.error('Please select a reason for the report');
      return;
    }
    
    if (!reportDetails || reportDetails.length < 20) {
      toast.error('Please provide detailed information about the issue (minimum 20 characters)');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_reports')
        .insert({
          user_id: selectedClient.id,
          expert_id: expertProfile.id,
          reason: reportReason,
          details: reportDetails,
          date: new Date().toISOString(),
          status: 'pending',
          user_name: selectedClient.name
        });
        
      if (error) throw error;
      
      toast.success('Report submitted successfully');
      setIsDialogOpen(false);
      setReportReason('');
      setReportDetails('');
      setSelectedClient(null);
      fetchReports();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenReportDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Report Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Report Client</CardTitle>
              <CardDescription>
                Report a client for inappropriate behavior
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
              <div className="space-y-4">
                {filteredClients.map(client => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={client.profile_picture || ''} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReportDialog(client)}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Previous Reports</CardTitle>
            <CardDescription>
              Status and history of your client reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reports submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(report => (
                  <div
                    key={report.id}
                    className="border rounded-md overflow-hidden"
                  >
                    <div className="flex justify-between items-center p-4 bg-muted border-b">
                      <div>
                        <div className="font-medium">{report.user_name}</div>
                        <div className="text-sm text-muted-foreground">
                          Reported on {formatDate(report.date)}
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          report.status === 'resolved' 
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : report.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-medium mb-1">Reason:</div>
                      <div className="mb-3 text-sm">{report.reason}</div>
                      <div className="text-sm font-medium mb-1">Details:</div>
                      <div className="text-sm">{report.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Client</DialogTitle>
            <DialogDescription>
              {selectedClient && (
                <div className="flex items-center space-x-3 mt-2">
                  <Avatar>
                    <AvatarImage src={selectedClient.profile_picture || ''} />
                    <AvatarFallback>{selectedClient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{selectedClient.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedClient.email}</div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-amber-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                Reports are reviewed by our moderators. Please provide accurate information.
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">Reason for Report</label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {reportReasons.map(reason => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="details" className="text-sm font-medium">
                Details
              </label>
              <Textarea 
                id="details"
                placeholder="Provide specific details about the issue. Include dates, messages, or other relevant information."
                rows={5}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters required. Be specific and factual.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReportUser}
              disabled={isSubmitting || !reportReason || reportDetails.length < 20}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportPage;
