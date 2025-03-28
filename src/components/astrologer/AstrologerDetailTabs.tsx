
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AstrologerAbout from './AstrologerAbout';
import AstrologerReviews from './AstrologerReviews';

interface AstrologerDetailTabsProps {
  astrologer: {
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

const AstrologerDetailTabs: React.FC<AstrologerDetailTabsProps> = ({ astrologer }) => {
  return (
    <Tabs defaultValue="about">
      <TabsList className="mb-6">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about">
        <AstrologerAbout astrologer={astrologer} />
      </TabsContent>
      
      <TabsContent value="reviews">
        <AstrologerReviews reviews={astrologer.reviews} rating={astrologer.rating} />
      </TabsContent>
    </Tabs>
  );
};

export default AstrologerDetailTabs;
