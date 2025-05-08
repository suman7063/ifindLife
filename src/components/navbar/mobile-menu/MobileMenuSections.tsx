
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import { SheetClose } from '@/components/ui/sheet';
import MobileAccordionItem from './MobileAccordionItem';
import MobileMenuLink from './MobileMenuLink';

const MobileMenuSections: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto py-4">
      <nav className="flex flex-col gap-2">
        <SheetClose asChild>
          <MobileMenuLink to="/">Home</MobileMenuLink>
        </SheetClose>
        <SheetClose asChild>
          <MobileMenuLink to="/about">About</MobileMenuLink>
        </SheetClose>
        <SheetClose asChild>
          <MobileMenuLink to="/experts">Experts</MobileMenuLink>
        </SheetClose>
        
        <Accordion type="single" collapsible className="w-full">
          <MobileAccordionItem title="Programs" value="programs">
            <SheetClose asChild>
              <MobileMenuLink to="/programs-for-wellness-seekers">
                For Wellness Seekers
              </MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/programs-for-academic-institutes">
                For Academic Institutes
              </MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/programs-for-business">
                For Business
              </MobileMenuLink>
            </SheetClose>
          </MobileAccordionItem>
          
          <MobileAccordionItem title="Services" value="services">
            <SheetClose asChild>
              <MobileMenuLink to="/services">All Services</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/services/therapy">Therapy Sessions</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/services/meditation">Guided Meditations</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/services/listening">Heart2Heart Listening</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/services/retreats">Offline Retreats</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/services/coaching">Life Coaching</MobileMenuLink>
            </SheetClose>
          </MobileAccordionItem>
          
          <MobileAccordionItem title="Login" value="login">
            <SheetClose asChild>
              <MobileMenuLink to="/user-login">User Login</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/expert-login">Expert Login</MobileMenuLink>
            </SheetClose>
          </MobileAccordionItem>
          
          <MobileAccordionItem title="Support" value="support">
            <SheetClose asChild>
              <MobileMenuLink to="/contact">Contact Us</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/faqs">FAQs</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/blog">Blog</MobileMenuLink>
            </SheetClose>
          </MobileAccordionItem>
        </Accordion>
      </nav>
    </div>
  );
};

export default MobileMenuSections;
