
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
  return (
    <div className="rounded-xl overflow-hidden relative mb-12 h-[125px]">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover object-top" 
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-shadow tracking-tight">{title}</h1>
        <p className="text-lg max-w-3xl text-center text-shadow-sm mb-4">{description}</p>
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
