
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpertAbout from './ExpertAbout';
import ExpertReviews from './ExpertReviews';
import BookingTab from '@/components/booking/BookingTab';

interface ExpertDetailTabsProps {
  expert: {
    id: number;
    name: string;
    experience: number;
    description: string;
    education?: string;
    specialties: string[];
    rating: number;
    reviews: Array<{
      id: number;
      name: string;
      rating: number;
      date: string;
      comment: string;
    }>;
  };
}

const ExpertDetailTabs: React.FC<ExpertDetailTabsProps> = ({ expert }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = React.useState<string>('about');

  // Effect to handle URL params for direct booking or call tab access
  useEffect(() => {
    if (searchParams.get('book') === 'true') {
      setCurrentTab('booking');
      // Don't remove the parameter immediately to allow for page refreshes
    } else if (searchParams.get('call') === 'true') {
      // In case we want to handle call tabs in the future
      console.log('Call parameter detected');
    }
  }, [searchParams]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    
    // Update URL params based on selected tab
    if (value === 'booking') {
      if (!searchParams.has('book')) {
        searchParams.set('book', 'true');
        setSearchParams(searchParams);
      }
    } else {
      // Remove booking parameter if not on booking tab
      if (searchParams.has('book')) {
        searchParams.delete('book');
        setSearchParams(searchParams);
      }
    }
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <TabsList className="w-full grid grid-cols-3 mb-8">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger id="booking-tab" value="booking">Book Session</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about">
        <ExpertAbout 
          description={expert.description}
          experience={expert.experience}
          education={expert.education}
          specialties={expert.specialties}
        />
      </TabsContent>
      
      <TabsContent value="reviews">
        <ExpertReviews reviews={expert.reviews} />
      </TabsContent>
      
      <TabsContent value="booking">
        <BookingTab expert={{ id: expert.id, name: expert.name }} />
      </TabsContent>
    </Tabs>
  );
};

export default ExpertDetailTabs;
