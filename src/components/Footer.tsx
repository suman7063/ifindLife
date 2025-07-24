
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Award, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewsletterSubscription from './newsletter/NewsletterSubscription';

const Footer = () => {
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
            <p className="text-ifind-offwhite/80 mb-6 text-justify">
              Your journey from recovery to resilience starts here. Find balance and support with our professional mental wellness therapists.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors font-medium">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/services/therapy-sessions" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Therapy Sessions
                </Link>
              </li>
              <li>
                <Link to="/services/guided-meditations" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Guided Meditations
                </Link>
              </li>
              <li>
                <Link to="/services/mindful-listening" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Heart2Heart Listening
                </Link>
              </li>
              <li>
                <Link to="/services/offline-retreats" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Offline Retreats
                </Link>
              </li>
              <li>
                <Link to="/services/life-coaching" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
                  Life Coaching
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
                <Link to="/faqs" className="text-ifind-offwhite/80 hover:text-ifind-offwhite transition-colors">
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
            <NewsletterSubscription 
              placeholder="Your email"
              className="flex space-x-2"
            />
          </div>
        </div>
        
        {/* Disclaimer Section */}
        <div className="border-t border-white/10 pt-8 pb-6">
          <div className="max-w-4xl mx-auto">
            <h5 className="text-ifind-offwhite font-medium text-sm mb-3 text-center">Disclaimer</h5>
            <div className="text-ifind-offwhite/70 text-xs leading-relaxed space-y-2 text-justify">
              <p>
                iFindLife is a global emotional wellness platform designed to offer supportive listening, expert guidance, and transformational programs for day-to-day life challenges, stress, and personal growth. While we provide access to trained experts and mental wellness professionals, iFindLife is not equipped to handle medical emergencies, psychiatric crises, or situations requiring immediate clinical intervention.
              </p>
              <p>
                If you or someone you know is experiencing thoughts of self-harm, suicide, or any mental health emergency, please contact a local helpline or visit the nearest hospital or emergency room. Being with a trusted family member or friend during this time can offer essential support.
              </p>
              <p>
                For immediate mental health support in India, you may call the national Tele MANAS helpline at <span className="text-ifind-offwhite font-medium">1-800 891 4416</span>.
              </p>
              <p>
                For those in the UAE, you can call the National Mental Support Line at <span className="text-ifind-offwhite font-medium">800-HOPE (8004673)</span>, available 24/7. For users outside the UAE, please contact your country's emergency mental health services or helpline.
              </p>
              <p className="font-medium text-ifind-offwhite/80">
                We care deeply about your journey, but your safety and urgent care come first. Please seek immediate professional or medical help if you are in crisis.
              </p>
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-white/10 pt-6 text-center text-ifind-offwhite/60 text-sm">
          <p>© {new Date().getFullYear()} iFindfLife LLP, A Soulversity Venture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
