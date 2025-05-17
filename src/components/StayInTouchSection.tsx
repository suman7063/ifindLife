import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const StayInTouchSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) {
        console.error('Error subscribing:', error);
        toast.error('Failed to subscribe. Please try again.');
      } else {
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4">Stay in Touch</h2>
        <p className="text-gray-700 mb-6">Subscribe to our newsletter for the latest updates and special offers.</p>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row justify-center">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4 md:mb-0 md:mr-4"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StayInTouchSection;
