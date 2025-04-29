
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
          <MobileMenuLink href="/">Home</MobileMenuLink>
        </SheetClose>
        <SheetClose asChild>
          <MobileMenuLink href="/about">About</MobileMenuLink>
        </SheetClose>
        <SheetClose asChild>
          <MobileMenuLink href="/experts">Experts</MobileMenuLink>
        </SheetClose>
        
        <Accordion type="single" collapsible className="w-full">
          <MobileAccordionItem value="programs" title="Programs">
            <SheetClose asChild>
              <MobileMenuLink href="/programs-for-wellness-seekers">
                For Wellness Seekers
              </MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink href="/programs-for-academic-institutes">
                For Academic Institutes
              </MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink href="/programs-for-business">
                For Business
              </MobileMenuLink>
            </SheetClose>
          </MobileAccordionItem>
          
          <MobileAccordionItem value="services" title="Services">
            <SheetClose asChild>
              <MobileMenuLink href="/services">All Services</MobileMenuLink>
            </SheetClose>
            {/* Additional service links can be added here */}
          </MobileAccordionItem>
          
          <MobileAccordionItem value="login" title="Login">
            <SheetClose asChild>
              <MobileMenuLink href="/user-login">User Login</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink href="/expert-login">Expert Login</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink href="/admin-login">Admin Login</MobileMenuLink>
            </SheetClose>
          </MobileAccordionItem>
          
          <MobileAccordionItem value="support" title="Support">
            <SheetClose asChild>
              <MobileMenuLink href="/contact">Contact Us</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink href="/faqs">FAQs</MobileMenuLink>
            </SheetClose>
          </MobileAccordionItem>
        </Accordion>
      </nav>
    </div>
  );
};

export default MobileMenuSections;
