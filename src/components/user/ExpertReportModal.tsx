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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useUserAuth } from '@/contexts/UserAuthContext';

interface ExpertReportModalProps {
  expertId: string | number;
}

const ExpertReportModal: React.FC<ExpertReportModalProps> = ({ expertId }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentUser: user, reportExpert } = useUserAuth();

  const handleSubmit = async () => {
    if (!user || !expertId || !reason || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const reportData = {
        expert_id: Number(expertId),
        reason,
        details: details || undefined
      };

      const success = await reportExpert(reportData);

      if (success) {
        toast({
          title: "Report submitted",
          description: "Thank you for reporting this expert. We will review your report shortly.",
        });
        setOpen(false);
        setReason('');
        setDetails('');
      } else {
        toast({
          title: "Failed to submit report",
          description: "There was an error submitting your report. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Failed to submit report",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Report Expert
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Report Expert</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to report this expert? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Select onValueChange={setReason} defaultValue={reason}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inappropriate behavior">Inappropriate behavior</SelectItem>
                <SelectItem value="Misleading information">Misleading information</SelectItem>
                <SelectItem value="Spam">Spam</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="details" className="text-right">
              Details
            </Label>
            <Textarea id="details" className="col-span-3" value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={submitting} onClick={handleSubmit}>
            {submitting ? "Submitting..." : "Submit"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExpertReportModal;
