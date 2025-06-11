
import React from 'react';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Brain, Heart, Sparkles } from 'lucide-react';
import MobileAccordionItem from './MobileAccordionItem';

const MobileMenuSections = () => {
  return (
    <div className="flex-1 py-4">
      <div className="space-y-2">
        <Link 
          to="/" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Home
        </Link>
        
        <MobileAccordionItem
          title="Services"
          items={[
            { title: 'Therapy Sessions', href: '/services' },
            { title: 'Programs for Business', href: '/programs-for-business' },
            { title: 'Programs for Academic Institutes', href: '/programs-for-academic-institutes' },
          ]}
        />
        
        <MobileAccordionItem
          title="Programs"
          items={[
            { title: 'All Programs', href: '/programs' },
            { title: 'For Wellness Seekers', href: '/programs-for-wellness-seekers' },
            { title: 'For Business', href: '/programs-for-business' },
            { title: 'For Academic Institutes', href: '/programs-for-academic-institutes' },
          ]}
        />

        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <span>Assessment</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-4 space-y-1">
            <Link 
              to="/mental-health-assessment" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <Brain className="h-4 w-4 text-blue-600" />
              Mental Wellness
            </Link>
            <Link 
              to="/emotional-wellness-assessment" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <Heart className="h-4 w-4 text-red-500" />
              Emotional Wellness
            </Link>
            <Link 
              to="/spiritual-wellness-assessment" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              Spiritual Wellness
            </Link>
          </CollapsibleContent>
        </Collapsible>
        
        <Link 
          to="/experts" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Experts
        </Link>
        
        <Link 
          to="/about" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          About Us
        </Link>
        
        <MobileAccordionItem
          title="Support"
          items={[
            { title: 'FAQ', href: '/faqs' },
            { title: 'Contact Us', href: '/contact' },
            { title: 'Blog', href: '/blog' },
          ]}
        />
      </div>
    </div>
  );
};

export default MobileMenuSections;
