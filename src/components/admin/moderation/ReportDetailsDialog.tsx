
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReportUI } from '@/types/supabase/moderation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            Reported on {format(new Date(report.date), 'MMMM d, yyyy')} • ID: {report.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 font-medium text-sm">Status:</div>
            <div className="col-span-3">
              <Badge variant="outline" className="capitalize">
                {report.status.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 font-medium text-sm">Reported by:</div>
            <div className="col-span-3">
              <div className="font-semibold">{report.reporterName}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {report.reporterType} (ID: {report.reporterId})
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 font-medium text-sm">Reported:</div>
            <div className="col-span-3">
              <div className="font-semibold">{report.targetName}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {report.targetType} (ID: {report.targetId})
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 font-medium text-sm">Reason:</div>
            <div className="col-span-3 capitalize">
              {report.reason.replace(/_/g, ' ')}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 font-medium text-sm">Details:</div>
            <div className="col-span-3 bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
              {report.details || 'No additional details provided.'}
            </div>
          </div>
          
          {report.sessionId && (
            <>
              <Separator />
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1 font-medium text-sm">Session ID:</div>
                <div className="col-span-3">
                  {report.sessionId}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsDialog;
