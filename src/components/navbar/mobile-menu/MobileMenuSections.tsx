
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { MobileAccordionItem, MobileMenuLink } from '.';

const MobileMenuSections: React.FC = () => {
  // Programs section links
  const programLinks = [
    { to: "/programs-for-wellness-seekers", label: "Wellness Seekers" },
    { to: "/programs-for-academic-institutes", label: "Academic Institutes" },
    { to: "/programs-for-business", label: "Business" }
  ];

  // Services section links
  const serviceLinks = [
    { to: "/services", label: "All Services", className: "py-2 px-4 text-sm hover:bg-accent rounded-md font-medium" },
    { to: "/services/therapy-sessions", label: "Therapy Sessions" },
    { to: "/services/guided-meditations", label: "Guided Meditations" },
    { to: "/services/mindful-listening", label: "Mindful Listening" },
    { to: "/services/offline-retreats", label: "Offline Retreats" },
    { to: "/services/life-coaching", label: "Life Coaching" }
  ];

  // Support section links
  const supportLinks = [
    { to: "/contact", label: "Contact Us" },
    { to: "/faqs", label: "FAQs" },
    { to: "/blog", label: "Blog" }
  ];

  return (
    <div className="flex flex-col gap-3 mt-6 flex-1 overflow-y-auto">
      <SheetClose asChild>
        <Button variant="ghost" asChild className="justify-start">
          <Link to="/">Home</Link>
        </Button>
      </SheetClose>
      
      <SheetClose asChild>
        <Button variant="ghost" asChild className="justify-start">
          <Link to="/about">About</Link>
        </Button>
      </SheetClose>
      
      <SheetClose asChild>
        <Button variant="ghost" asChild className="justify-start">
          <Link to="/experts">Experts</Link>
        </Button>
      </SheetClose>

      <Accordion type="single" collapsible className="w-full">
        {/* Programs Accordion */}
        <MobileAccordionItem 
          value="programs" 
          title="Programs" 
          links={programLinks} 
        />

        {/* Services Accordion */}
        <MobileAccordionItem 
          value="services" 
          title="Services" 
          links={serviceLinks} 
        />

        {/* Support Accordion */}
        <MobileAccordionItem 
          value="support" 
          title="Support" 
          links={supportLinks} 
        />
      </Accordion>
    </div>
  );
};

export default MobileMenuSections;
