
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';

export interface BookingFormProps {
  expertId: string;
  onSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ expertId, onSuccess }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here would be the API call to book the appointment
      console.log('Booking appointment with expert', { expertId, date, time, duration, notes });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Appointment booked successfully');
      if (onSuccess) onSuccess();
      
      // Reset form
      setDate('');
      setTime('');
      setDuration(30);
      setNotes('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const ratePerMinute = 5; // Example rate, would come from expert data
  const totalCost = ratePerMinute * duration;
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Book Appointment</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <select
            id="duration"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific topics or questions you'd like to discuss?"
            rows={4}
          />
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <span>Rate</span>
            <span>{formatCurrency(ratePerMinute, 'USD')}/minute</span>
          </div>
          <div className="flex justify-between items-center font-medium mt-2">
            <span>Total</span>
            <span>{formatCurrency(totalCost, 'USD')}</span>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </Button>
      </form>
    </Card>
  );
};

export default BookingForm;
