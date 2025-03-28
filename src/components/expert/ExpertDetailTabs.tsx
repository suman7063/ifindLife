
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpertAbout from './ExpertAbout';
import ExpertReviews from './ExpertReviews';

interface ExpertDetailTabsProps {
  expert: {
    name: string;
    description: string;
    specialties: string[];
    education: string;
    rating: number;
    reviews: {
      id: number;
      name: string;
      rating: number;
      date: string;
      comment: string;
    }[];
  };
}

const ExpertDetailTabs: React.FC<ExpertDetailTabsProps> = ({ expert }) => {
  return (
    <Tabs defaultValue="about">
      <TabsList className="mb-6">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about">
        <ExpertAbout expert={expert} />
      </TabsContent>
      
      <TabsContent value="reviews">
        <ExpertReviews reviews={expert.reviews} rating={expert.rating} />
      </TabsContent>
    </Tabs>
  );
};

export default ExpertDetailTabs;
