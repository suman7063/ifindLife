
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';

const StayInTouchSection = () => {
  return (
    <section className="py-16 bg-gray-800 text-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-2xl font-bold mb-8">Stay Always in Touch</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-3 mt-1 text-ifind-aqua" />
              <div>
                <h3 className="font-semibold mb-1">Toll-Free</h3>
                <p className="text-gray-300">1800-123-4567</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-3 mt-1 text-ifind-aqua" />
              <div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-gray-300">support@ifindlife.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 mt-1 text-ifind-aqua" />
              <div>
                <h3 className="font-semibold mb-1">Head Office</h3>
                <p className="text-gray-300">
                  123 Mental Wellness Street<br />
                  Mindful City, MC 12345<br />
                  India
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-ifind-aqua"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-ifind-aqua"
                  />
                </div>
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Subject" 
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-ifind-aqua"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-ifind-aqua"
                ></textarea>
              </div>
              <div>
                <Button className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white w-full py-6">
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayInTouchSection;
