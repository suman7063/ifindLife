
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ReportUI } from '@/types/supabase/moderation';
import { Badge } from '@/components/ui/badge';

interface ReportDetailsDialogProps {
  report: ReportUI;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReportDetailsDialog: React.FC<ReportDetailsDialogProps> = ({
  report,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            Detailed information about the report
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Report ID</h3>
              <p className="text-sm">{report.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Badge className="mt-1">
                {report.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Reported by</h3>
              <p className="text-sm font-medium">{report.reporterName}</p>
              <p className="text-xs text-muted-foreground capitalize">{report.reporterType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date Reported</h3>
              <p className="text-sm">{format(new Date(report.date), 'PPP p')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Target</h3>
              <p className="text-sm font-medium">{report.targetName}</p>
              <p className="text-xs text-muted-foreground capitalize">{report.targetType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Reason</h3>
              <p className="text-sm capitalize">{report.reason.replace(/_/g, ' ')}</p>
            </div>
          </div>
          
          {report.sessionId && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Session ID</h3>
              <p className="text-sm">{report.sessionId}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Details</h3>
            <div className="mt-2 p-3 border rounded-md bg-muted/20">
              <p className="text-sm whitespace-pre-wrap">{report.details}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsDialog;
