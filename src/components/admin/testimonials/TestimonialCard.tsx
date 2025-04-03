
import React from 'react';
import { Button } from "@/components/ui/button";

type TestimonialType = {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  imageUrl: string;
};

interface TestimonialCardProps {
  testimonial: TestimonialType;
  index: number;
  onEdit: (testimonial: TestimonialType, index: number) => void;
  onDelete: (index: number) => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  index, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={testimonial.imageUrl}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-sm">{testimonial.name}</p>
          <div className="flex items-center gap-1 text-xs">
            <span>{testimonial.location}</span>
            <span>•</span>
            <span>{testimonial.date}</span>
          </div>
        </div>
      </div>
      <p className="text-sm italic mb-3">"{testimonial.text}"</p>
      <div className="flex text-yellow-400 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
      <div className="flex justify-between mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(testimonial, index)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(index)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TestimonialCard;
