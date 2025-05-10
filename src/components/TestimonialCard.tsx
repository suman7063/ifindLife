
import React from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  imageUrl: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  location,
  rating,
  text,
  date,
  imageUrl
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full flex flex-col group hover:scale-105">
      <div className="mb-4 flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      <div className="flex-grow relative mb-6">
        <Quote className="absolute top-0 left-0 h-6 w-6 text-ifind-purple/30 -translate-x-2 -translate-y-2" />
        <p className="text-gray-600 italic pt-2 pl-4">"{text}"</p>
      </div>
      
      <div className="flex items-center mt-auto">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-ifind-aqua/30">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <div className="flex text-xs text-gray-500 items-center">
            <span>{location}</span>
            <span className="mx-1">•</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
