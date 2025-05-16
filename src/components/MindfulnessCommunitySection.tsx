
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Users, MessageCircle } from 'lucide-react';
import NewsletterSubscription from './newsletter/NewsletterSubscription';

const MindfulnessCommunitySection = () => {
  const handleJoinWhatsApp = () => {
    // WhatsApp community link
    window.open('https://chat.whatsapp.com/GFmwLYoqPa3K712xEJqEEO', '_blank');
  };

  return (
    <section className="py-16 bg-gray-50 w-full">
      <div className="container mx-auto px-4">
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
              src="/lovable-uploads/c0f975b0-a7b3-4d75-924c-b743978c511c.png" 
              alt="Mindfulness Community" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Right side - Newsletter and WhatsApp */}
          <div className="flex flex-col gap-6 justify-center">
            {/* Newsletter subscription */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Mail className="text-ifind-purple h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-left">Daily Activities Newsletter</h3>
                  <p className="text-gray-600 mb-4 text-left">
                    Join our email list to receive daily mindfulness practices and activities directly to
                    your inbox. Start your day with intention and clarity.
                  </p>
                  <NewsletterSubscription 
                    placeholder="Your email address" 
                    buttonLabel="Join"
                    className="flex gap-2" 
                  />
                </div>
              </div>
            </div>
            
            {/* WhatsApp community */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <MessageCircle className="text-green-500 h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-left">Join WhatsApp Community</h3>
                  <p className="text-gray-600 mb-4 text-left">
                    Connect with like-minded individuals in our WhatsApp group. Share experiences, get
                    instant support, and participate in group activities.
                  </p>
                  <Button 
                    onClick={handleJoinWhatsApp} 
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
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
