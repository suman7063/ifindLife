
import React from 'react';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';

interface MobileAccordionItemProps {
  title: string;
  value: string;
  children: React.ReactNode;
}

const MobileAccordionItem: React.FC<MobileAccordionItemProps> = ({ 
  title,
  value,
  children 
}) => {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="py-2 px-4 text-sm">{title}</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-1 pl-4 pr-2">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MobileAccordionItem;
