
import React from 'react';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Accordion } from '@/components/ui/accordion';
import { ChevronDown, Brain, Heart, Sparkles } from 'lucide-react';
import MobileAccordionItem from './MobileAccordionItem';
import { useUnifiedServices } from '@/hooks/useUnifiedServices';

const MobileMenuSections = () => {
  const { services, loading } = useUnifiedServices();
  
  const serviceItems = [
    { title: 'All Services', href: '/services' },
    ...(loading ? [] : services.map(service => ({
      title: service.name,
      href: `/services/${service.slug}`
    })))
  ];
  
  return (
    <div className="flex-1 py-4">
      <div className="space-y-2">
        <Link 
          to="/" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Home
        </Link>
        
        <Accordion type="single" collapsible>
          <MobileAccordionItem
            title="Services"
            value="services"
            items={serviceItems}
          />
        </Accordion>

        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <span>Assessments</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-4 space-y-1">
            <Link 
              to="/mental-health-assessment?type=mental" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <Brain className="h-4 w-4 text-blue-600" />
              Mental Wellness
            </Link>
            <Link 
              to="/mental-health-assessment?type=emotional" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <Heart className="h-4 w-4 text-red-500" />
              Emotional Wellness
            </Link>
            <Link 
              to="/mental-health-assessment?type=spiritual" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              Spiritual Wellness
            </Link>
          </CollapsibleContent>
        </Collapsible>
        
        <Accordion type="single" collapsible>
          <MobileAccordionItem
            title="Programs"
            value="programs"
            items={[
              { title: 'All Programs', href: '/programs' },
              { title: 'For Wellness Seekers', href: '/programs-for-wellness-seekers' },
              { title: 'For Business', href: '/programs-for-business' },
              { title: 'For Academic Institutes', href: '/programs-for-academic-institutes' },
            ]}
          />
        </Accordion>
        
        <Accordion type="single" collapsible>
          <MobileAccordionItem
            title="Experts"
            value="experts"
            items={[
              { title: 'All Experts', href: '/experts' },
              { title: 'Listening Volunteers', href: '/experts/listening-volunteer' },
              { title: 'Listening Experts', href: '/experts/listening-expert' },
              { title: 'Mindfulness Experts', href: '/experts/mindfulness-expert' },
              { title: 'Life Coaches', href: '/experts/life-coach' },
              { title: 'Spiritual Mentors', href: '/experts/spiritual-mentor' },
            ]}
          />
        </Accordion>
        
        <Link 
          to="/about" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          About Us
        </Link>
        
        <Accordion type="single" collapsible>
          <MobileAccordionItem
            title="Support"
            value="support"
            items={[
              { title: 'FAQ', href: '/faqs' },
              { title: 'Contact Us', href: '/contact' },
              { title: 'Blog', href: '/blog' },
            ]}
          />
        </Accordion>
      </div>
    </div>
  );
};

export default MobileMenuSections;
