
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReportUI } from '@/types/supabase/moderation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Ban, ShieldAlert } from 'lucide-react';

interface ActionDialogProps {
  report: ReportUI;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (reportId: string, actionType: string, message: string, notes?: string) => void;
}

const ActionDialog: React.FC<ActionDialogProps> = ({
  report,
  open,
  onOpenChange,
  onAction,
}) => {
  const [actionType, setActionType] = useState<string>('warning');
  const [message, setMessage] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = () => {
    onAction(report.id, actionType, message, notes);
    onOpenChange(false);
    // Reset form
    setActionType('warning');
    setMessage('');
    setNotes('');
  };

  const getActionMessages = () => {
    switch (actionType) {
      case 'warning':
        return {
          title: 'Send Warning',
          description: `Send a warning to the ${report.targetType} about their behavior.`,
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />,
          defaultMessage: `This is a warning regarding a report about ${
            report.reason.replace(/_/g, ' ')
          }. Please review our community guidelines.`
        };
      case 'suspension':
        return {
          title: 'Suspend Account',
          description: `Temporarily suspend the ${report.targetType}'s account.`,
          icon: <ShieldAlert className="h-5 w-5 text-orange-500 mr-2" />,
          defaultMessage: `Your account has been temporarily suspended due to ${
            report.reason.replace(/_/g, ' ')
          }. This suspension will last for 7 days.`
        };
      case 'ban':
        return {
          title: 'Ban Account',
          description: `Permanently ban the ${report.targetType}'s account.`,
          icon: <Ban className="h-5 w-5 text-red-500 mr-2" />,
          defaultMessage: `Your account has been permanently banned due to ${
            report.reason.replace(/_/g, ' ')
          }. This decision is final.`
        };
      default:
        return {
          title: 'Take Action',
          description: 'Select an action to take on this report.',
          icon: null,
          defaultMessage: ''
        };
    }
  };

  const actionInfo = getActionMessages();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {actionInfo.icon}
            {actionInfo.title}
          </DialogTitle>
          <DialogDescription>
            {actionInfo.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium">Action:</div>
            <div className="col-span-3">
              <Select value={actionType} onValueChange={(value) => {
                setActionType(value);
                // Set default message when action type changes
                setMessage(getActionMessages()[value as keyof typeof getActionMessages()]?.defaultMessage || '');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="suspension">Suspension</SelectItem>
                  <SelectItem value="ban">Ban</SelectItem>
                  <SelectItem value="no_action">Mark as Resolved (No Action)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium">Message:</div>
            <div className="col-span-3">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Enter the message to send to the ${report.targetType}...`}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This message will be sent to the {report.targetType}.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-sm font-medium">Admin Notes:</div>
            <div className="col-span-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes about this action (not visible to users/experts)..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                These notes are for internal use only.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className={
              actionType === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
              actionType === 'suspension' ? 'bg-orange-600 hover:bg-orange-700' :
              actionType === 'ban' ? 'bg-red-600 hover:bg-red-700' :
              undefined
            }
          >
            {actionType === 'no_action' ? 'Resolve Without Action' : 'Submit Action'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
