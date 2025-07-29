
import React from 'react';
import { Button } from '@/components/ui/button';

interface ServiceHeroProps {
  title: string;
  image: string;
  description: string;
  buttonColor: string;
  onInquireClick: () => void;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({
  title,
  image,
  description,
  buttonColor,
  onInquireClick
}) => {
  return (
    <section className="relative h-96 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{description}</p>
        <Button 
          className={`${buttonColor} text-white px-8 py-3 text-lg hover:opacity-90 transition-all duration-300 shadow-lg border-2 border-white/20 backdrop-blur-sm`}
          onClick={onInquireClick}
        >
          Book Now
        </Button>
      </div>
    </section>
  );
};

export default ServiceHero;
