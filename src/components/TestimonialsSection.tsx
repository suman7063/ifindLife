
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
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground">
            Hear from people who have found guidance and clarity through our mental wellness services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
