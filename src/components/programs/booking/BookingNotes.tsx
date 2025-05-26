
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface BookingNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const BookingNotes: React.FC<BookingNotesProps> = ({
  notes,
  onNotesChange,
  placeholder = "Add any specific concerns, goals, or questions you'd like to discuss during your session...",
  maxLength = 500
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="booking-notes" className="text-sm font-medium flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Session Notes (Optional)
      </Label>
      <Textarea
        id="booking-notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="min-h-[100px] resize-none"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Help your expert prepare for the session</span>
        <span>{notes.length}/{maxLength}</span>
      </div>
    </div>
  );
};

export default BookingNotes;
