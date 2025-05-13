
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MessageSquare, Users } from 'lucide-react';
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
    <section className="py-16 bg-gradient-to-r from-[#7E69AB]/90 to-[#9b87f5]/90 text-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Image */}
          <div className="rounded-lg overflow-hidden shadow-xl h-full hidden md:block">
            <img 
              src="/public/lovable-uploads/1b420877-7be1-4010-b806-5850cb719642.png" 
              alt="Mindful meditation scene" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Right side - Content */}
          <div>
            <h2 className="text-3xl font-bold mb-3">Join Our Mindfulness Community</h2>
            <p className="text-lg mb-8 text-white/90 max-w-xl">
              Be part of our supportive community and receive daily mindfulness activities 
              to help you maintain balance and well-being in your life.
            </p>
            
            <div className="space-y-6">
              {/* Email Subscription */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Daily Activities Newsletter</h3>
                </div>
                
                <p className="mb-5 text-white/80">
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
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white"
                      required
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-white text-[#6E59A5] hover:bg-white/90 font-medium"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#6E59A5] border-t-transparent"></div>
                      ) : (
                        "Join"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
              
              {/* WhatsApp Community */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                    <MessageSquare className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">Join WhatsApp Community</h3>
                </div>
                
                <p className="mb-5 text-white/80">
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
                  <MessageSquare size={18} />
                  Join WhatsApp Group
                </Button>
              </div>
            </div>

            <div className="mt-6 flex justify-center md:justify-start">
              <div className="inline-flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full">
                <Users size={16} />
                <span className="font-medium">Join 2,500+ members already in our community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunitySection;
