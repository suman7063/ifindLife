
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';

interface MobileAccordionItemProps {
  title: string;
  value: string;
  items: Array<{
    title: string;
    href: string;
  }>;
}

const MobileAccordionItem: React.FC<MobileAccordionItemProps> = ({ 
  title,
  value,
  items 
}) => {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="py-2 px-4 text-sm">{title}</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-1 pl-4 pr-2">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MobileAccordionItem;
