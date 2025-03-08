
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-astro-deep-blue text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="relative w-8 h-8">
                <div className="absolute w-8 h-8 bg-astro-light-purple rounded-full opacity-70"></div>
                <div className="absolute w-4 h-4 bg-astro-gold rounded-full top-1 left-2"></div>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-astro-gold to-astro-light-purple bg-clip-text text-transparent">AstroTalk</span>
            </Link>
            <p className="text-astro-stardust/80 mb-6">
              Connect with the best astrologers for personalized guidance and insights into your life's journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-astro-light-purple/30 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-astro-light-purple/30 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-astro-light-purple/30 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-astro-light-purple/30 transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services/horoscope" className="text-astro-stardust/80 hover:text-astro-stardust transition-colors">
                  Daily Horoscope
                </Link>
              </li>
              <li>
                <Link to="/services/compatibility" className="text-astro-stardust/80 hover:text-astro-stardust transition-colors">
                  Compatibility Check
                </Link>
              </li>
              <li>
                <Link to="/services/kundli" className="text-astro-stardust/80 hover:text-astro-stardust transition-colors">
                  Kundli Reading
                </Link>
              </li>
              <li>
                <Link to="/services/tarot" className="text-astro-stardust/80 hover:text-astro-stardust transition-colors">
                  Tarot Reading
                </Link>
              </li>
              <li>
                <Link to="/services/palmistry" className="text-astro-stardust/80 hover:text-astro-stardust transition-colors">
                  Palmistry
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-astro-stardust/80 hover:text-astro-stardust transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-astro-stardust/80 hover:text-astro-stardust transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-astro-stardust/80 hover:text-astro-stardust transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-astro-stardust/80 hover:text-astro-stardust transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-astro-stardust/80 hover:text-astro-stardust transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Newsletter</h4>
            <p className="text-astro-stardust/80 mb-4">
              Subscribe to get daily horoscope and cosmic updates.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button size="icon" className="bg-astro-purple hover:bg-astro-violet">
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-astro-stardust/60 text-sm">
          <p>© {new Date().getFullYear()} AstroTalk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
