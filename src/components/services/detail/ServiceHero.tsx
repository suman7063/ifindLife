
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
    <div className="rounded-xl overflow-hidden relative mb-12 h-[250px]">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover object-top" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end items-center text-white p-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center text-shadow tracking-tight">{title}</h1>
        <p className="text-xl max-w-3xl text-center text-shadow-sm mb-8">{description}</p>
        <Button 
          className={`${buttonColor} text-white px-8 py-6 text-lg rounded-full transition-all transform hover:scale-105`}
          onClick={onInquireClick}
        >
          Inquire Now
        </Button>
      </div>
    </div>
  );
};

export default ServiceHero;
