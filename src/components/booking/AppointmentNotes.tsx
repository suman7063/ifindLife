
import React from 'react';

interface AppointmentNotesProps {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

const AppointmentNotes: React.FC<AppointmentNotesProps> = ({ notes, setNotes }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">3. Additional Notes (Optional)</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border rounded-md p-2 h-24"
        placeholder="Add any notes or specific requirements for your appointment..."
      />
    </div>
  );
};

export default AppointmentNotes;
