import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import { useUserAuth } from '@/hooks/user-auth';
import { NewReport } from '@/types/supabase/tables';

interface ExpertReportModalProps {
  expertId: string | number;
  expertName: string;
}

const ExpertReportModal: React.FC<ExpertReportModalProps> = ({ expertId, expertName }) => {
  const [open, setOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const { currentUser } = useUserAuth();

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to submit a report.');
      return;
    }

    const userId = currentUser.id;

    if (!reportReason) {
      toast.error('Please provide a reason for the report.');
      return;
    }

    try {
      const reportData: NewReport = {
        user_id: userId,
        expert_id: expertId, // Change from expertId to expert_id
        reason: reportReason,
        details: reportDetails,
        date: new Date().toISOString()
      };

      // Here you would typically send the reviewData to your Supabase database
      // For example:
      // const { data, error } = await supabase
      //   .from('expert_reports')
      //   .insert([reportData]);

      // if (error) {
      //   console.error('Error submitting report:', error);
      //   toast.error('Failed to submit report. Please try again.');
      // } else {
        console.log('Report submitted successfully:', reportData);
        toast.success('Report submitted successfully!');
        setOpen(false);
      // }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('An error occurred while submitting the report. Please try again.');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Report Expert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Report {expertName}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to report this expert? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reportReason">Reason</Label>
            <Textarea
              id="reportReason"
              placeholder="I am concerned about..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reportDetails">Details</Label>
            <Textarea
              id="reportDetails"
              placeholder="Provide more details about your concern"
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Report</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExpertReportModal;
