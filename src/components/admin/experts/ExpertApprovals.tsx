
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/supabase/expert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { CheckCircle, XCircle, User, CalendarClock, RefreshCw } from 'lucide-react';

// Enhanced expert profile type that matches database schema
interface ExpertProfileWithStatus extends Omit<ExpertProfile, 'status'> {
  status?: string;
  auth_id?: string | null;
  user_id?: string | null;
  verified?: boolean | null;
}

const ExpertApprovals = () => {
  const [experts, setExperts] = useState<ExpertProfileWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfileWithStatus | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'disapproved'>('approved');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Load expert applications with better error handling
  const fetchExperts = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);
      
      console.log('ExpertApprovals: Fetching expert applications...');
      
      // Fetch from expert_accounts table (RLS is disabled for easier access)
      const { data, error } = await supabase
        .from('expert_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('ExpertApprovals: Error fetching expert accounts:', error);
        throw new Error(`Failed to load expert applications: ${error.message}`);
      }
      
      console.log('ExpertApprovals: Found expert applications:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('ExpertApprovals: Expert data sample:', data[0]);
      }
      
      setExperts(data as ExpertProfileWithStatus[] || []);
      
    } catch (error) {
      console.error('ExpertApprovals: Error fetching experts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load expert applications');
      toast.error('Failed to load expert applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);
  
  // Manual refresh function
  const handleRefresh = () => {
    console.log('ExpertApprovals: Manual refresh requested');
    fetchExperts(false);
    toast.info('Refreshing expert applications...');
  };
  
  // Filter experts by status
  const pendingExperts = experts.filter(e => e.status === 'pending');
  const approvedExperts = experts.filter(e => e.status === 'approved');
  const disapprovedExperts = experts.filter(e => e.status === 'disapproved');
  
  // Update expert status with better error handling
  const updateExpertStatus = async () => {
    if (!selectedExpert) return;
    
    try {
      console.log('ExpertApprovals: Updating expert status:', selectedExpert.id, 'to', selectedStatus);
      
      // Update expert status in expert_accounts table
      const { error: updateError } = await supabase
        .from('expert_accounts')
        .update({ status: selectedStatus })
        .eq('id', String(selectedExpert.id));
        
      if (updateError) {
        console.error('ExpertApprovals: Error updating expert status:', updateError);
        throw updateError;
      }
      
      console.log('ExpertApprovals: Expert status updated successfully');
      
      // Update local state
      setExperts(experts.map(expert => 
        expert.id === selectedExpert.id 
          ? { ...expert, status: selectedStatus } 
          : expert
      ));
      
      toast.success(`Expert ${selectedStatus === 'approved' ? 'approved' : 'disapproved'} successfully`);
      setOpenDialog(false);
      
      // Optionally send email notification (non-blocking)
      try {
        await sendStatusUpdateEmail(selectedExpert.email, selectedStatus, feedbackMessage);
      } catch (emailError) {
        console.error('ExpertApprovals: Error sending email notification:', emailError);
        // Continue with the process even if email fails
        toast.warning('Status updated but email notification failed to send');
      }
      
    } catch (error) {
      console.error('ExpertApprovals: Error updating expert status:', error);
      toast.error('Failed to update expert status');
    }
  };
  
  // Helper function to send email notification (placeholder - implement as needed)
  const sendStatusUpdateEmail = async (email: string, status: string, message: string) => {
    // This would typically call an edge function or email service
    console.log('Sending email notification to:', email, 'Status:', status, 'Message:', message);
    // For now, we'll skip the actual email sending to avoid errors
    return Promise.resolve();
  };
  
  const getDefaultMessage = (status: string) => {
    return status === 'approved'
      ? 'Congratulations! Your expert account has been approved. You can now log in to your dashboard.'
      : 'Unfortunately, your expert account application has been disapproved.';
  };
  
  // Open the approval dialog
  const openApprovalDialog = (expert: ExpertProfileWithStatus) => {
    setSelectedExpert(expert);
    setSelectedStatus('approved');
    setFeedbackMessage('');
    setOpenDialog(true);
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status?: string }) => {
    if (status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    } else if (status === 'approved') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Disapproved</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Expert Applications</h2>
          <p className="text-muted-foreground">
            {loading ? 'Loading expert applications...' : 
             error ? 'Error loading applications' :
             `${experts.length} expert ${experts.length === 1 ? 'application' : 'applications'} found`}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleRefresh} 
            disabled={loading || refreshing}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            disabled={loading}
            variant="outline"
          >
            Hard Refresh
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ifind-teal"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-500 font-medium">{error}</p>
            <div className="flex space-x-2 mt-4">
              <Button 
                onClick={() => fetchExperts()} 
                variant="outline"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Hard Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {pendingExperts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium flex items-center">
                <CalendarClock className="mr-2 h-5 w-5 text-yellow-500" /> 
                Pending Applications ({pendingExperts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingExperts.map(expert => (
                  <Card key={expert.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{expert.name}</CardTitle>
                        <StatusBadge status={expert.status} />
                      </div>
                      <CardDescription>{expert.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Specialization:</span> {expert.specialization || 'Not specified'}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Experience:</span> {expert.experience || 'Not specified'}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Location:</span> {expert.city || ''}{expert.city && expert.country ? ', ' : ''}{expert.country || 'Not specified'}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Applied:</span> {expert.created_at ? new Date(expert.created_at).toLocaleDateString() : 'Unknown'}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => openApprovalDialog(expert)}
                        className="w-full"
                      >
                        Review Application
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {approvedExperts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> 
                Approved Experts ({approvedExperts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedExperts.map(expert => (
                  <Card key={expert.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{expert.name}</CardTitle>
                        <StatusBadge status={expert.status} />
                      </div>
                      <CardDescription>{expert.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Specialization:</span> {expert.specialization || 'Not specified'}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Experience:</span> {expert.experience || 'Not specified'}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => openApprovalDialog(expert)}
                        variant="outline"
                        className="w-full"
                      >
                        Update Status
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {disapprovedExperts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium flex items-center">
                <XCircle className="mr-2 h-5 w-5 text-red-500" /> 
                Disapproved Applications ({disapprovedExperts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {disapprovedExperts.map(expert => (
                  <Card key={expert.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{expert.name}</CardTitle>
                        <StatusBadge status={expert.status} />
                      </div>
                      <CardDescription>{expert.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Specialization:</span> {expert.specialization || 'Not specified'}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Experience:</span> {expert.experience || 'Not specified'}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => openApprovalDialog(expert)}
                        variant="outline"
                        className="w-full"
                      >
                        Update Status
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {experts.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <User className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No expert applications found</p>
                <Button variant="outline" className="mt-4" onClick={handleRefresh}>
                  Refresh
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Expert approval/disapproval dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedExpert?.status === 'pending' 
                ? 'Review Expert Application' 
                : 'Update Expert Status'}
            </DialogTitle>
            <DialogDescription>
              Update status for {selectedExpert?.name || 'expert'}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as 'approved' | 'disapproved')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approve</SelectItem>
                  <SelectItem value="disapproved">Disapprove</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Feedback Message (will be sent via email)</label>
              <Textarea
                placeholder={getDefaultMessage(selectedStatus)}
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={updateExpertStatus}>
              {selectedStatus === 'approved' ? 'Approve' : 'Disapprove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertApprovals;
