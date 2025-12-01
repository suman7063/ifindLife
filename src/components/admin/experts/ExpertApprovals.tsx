
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { CheckCircle, XCircle, User, CalendarClock, RefreshCw, Eye, Trash2, RotateCcw } from 'lucide-react';
import ExpertDetailDialog from './ExpertDetailDialog';

// Enhanced expert profile type that matches database schema
interface ExpertProfileWithStatus extends Omit<ExpertProfile, 'status'> {
  status?: string;
  auth_id?: string | null;
  user_id?: string | null;
  verified?: boolean | null;
  deleted_at?: string | null;
  feedback_message?: string | null;
  updated_by_admin_at?: string | null;
}

const ExpertApprovals = () => {
  const [experts, setExperts] = useState<ExpertProfileWithStatus[]>([]);
  const [deletedExperts, setDeletedExperts] = useState<ExpertProfileWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfileWithStatus | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'rejected'>('approved');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('active');
  
  // Load expert applications with better error handling
  const fetchExperts = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      
      // Use RPC function that has SECURITY DEFINER for admin access
      const { data, error } = await supabase
        .rpc('admin_list_all_experts');
      
      if (error) {
        console.error('ExpertApprovals: Error fetching expert accounts:', error);
        throw new Error(`Failed to load expert applications: ${error.message}`);
      }
      
      
      // Ensure all experts have auth_id
      const expertsWithAuthId = (data || []).map((expert: ExpertProfileWithStatus & { id?: string }) => ({
        ...expert,
        auth_id: expert.auth_id || expert.id || null
      }));
      
      console.log('ExpertApprovals: Fetched experts:', expertsWithAuthId.length);
      console.log('ExpertApprovals: Sample expert:', expertsWithAuthId[0]);
      
      setExperts(expertsWithAuthId as ExpertProfileWithStatus[]);
      
      // Also fetch deleted experts
      fetchDeletedExperts();
      
    } catch (error) {
      console.error('ExpertApprovals: Error fetching experts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load expert applications');
      toast.error('Failed to load expert applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch deleted experts
  const fetchDeletedExperts = async () => {
    try {
      console.log('ExpertApprovals: Fetching deleted experts...');
      
      // Use admin_list_all_experts_including_deleted and filter (this function exists and works)
      // Type assertion needed because TypeScript doesn't know about this function yet
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rpcData, error: rpcError } = await (supabase.rpc as any)('admin_list_all_experts_including_deleted');
      
      if (rpcError) {
        console.error('ExpertApprovals: RPC error:', rpcError);
        // Try direct query as last resort (may fail due to RLS)
        const { data: directData, error: directError } = await supabase
          .from('expert_accounts')
          .select('*')
          .not('deleted_at', 'is', null);
        
        if (directError) {
          console.error('ExpertApprovals: Direct query also failed:', directError);
          return;
        }
        
        if (directData && Array.isArray(directData)) {
          console.log('ExpertApprovals: Found deleted experts via direct query:', directData.length);
          const deletedWithAuthId = (directData as unknown[]).map((expert: unknown) => {
            const e = expert as ExpertProfileWithStatus & { id?: string; deleted_at?: string };
            return {
              ...e,
              auth_id: e.auth_id || e.id || null
            };
          }) as ExpertProfileWithStatus[];
          
          setDeletedExperts(deletedWithAuthId);
        }
        return;
      }
      
      if (!rpcData || !Array.isArray(rpcData)) {
        console.warn('ExpertApprovals: RPC returned invalid data:', rpcData);
        return;
      }
      
      // Filter deleted experts from all experts
      const deleted = rpcData.filter((expert: unknown) => {
        const e = expert as { deleted_at?: string | null };
        const hasDeletedAt = e.deleted_at != null && e.deleted_at !== '';
        if (hasDeletedAt) {
          console.log('ExpertApprovals: Found deleted expert:', e);
        }
        return hasDeletedAt;
      });
      
      console.log('ExpertApprovals: Found deleted experts via RPC:', deleted.length, 'out of', rpcData.length);
      console.log('ExpertApprovals: Deleted experts data:', deleted);
      
      if (deleted.length === 0) {
        console.warn('ExpertApprovals: No deleted experts found in RPC response. Checking data structure...');
        if (rpcData.length > 0) {
          console.log('ExpertApprovals: Sample expert from RPC:', rpcData[0]);
        }
      }
      
      const deletedWithAuthId = (deleted as unknown[]).map((expert: unknown) => {
        const e = expert as ExpertProfileWithStatus & { id?: string; deleted_at?: string };
        return {
          ...e,
          auth_id: e.auth_id || e.id || null
        };
      }) as ExpertProfileWithStatus[];
      
      console.log('ExpertApprovals: Setting deleted experts state:', deletedWithAuthId.length);
      setDeletedExperts(deletedWithAuthId);
    } catch (error) {
      console.error('ExpertApprovals: Error fetching deleted experts:', error);
    }
  };

  // Restore deleted expert
  const handleRestoreExpert = async (expert: ExpertProfileWithStatus) => {
    if (!expert.auth_id) {
      toast.error('Invalid expert data: missing auth_id');
      return;
    }
    
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('admin-restore-expert', {
        body: { id: String(expert.auth_id) }
      });

      if (fnError) {
        throw fnError;
      }

      if (!fnData?.success) {
        throw new Error(fnData?.error || 'Failed to restore expert');
      }
      
      toast.success('Expert restored successfully');
      await fetchExperts(false);
      await fetchDeletedExperts();
    } catch (error) {
      console.error('Error restoring expert:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to restore expert: ${errorMessage}`);
    }
  };

  useEffect(() => {
    fetchExperts();
    fetchDeletedExperts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch deleted experts when deleted tab is opened
  useEffect(() => {
    if (activeTab === 'deleted') {
      fetchDeletedExperts();
    }
  }, [activeTab]);
  
  // Manual refresh function
  const handleRefresh = () => {
    fetchExperts(false);
    fetchDeletedExperts();
    toast.info('Refreshing expert applications...');
  };
  
  // Filter experts by status
  const pendingExperts = experts.filter(e => e.status === 'pending');
  const approvedExperts = experts.filter(e => e.status === 'approved');
  const rejectedExperts = experts.filter(e => e.status === 'rejected');
  
  // Update expert status with better error handling
  const updateExpertStatus = async () => {
    if (!selectedExpert) return;
    
    // Validate that we have auth_id
    if (!selectedExpert.auth_id) {
      console.error('ExpertApprovals: No auth_id found for expert:', selectedExpert);
      toast.error('Invalid expert data: missing auth_id');
      return;
    }
    
    try {
      console.log('ExpertApprovals: Updating expert status:', {
        auth_id: selectedExpert.auth_id,
        status: selectedStatus,
        expert: selectedExpert
      });

      // Call edge function (runs with service role) to update status and save feedback message
      const { data: fnData, error: fnError } = await supabase.functions.invoke('admin-update-expert', {
        body: { 
          id: String(selectedExpert.auth_id), 
          status: selectedStatus,
          feedback_message: feedbackMessage.trim() || null
        }
      });

      if (fnError) {
        console.error('ExpertApprovals: Edge function error:', fnError);
        console.error('ExpertApprovals: Error details:', {
          message: fnError.message,
          status: fnError.status,
          context: fnError.context
        });
        throw new Error(fnError.message || 'Failed to update expert status');
      }

      if (!fnData?.success) {
        console.error('ExpertApprovals: Edge function returned error:', fnData?.error);
        throw new Error(fnData?.error || 'Failed to update expert status');
      }


      // Refresh from DB
      await fetchExperts(false);

      toast.success(`Expert ${selectedStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
      setOpenDialog(false);

      // Send email notification (non-blocking)
      try {
        console.log('ExpertApprovals: Attempting to send email notification...');
        const emailResult = await sendStatusUpdateEmail(selectedExpert.email, selectedStatus, feedbackMessage);
        console.log('ExpertApprovals: Email notification result:', emailResult);
        if (emailResult && !emailResult.error) {
          toast.success('Status updated and email notification sent successfully');
        } else {
          toast.warning('Status updated but email notification may have failed');
        }
      } catch (emailError) {
        console.error('ExpertApprovals: Error sending email notification:', emailError);
        toast.warning('Status updated but email notification failed to send');
      }
    } catch (error) {
      console.error('ExpertApprovals: Error updating expert status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update expert status: ${errorMessage}`);
    }
  };
  
  // Helper function to send email notification
  const sendStatusUpdateEmail = async (email: string, status: string, message: string) => {
    try {
      // Use the custom message if provided, otherwise use default
      const emailMessage = message.trim() || getDefaultMessage(status);
      
      console.log('ExpertApprovals: Sending email notification:', { email, status, message: emailMessage });
      
      const { data, error } = await supabase.functions.invoke('notify-expert-status', {
        body: {
          email,
          status,
          message: emailMessage
        }
      });

      if (error) {
        console.error('ExpertApprovals: Error calling notify-expert-status:', error);
        throw error;
      }

      if (data && !data.message) {
        console.warn('ExpertApprovals: Email function returned unexpected response:', data);
      }

      console.log('ExpertApprovals: Email notification sent successfully');
      return data;
    } catch (error) {
      console.error('ExpertApprovals: Failed to send email notification:', error);
      throw error;
    }
  };
  
  const getDefaultMessage = (status: string) => {
    return status === 'approved'
      ? 'Congratulations! Your expert account has been approved. You can now log in to your dashboard.'
      : 'Unfortunately, your expert account application has been rejected.';
  };
  
  // Open the approval dialog
  const openApprovalDialog = (expert: ExpertProfileWithStatus) => {
    setSelectedExpert(expert);
    // Set status based on current expert status from database
    // Map 'pending' to 'approved' (default), 'rejected' stays 'rejected', 'approved' stays 'approved'
    let currentStatus: 'approved' | 'rejected' = 'approved';
    if (expert.status === 'rejected') {
      currentStatus = 'rejected';
    } else if (expert.status === 'approved') {
      currentStatus = 'approved';
    } else {
      // For 'pending' or any other status, default to 'approved'
      currentStatus = 'approved';
    }
    setSelectedStatus(currentStatus);
    // Load previous feedback message if it exists, otherwise use default
    setFeedbackMessage(expert.feedback_message || '');
    setOpenDialog(true);
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status?: string }) => {
    if (status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    } else if (status === 'approved') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="active">Active Experts</TabsTrigger>
            <TabsTrigger value="deleted">
              Deleted Experts
              {deletedExperts.length > 0 && (
                <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-700">
                  {deletedExperts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-8 mt-4">
          {pendingExperts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium flex items-center">
                <CalendarClock className="mr-2 h-5 w-5 text-yellow-500" /> 
                Pending Applications ({pendingExperts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingExperts.map((expert, index) => (
                  <Card key={expert.auth_id || `pending-${expert.email}-${index}`}>
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
                    <CardFooter className="flex gap-2">
                      <Button 
                        onClick={() => {
                          const expertId = expert.auth_id || expert.id || expert.user_id;
                          if (expertId) {
                            setSelectedExpertId(String(expertId));
                            setDetailDialogOpen(true);
                          } else {
                            toast.error('Unable to load expert details: missing expert ID');
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button 
                        onClick={() => openApprovalDialog(expert)}
                        size="sm"
                        className="flex-1"
                      >
                        Review
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
                {approvedExperts.map((expert, index) => (
                  <Card key={expert.auth_id || `approved-${expert.email}-${index}`}>
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
          
          {rejectedExperts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium flex items-center">
                <XCircle className="mr-2 h-5 w-5 text-red-500" /> 
                Rejected Applications ({rejectedExperts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rejectedExperts.map((expert, index) => (
                  <Card key={expert.auth_id || `rejected-${expert.email}-${index}`}>
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

          </TabsContent>

          <TabsContent value="deleted" className="space-y-8 mt-4">
            {deletedExperts.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium flex items-center">
                    <Trash2 className="mr-2 h-5 w-5 text-gray-500" /> 
                    Deleted Experts ({deletedExperts.length})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchDeletedExperts()}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deletedExperts.map((expert, index) => (
                    <Card key={expert.auth_id || `deleted-${expert.email}-${index}`} className="opacity-75 border-gray-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{expert.name}</CardTitle>
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                            Deleted
                          </Badge>
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
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Deleted:</span> {expert.deleted_at ? new Date(expert.deleted_at).toLocaleDateString() : 'Unknown'}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button 
                          onClick={() => {
                            setSelectedExpertId(expert.auth_id || null);
                            setDetailDialogOpen(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          onClick={() => handleRestoreExpert(expert)}
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Trash2 className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">No deleted experts found</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('ExpertApprovals: Manual refresh clicked. Current deletedExperts state:', deletedExperts);
                      fetchDeletedExperts();
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Deleted Experts
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">Check browser console for debug logs</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
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
              {selectedExpert?.status === 'pending' 
                ? `Review and approve or reject the application for ${selectedExpert?.name || 'expert'}. Click "Details" button to view full expert information.`
                : `Update status for ${selectedExpert?.name || 'expert'}.`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as 'approved' | 'rejected')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="z-[9999]" position="popper" sideOffset={4}>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
              {selectedStatus === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expert Detail Dialog */}
      <ExpertDetailDialog
        expertId={selectedExpertId}
        isOpen={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedExpertId(null);
        }}
        onUpdate={() => {
          fetchExperts(false);
          setDetailDialogOpen(false);
          setSelectedExpertId(null);
        }}
      />
    </div>
  );
};

export default ExpertApprovals;
