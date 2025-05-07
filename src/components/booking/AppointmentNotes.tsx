
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AppointmentNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
  maxLength?: number;
}

const AppointmentNotes: React.FC<AppointmentNotesProps> = ({
  notes,
  setNotes,
  maxLength = 500
}) => {
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setNotes(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor="notes" className="text-sm font-medium">3. Add Notes (Optional)</Label>
        <span className="text-xs text-muted-foreground">
          {notes.length}/{maxLength}
        </span>
      </div>
      
      <Textarea
        id="notes"
        placeholder="Add any specific details or questions for your appointment..."
        value={notes}
        onChange={handleNotesChange}
        rows={4}
        className="resize-none"
      />
      
      <p className="text-xs text-muted-foreground">
        Please include any relevant information that might help the expert prepare for your session.
      </p>
    </div>
  );
};

export default AppointmentNotes;
