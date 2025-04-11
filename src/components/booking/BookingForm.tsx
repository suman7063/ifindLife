
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ExpertProfile } from '@/types/supabase/expert';
import { useUserAuth } from '@/hooks/useUserAuth';
import { formatCurrency } from '@/lib/utils';

interface BookingFormProps {
  expert: ExpertProfile;
}

const BookingForm: React.FC<BookingFormProps> = ({ expert }) => {
  const [duration, setDuration] = useState<number>(15);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { currentUser, isAuthenticated } = useUserAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a session",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would send data to the backend
      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been sent. The expert will confirm soon.",
      });
      
      // Reset form
      setNotes('');
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const calculatedPrice = (expert.price_per_min || 0) * duration;
  
  const durationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="duration">Session Duration</Label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full p-2 border rounded-md mt-1"
          required
        >
          {durationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} ({formatCurrency(expert.price_per_min * option.value || 0)})
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <Label htmlFor="notes">Notes for the Expert</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe what you'd like to discuss..."
          className="mt-1"
          rows={4}
        />
      </div>
      
      <div className="flex justify-between items-center font-medium">
        <span>Total Price:</span>
        <span className="text-lg">{formatCurrency(calculatedPrice)}</span>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-ifind-aqua hover:bg-ifind-teal"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Book Now'}
      </Button>
    </form>
  );
};

export default BookingForm;
