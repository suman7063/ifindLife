
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MessageSquare, Users } from 'lucide-react';
import { toast } from 'sonner';
import { from } from '@/lib/supabase';
import { Container } from '@/components/ui/container';

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
    <section className="py-10 bg-[#F2FCE2]">
      <Container>
        {/* Heading and description - now above everything */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Join Our Mindfulness Community</h2>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
            Be part of our supportive community and receive daily mindfulness activities 
            to help you maintain balance and well-being in your life.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Left side - Image */}
          <div className="rounded-lg overflow-hidden shadow-md h-full">
            <img 
              src="/lovable-uploads/2d501512-6dd2-4b1a-bc61-6510bd9e9cf6.png" 
              alt="Community members" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Right side - Content */}
          <div className="space-y-4">
            {/* Email Subscription */}
            <div className="bg-[#D6BCFA]/30 backdrop-blur-sm p-5 rounded-xl border border-purple-100 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-[#9b87f5]/20 flex items-center justify-center mr-3">
                  <Mail className="h-4 w-4 text-[#9b87f5]" />
                </div>
                <h3 className="text-lg font-semibold">Daily Activities Newsletter</h3>
              </div>
              
              <p className="mb-4 text-sm text-gray-700">
                Join our email list to receive daily mindfulness practices and activities 
                directly to your inbox. Start your day with intention and clarity.
              </p>
              
              <form onSubmit={handleEmailSubmit}>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="bg-white/70 border-purple-100 text-gray-800 placeholder:text-gray-500 focus:border-[#9b87f5]"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#9b87f5] text-white hover:bg-[#9b87f5]/90 font-medium"
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
            <div className="bg-[#F2FCE2]/50 backdrop-blur-sm p-5 rounded-xl border border-green-100 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Join WhatsApp Community</h3>
              </div>
              
              <p className="mb-4 text-sm text-gray-700">
                Connect with like-minded individuals in our WhatsApp group. Share experiences, 
                get instant support, and participate in group activities.
              </p>
              
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
                onClick={() => {
                  window.open('https://chat.whatsapp.com/GFmwLYoqPa3K712xEJqEEO', '_blank');
                  toast.success("WhatsApp link opened. Join our community chat!");
                }}
              >
                <MessageSquare size={16} />
                Join WhatsApp Group
              </Button>
            </div>

            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 text-gray-700 bg-white/50 px-3 py-1 rounded-full text-sm">
                <Users size={14} />
                <span>Join 2,500+ members already in our community</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default JoinCommunitySection;
