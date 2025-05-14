
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ExpertImage from './ExpertImage';
import ExpertInfo from './ExpertInfo';
import ExpertActions from './ExpertActions';
import { ExpertCardProps } from './types';

const ExpertCard: React.FC<ExpertCardProps> = ({
  id,
  name,
  experience,
  specialties,
  rating,
  price,
  imageUrl,
  waitTime,
  online = false,
  isFavorite = false,
  onFavoriteToggle,
}) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0 flex flex-col">
        <ExpertImage
          imageUrl={imageUrl}
          online={online}
          verified={true} // This could be a prop in the future
        />
        <div className="p-4">
          <ExpertInfo
            name={name}
            experience={experience}
            specialties={specialties}
            rating={rating}
            price={price}
            waitTime={waitTime}
          />
          <ExpertActions
            id={id}
            online={online}
            isFavorite={isFavorite}
            onFavoriteToggle={onFavoriteToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
