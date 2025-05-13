
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
    <section className="py-10 bg-gray-100">
      <Container>
        {/* Heading and description - now center aligned */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Join Our Mindfulness Community</h2>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
            Be part of our supportive community and receive daily mindfulness activities 
            to help you maintain balance and well-being in your life.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 items-center max-w-5xl mx-auto">
          {/* Left side - Image - adjusted to better align vertically */}
          <div className="flex justify-center items-center">
            <div className="w-11/12"> {/* Increased from 80% to ~92% width container */}
              <img 
                src="/lovable-uploads/31d5ed75-c077-4c81-9a33-da07b649ed30.png" 
                alt="Community members" 
                className="w-full h-auto object-contain rounded-lg" 
              />
            </div>
          </div>
          
          {/* Right side - Content with reduced width */}
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-4 max-w-md">
              {/* Email Subscription */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-1.5 bg-[#9b87f5]"></div>
                <div className="p-5">
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
                        className="bg-white border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-[#9b87f5]"
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
              </div>
              
              {/* WhatsApp Community - Uses brand teal color */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-1.5 bg-[#7DD8C9]"></div>
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#7DD8C9]/20 flex items-center justify-center mr-3">
                      <MessageSquare className="h-4 w-4 text-[#7DD8C9]" />
                    </div>
                    <h3 className="text-lg font-semibold">Join WhatsApp Community</h3>
                  </div>
                  
                  <p className="mb-4 text-sm text-gray-700">
                    Connect with like-minded individuals in our WhatsApp group. Share experiences, 
                    get instant support, and participate in group activities.
                  </p>
                  
                  <Button 
                    className="w-full bg-[#7DD8C9] hover:bg-[#7DD8C9]/90 flex items-center justify-center gap-2"
                    onClick={() => {
                      window.open('https://chat.whatsapp.com/GFmwLYoqPa3K712xEJqEEO', '_blank');
                      toast.success("WhatsApp link opened. Join our community chat!");
                    }}
                  >
                    <MessageSquare size={16} />
                    Join WhatsApp Group
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="inline-flex items-center gap-2 text-gray-700 bg-white/80 px-3 py-1 rounded-full text-sm border border-gray-200 shadow-sm">
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
