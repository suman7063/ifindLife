
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Send } from 'lucide-react';

interface NewsletterSubscriptionProps {
  className?: string;
  placeholder?: string;
  buttonLabel?: React.ReactNode;
  onSuccess?: () => void;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ 
  className,
  placeholder = "Your email",
  buttonLabel,
  onSuccess 
}) => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if newsletter_subscriptions table exists, if not create a simple subscription record
      const { error } = await supabase.from('contact_submissions').insert([
        { 
          name: 'Newsletter Subscriber',
          email: email,
          subject: 'Newsletter Subscription',
          message: 'User subscribed to newsletter',
          created_at: new Date().toISOString()
        }
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
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Failed to subscribe:', error);
      toast.error(`Failed to subscribe: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${className || 'flex space-x-2'}`}>
      <Input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder} 
        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
        disabled={isSubmitting}
        required
        aria-label="Email for newsletter"
      />
      <Button 
        type="submit" 
        className="bg-ifind-teal hover:bg-ifind-teal/80 text-white"
        disabled={isSubmitting}
        aria-label="Subscribe"
      >
        {isSubmitting ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : buttonLabel || (
          <Send size={16} />
        )}
      </Button>
    </form>
  );
};

export default NewsletterSubscription;
