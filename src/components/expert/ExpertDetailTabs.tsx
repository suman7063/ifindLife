
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
  const defaultTab = searchParams.get('book') === 'true' ? 'booking' : 'about';

  // Effect to handle URL params for direct booking tab access
  useEffect(() => {
    if (searchParams.get('book') === 'true') {
      // Remove the parameter after setting the tab
      // to avoid reactivating the tab on navigation
      searchParams.delete('book');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="w-full grid grid-cols-3 mb-8">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="booking">Book Session</TabsTrigger>
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
