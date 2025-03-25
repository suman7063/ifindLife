
import React, { useEffect, useState } from 'react';
import TestimonialCard from '@/components/TestimonialCard';
import { testimonialData as defaultTestimonialData } from '@/data/homePageData';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(defaultTestimonialData);

  // Load content from localStorage on component mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.testimonials) {
          setTestimonials(parsedContent.testimonials);
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-2xl font-bold mb-8">Testimonials</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" 
                  alt="Amisha M." 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold">Amisha M.</h3>
                <p className="text-gray-500 text-sm">Delhi, India</p>
              </div>
            </div>
            <div className="flex text-yellow-400 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <p className="text-sm">
              "The guidance I received here transformed my relationship with my teenage son. Dr. Kumar's approach was practical and effective."
            </p>
          </div>
          
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <img 
                    src={testimonial.imageUrl} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
