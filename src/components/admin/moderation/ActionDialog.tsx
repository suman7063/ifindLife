
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModerationActionType, ReportUI } from '@/types/supabase/moderation';

interface ActionDialogProps {
  report: ReportUI;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (reportId: string, actionType: string, message: string, notes?: string) => void;
}

const ACTIONS = [
  { value: ModerationActionType.WARNING, label: 'Issue Warning' },
  { value: ModerationActionType.SUSPENSION, label: 'Suspend Account' },
  { value: ModerationActionType.BAN, label: 'Ban Account' },
  { value: ModerationActionType.NO_ACTION, label: 'No Action Required' },
];

const ActionDialog: React.FC<ActionDialogProps> = ({
  report,
  open,
  onOpenChange,
  onAction,
}) => {
  const [actionType, setActionType] = useState<string>(ModerationActionType.WARNING);
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');
  
  const handleSubmit = () => {
    if (!actionType) {
      return;
    }
    
    onAction(report.id, actionType, message, notes);
    onOpenChange(false);
    
    // Reset form
    setActionType(ModerationActionType.WARNING);
    setMessage('');
    setNotes('');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Take Action</DialogTitle>
          <DialogDescription>
            Apply a moderation action on this report against {report.targetName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="action-type" className="text-sm font-medium">
              Action
            </label>
            <Select
              value={actionType}
              onValueChange={(value) => setActionType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                {ACTIONS.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message to user
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain the reason for this action..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Internal notes (optional)
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for other administrators..."
              rows={2}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!actionType || !message.trim()}>
            Submit Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
