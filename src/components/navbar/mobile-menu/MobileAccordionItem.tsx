
import React from 'react';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { MobileMenuLink } from '.';

interface MobileMenuLink {
  to: string;
  label: string;
  className?: string;
}

interface MobileAccordionItemProps {
  value: string;
  title: string;
  links: MobileMenuLink[];
}

const MobileAccordionItem: React.FC<MobileAccordionItemProps> = ({ 
  value, 
  title, 
  links 
}) => {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="py-2 px-4 hover:no-underline hover:bg-accent rounded-md">
        {title}
      </AccordionTrigger>
      <AccordionContent className="pl-4">
        <div className="flex flex-col gap-1 py-1">
          {links.map((link, index) => (
            <MobileMenuLink 
              key={index} 
              to={link.to} 
              className={link.className}
            >
              {link.label}
            </MobileMenuLink>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MobileAccordionItem;
