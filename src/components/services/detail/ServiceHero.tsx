
import React from 'react';
import { Button } from '@/components/ui/button';

interface ServiceHeroProps {
  title: string;
  description: string;
  image: string;
  buttonColor: string;
  onInquireClick: () => void;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({
  title,
  description,
  image,
  buttonColor,
  onInquireClick
}) => {
  // Function to determine image positioning based on image path
  const getImagePosition = (imagePath: string) => {
    if (imagePath.includes('58321caf-3b5b-4a9d-91a1-44514ae2000b')) {
      return 'center 20%'; // Therapy Sessions
    } else if (imagePath.includes('b063443e-03be-440d-93b9-3742e49290b7')) {
      return 'center 30%'; // Guided Meditations
    } else if (imagePath.includes('3ba262c7-796f-46aa-92f7-23924bdc6a44')) {
      return 'center 25%'; // Mindful Listening
    }
    return 'center center'; // Default position
  };

  return (
    <div className="rounded-xl overflow-hidden relative mb-12 h-[212px]">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover object-center" 
        style={{ objectPosition: getImagePosition(image) }}
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 bg-gray-50/30 backdrop-blur-sm">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center tracking-tight">{title}</h1>
        <p className="text-lg max-w-3xl text-center mb-4">{description}</p>
        <Button 
          className={`${buttonColor} text-white px-6 py-2 text-lg rounded-full transition-all transform hover:scale-105`}
          onClick={onInquireClick}
        >
          Inquire Now
        </Button>
      </div>
    </div>
  );
};

export default ServiceHero;
