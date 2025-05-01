
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
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
  online,
}) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate(`/experts/${id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer border bg-card h-full"
      onClick={handleViewProfile}
    >
      <ExpertImage imageUrl={imageUrl} name={name} online={online} />
      
      <CardContent className="p-4">
        <ExpertInfo
          name={name}
          experience={experience}
          specialties={specialties}
          rating={rating}
          waitTime={waitTime}
          price={price}
        />
        
        <ExpertActions id={id} online={online} />
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
