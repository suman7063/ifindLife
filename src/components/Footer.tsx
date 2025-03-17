import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Send, Heart, Award, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-ifind-charcoal text-ifind-offwhite pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/ae4adda3-ac1f-4376-9e2b-081922120b00.png" 
                alt="iFindLife Logo" 
                className="h-16 transform scale-150 origin-left bg-white/90 p-1 rounded" 
              />
            </Link>
            <p className="text-ifind-offwhite/80 mb-6">
              Your journey from recovery to resilience starts here. Find balance and support with our professional mental wellness therapists.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ifind-aqua/30 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ifind-aqua/30 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ifind-aqua/30 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-ifind-aqua/30 transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services/therapy" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Therapy Sessions
                </Link>
              </li>
              <li>
                <Link to="/services/coaching" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Life Coaching
                </Link>
              </li>
              <li>
                <Link to="/services/meditation" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Guided Meditation
                </Link>
              </li>
              <li>
                <Link to="/services/groups" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Support Groups
                </Link>
              </li>
              <li>
                <Link to="/services/assessment" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Mental Health Assessment
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Newsletter</h4>
            <p className="text-ifind-offwhite/80 mb-4">
              Subscribe to get mental wellness tips and updates.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button size="icon" className="bg-ifind-aqua hover:bg-ifind-aqua/80">
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-ifind-offwhite/60 text-sm">
          <p>© {new Date().getFullYear()} iFindLife. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
