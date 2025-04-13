
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { from } from '@/lib/supabase';

interface NewsletterSubscriptionProps {
  className?: string;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ className }) => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Store subscription in Supabase
      const { error } = await from('newsletter_subscriptions').insert([
        { email, created_at: new Date().toISOString() }
      ]);
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info('You are already subscribed to our newsletter!');
        } else {
          console.error('Newsletter subscription error:', error);
          throw new Error(error.message);
        }
      } else {
        toast.success('Thank you for subscribing to our newsletter!');
        setEmail('');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex space-x-2 ${className || ''}`}>
      <Input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email" 
        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        disabled={isSubmitting}
        required
      />
      <Button 
        type="submit" 
        size="icon" 
        className="bg-ifind-aqua hover:bg-ifind-aqua/80"
        disabled={isSubmitting}
      >
        <Send size={16} />
      </Button>
    </form>
  );
};

export default NewsletterSubscription;
