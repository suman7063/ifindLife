
import React from 'react';
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
  return (
    <Tabs defaultValue="about">
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
