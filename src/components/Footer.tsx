
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Heart, Award, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewsletterSubscription from './newsletter/NewsletterSubscription';

const Footer = () => {
  const navigate = useNavigate();
  
  // Handle navigation with scroll to top
  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer className="bg-ifind-charcoal text-ifind-offwhite pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png" 
                alt="iFindLife Logo" 
                className="h-12 transform scale-125 origin-left" 
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
                <button 
                  onClick={() => handleNavigation('/services')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors font-medium"
                >
                  All Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/services/mindful-listening')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors"
                >
                  Heart2Heart Listening Sessions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/services/therapy-sessions')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors"
                >
                  Therapy Sessions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/services/guided-meditations')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors"
                >
                  Guided Meditations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/services/offline-retreats')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors"
                >
                  Offline Retreats
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/services/life-coaching')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors"
                >
                  Life Coaching
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/about')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/privacy')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/terms')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/faq')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contact')} 
                  className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Newsletter</h4>
            <p className="text-ifind-offwhite/80 mb-4">
              Subscribe to get mental wellness tips and updates.
            </p>
            <NewsletterSubscription />
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
