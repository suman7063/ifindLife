
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First check if the table exists and create it if it doesn't
      const { data: existingSubscription, error: checkError } = await supabase
        .from('newsletter_subscriptions')
        .select('email')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // If error is not "no rows returned", it's a real error
        console.error('Newsletter subscription check error:', checkError);
        
        // Try to create the table if it doesn't exist
        if (checkError.code === '42P01') {
          const { error: createError } = await supabase.rpc('create_newsletter_table');
          if (createError) {
            console.error('Failed to create newsletter table:', createError);
            throw new Error('Failed to setup newsletter subscription');
          }
        } else {
          throw new Error(checkError.message);
        }
      }

      if (existingSubscription) {
        toast.info('You are already subscribed to our newsletter!');
        setEmail('');
        return;
      }

      // Store subscription in Supabase
      const { error } = await supabase.from('newsletter_subscriptions').insert([
        { 
          email: email.toLowerCase().trim(), 
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
      toast.error(`Failed to subscribe: ${error.message || 'Please try again later'}`);
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
