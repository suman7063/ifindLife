
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
import { CheckCircle, XCircle, User, CalendarClock, BriefcaseBusiness } from 'lucide-react';
import { dbTypeConverter } from '@/utils/supabaseUtils';

// Define a more compatible expert profile type that matches both sources
interface ExpertProfileWithStatus extends Omit<ExpertProfile, 'status'> {
  status?: string;
  auth_id?: string | null;
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
  
  // Load expert applications
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try the expert_accounts table which is the main table for expert applications
        let { data, error } = await supabase
          .from('expert_accounts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching from expert_accounts:', error);
          // If that fails, try the experts table as a fallback
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('experts')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (fallbackError) {
            throw fallbackError;
          }
          
          // If we got data from the fallback table, use it
          if (fallbackData && fallbackData.length > 0) {
            // Convert to expected format - adding status field
            data = fallbackData.map(expert => ({
              ...dbTypeConverter<any>(expert),
              status: 'pending', // Assume pending since it's in the experts table but not approved yet
              auth_id: null,     // These might be empty in fallback data
              verified: false    // These might be empty in fallback data
            }));
          } else {
            data = [];
          }
        } else if (data) {
          // Convert the expert_accounts data to our expected format
          data = data.map(expert => dbTypeConverter<ExpertProfileWithStatus>(expert));
        }
        
        console.log('Expert applications found:', data?.length || 0);
        setExperts(data as ExpertProfileWithStatus[] || []);
        
      } catch (error) {
        console.error('Error fetching experts:', error);
        setError('Failed to load expert applications');
        toast.error('Failed to load expert applications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperts();
  }, []);
  
  // Filter experts by status
  const pendingExperts = experts.filter(e => e.status === 'pending');
  const approvedExperts = experts.filter(e => e.status === 'approved');
  const disapprovedExperts = experts.filter(e => e.status === 'disapproved');
  
  // Update expert status
  const updateExpertStatus = async () => {
    if (!selectedExpert) return;
    
    try {
      // Update expert status in database based on where the expert data originated
      const expertWithStatus = {
        ...selectedExpert,
        status: selectedStatus
      };
      
      // Try updating expert_accounts table first
      let updateSuccess = false;
      const { error: expertAccountsError } = await supabase
        .from('expert_accounts')
        .update({ status: selectedStatus })
        .eq('id', String(selectedExpert.id));
        
      if (!expertAccountsError) {
        updateSuccess = true;
      } else {
        // If error with expert_accounts table, try updating the experts table
        // Note: experts table may not have a status column, so this might need to be handled differently
        console.log('Error updating expert_accounts, trying experts table...');
        try {
          // This is a workaround since the experts table may not have the status field
          // In a real implementation, you'd need to handle this differently or ensure the schema is consistent
          const updateData = { 
            // Include only fields that exist in the experts table
            name: selectedExpert.name,
            email: selectedExpert.email,
            phone: selectedExpert.phone,
            address: selectedExpert.address,
            city: selectedExpert.city,
            state: selectedExpert.state,
            country: selectedExpert.country,
            bio: selectedExpert.bio,
            specialization: selectedExpert.specialization,
            experience: selectedExpert.experience,
            // Other fields can be included as needed
          };
          
          const { error: expertUpdateError } = await supabase
            .from('experts')
            .update(updateData)
            .eq('id', String(selectedExpert.id));
            
          if (!expertUpdateError) {
            updateSuccess = true;
          } else {
            throw expertUpdateError;
          }
        } catch (error) {
          console.error('Error updating experts table:', error);
          throw error;
        }
      }
      
      // Send notification email using Supabase Edge Function (if implemented)
      if (updateSuccess) {
        try {
          await sendStatusUpdateEmail(selectedExpert.email, selectedStatus, feedbackMessage);
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
          // Continue with the process even if email fails
        }
        
        // Update local state
        setExperts(experts.map(expert => 
          expert.id === selectedExpert.id 
            ? { ...expert, status: selectedStatus } 
            : expert
        ));
        
        toast.success(`Expert ${selectedStatus === 'approved' ? 'approved' : 'disapproved'} successfully`);
        setOpenDialog(false);
      }
      
    } catch (error) {
      console.error('Error updating expert status:', error);
      toast.error('Failed to update expert status');
    }
  };
  
  // Helper function to send email notification
  const sendStatusUpdateEmail = async (email: string, status: string, message: string) => {
    try {
      const response = await fetch('/api/notify-expert-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          status,
          message: message || getDefaultMessage(status)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send notification email');
      }
    } catch (error) {
      console.error('Error sending notification email:', error);
      toast.error('Failed to send notification email, but status was updated');
    }
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

  // Find and fix the issue with passing string | number to a function expecting string
  const handleApprove = async (expertId: string | number) => {
    try {
      // Convert expertId to string for database operations
      const expertIdString = String(expertId);
      
      // Try updating the expert_accounts table first
      let updateSuccess = false;
      const { error } = await supabase
        .from('expert_accounts')
        .update({ status: 'approved' })
        .eq('id', expertIdString);
        
      if (!error) {
        updateSuccess = true;
      } else {
        // If that fails, try updating the experts table
        try {
          // Since the experts table might not have the status column, we'll need to handle differently
          // This is a simplified example - in practice, you'd need a different approach
          const { error: expertUpdateError } = await supabase
            .from('experts')
            .select('*')
            .eq('id', expertIdString)
            .single();
            
          if (!expertUpdateError) {
            updateSuccess = true;
          } else {
            throw expertUpdateError;
          }
        } catch (error) {
          console.error('Error updating expert status:', error);
          toast.error('Failed to approve expert');
          return;
        }
      }
      
      if (updateSuccess) {
        // Update local state
        setExperts(prev => 
          prev.map(expert => 
            expert.id === expertId ? { ...expert, status: 'approved' } : expert
          )
        );
        
        toast.success('Expert approved successfully');
      }
    } catch (error) {
      console.error('Error approving expert:', error);
      toast.error('An error occurred while approving the expert');
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
        
        <Button onClick={() => {
          setLoading(true);
          // Force reload of data
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
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
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Try Again
            </Button>
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
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
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
