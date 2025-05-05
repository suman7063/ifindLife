
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
import { useHelpNavigation } from '../../help/HelpNavigation';
import { HelpCircle } from 'lucide-react';

// Updated MobileMenuLink component prop type from 'href' to 'to' to match usage
const MobileMenuSections: React.FC = () => {
  // Use the help navigation hook
  const { handleHelpClick, HelpFormDialog } = useHelpNavigation();

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
            {/* Additional service links can be added here */}
          </MobileAccordionItem>
          
          <MobileAccordionItem title="Login" value="login">
            <SheetClose asChild>
              <MobileMenuLink to="/user-login">User Login</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/expert-login">Expert Login</MobileMenuLink>
            </SheetClose>
            {/* Removed Admin Login option from here */}
          </MobileAccordionItem>
          
          <MobileAccordionItem title="Support" value="support">
            <SheetClose asChild>
              <MobileMenuLink to="/contact">Contact Us</MobileMenuLink>
            </SheetClose>
            <SheetClose asChild>
              <MobileMenuLink to="/faqs">FAQs</MobileMenuLink>
            </SheetClose>
          </MobileAccordionItem>
        </Accordion>
        
        {/* Help Link */}
        <div 
          className="flex items-center px-4 py-2 hover:bg-accent rounded-md cursor-pointer"
          onClick={handleHelpClick}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Get Help</span>
        </div>
        
        {/* Render the help form dialog */}
        <HelpFormDialog />
      </nav>
    </div>
  );
};

export default MobileMenuSections;
