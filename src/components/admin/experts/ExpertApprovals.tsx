
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/hooks/expert-auth/types';
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

const ExpertApprovals = () => {
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfile | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'disapproved'>('approved');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Load expert applications
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('expert_accounts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setExperts(data as ExpertProfile[]);
      } catch (error) {
        console.error('Error fetching experts:', error);
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
      // Update expert status in database
      const { error } = await supabase
        .from('expert_accounts')
        .update({ status: selectedStatus })
        .eq('id', selectedExpert.id);
        
      if (error) throw error;
      
      // Send notification email using Supabase Edge Function
      await sendStatusUpdateEmail(selectedExpert.email, selectedStatus, feedbackMessage);
      
      // Update local state
      setExperts(experts.map(expert => 
        expert.id === selectedExpert.id 
          ? { ...expert, status: selectedStatus } 
          : expert
      ));
      
      toast.success(`Expert ${selectedStatus === 'approved' ? 'approved' : 'disapproved'} successfully`);
      setOpenDialog(false);
      
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
  const openApprovalDialog = (expert: ExpertProfile) => {
    setSelectedExpert(expert);
    setSelectedStatus('approved');
    setFeedbackMessage('');
    setOpenDialog(true);
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
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
        <h2 className="text-2xl font-bold">Expert Applications</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ifind-teal"></div>
        </div>
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
