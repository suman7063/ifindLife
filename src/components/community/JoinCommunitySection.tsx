
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, WhatsApp, Users } from 'lucide-react';
import { toast } from 'sonner';
import { from } from '@/lib/supabase';

const JoinCommunitySection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await from('ifl_community_subscriptions').insert([
        { email, created_at: new Date().toISOString() }
      ]);
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info('You are already part of our community!');
        } else {
          console.error('Failed to join community:', error);
          throw new Error(error.message);
        }
      } else {
        toast.success('Welcome to our community! You will receive daily mindfulness activities.');
        setEmail('');
      }
    } catch (error: any) {
      console.error('Error joining community:', error);
      toast.error(`Joining failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-ifind-aqua/10 to-ifind-teal/10">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Join Our Mindfulness Community</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Be part of our supportive community and receive daily mindfulness activities 
            to help you maintain balance and well-being in your life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Email Subscription */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-ifind-teal/20 flex items-center justify-center mr-4">
                <Mail className="h-6 w-6 text-ifind-teal" />
              </div>
              <h3 className="text-xl font-bold">Receive Daily Activities</h3>
            </div>
            
            <p className="mb-6 text-gray-600">
              Join our email list to receive daily mindfulness practices and activities 
              directly to your inbox. Start your day with intention and clarity.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="mt-auto">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-ifind-teal hover:bg-ifind-teal/80"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    "Join"
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          {/* WhatsApp Community */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <WhatsApp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Join WhatsApp Community</h3>
            </div>
            
            <p className="mb-6 text-gray-600">
              Connect with like-minded individuals in our WhatsApp group. Share experiences, 
              get instant support, and participate in group activities.
            </p>
            
            <div className="mt-auto">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                onClick={() => window.open('https://chat.whatsapp.com/GFmwLYoqPa3K712xEJqEEO', '_blank')}
              >
                <WhatsApp size={18} />
                Join WhatsApp Group
              </Button>
              <p className="text-xs text-center mt-2 text-gray-500">
                Clicking will redirect you to WhatsApp
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-ifind-teal">
            <Users size={16} />
            <span className="font-medium">Join 2,500+ members already in our community</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunitySection;
