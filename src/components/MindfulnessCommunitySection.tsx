
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Mail, Users, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const MindfulnessCommunitySection = () => {
  const [email, setEmail] = useState('');

  const handleJoinNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Here you would typically call an API to subscribe the user
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  const handleJoinWhatsApp = () => {
    // This would typically link to your WhatsApp group invite
    window.open('https://whatsapp.com/channel/your-channel-link', '_blank');
    toast.success('Opening WhatsApp community link');
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Mindfulness Community</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Be part of our supportive community and receive daily mindfulness activities to help 
            you maintain balance and well-being in your life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left side - Community image */}
          <div className="rounded-lg overflow-hidden h-[400px]">
            <img 
              src="/lovable-uploads/279827ab-6ab5-47dc-a1af-213e53684caf.png" 
              alt="Mindfulness Community" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Right side - Newsletter and WhatsApp */}
          <div className="flex flex-col gap-8">
            {/* Newsletter subscription */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <Mail className="text-ifind-purple mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-left">Daily Activities Newsletter</h3>
                  <p className="text-gray-600 mb-4 text-left">
                    Join our email list to receive daily mindfulness practices and activities directly to
                    your inbox. Start your day with intention and clarity.
                  </p>
                  <form onSubmit={handleJoinNewsletter} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ifind-purple"
                      required
                    />
                    <Button type="submit" className="bg-ifind-purple hover:bg-ifind-purple/90">Join</Button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* WhatsApp community */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <MessageCircle className="text-ifind-aqua mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-left">Join WhatsApp Community</h3>
                  <p className="text-gray-600 mb-4 text-left">
                    Connect with like-minded individuals in our WhatsApp group. Share experiences, get
                    instant support, and participate in group activities.
                  </p>
                  <Button 
                    onClick={handleJoinWhatsApp} 
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" /> Join WhatsApp Group
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center text-gray-600 mt-2">
              <Users className="mr-2 h-5 w-5" />
              <span>Join 2,500+ members already in our community</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MindfulnessCommunitySection;
