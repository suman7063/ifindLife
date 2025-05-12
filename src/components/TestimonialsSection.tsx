
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { testimonialData as defaultTestimonialData } from '@/data/homePageData';
import TestimonialCard from '@/components/TestimonialCard';
import { Quote } from 'lucide-react';

type Testimonial = {
  id?: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  imageUrl: string;
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load testimonials from Supabase on component mount
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Convert from database format to our application format
          const formattedTestimonials = data.map(item => ({
            id: item.id?.toString() || '',
            name: item.name || '',
            location: item.location || '',
            rating: item.rating || 0,
            text: item.text || '',
            date: item.date || '',
            imageUrl: item.image_url || ''
          }));
          
          setTestimonials(formattedTestimonials);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials');
        // Fallback to localStorage if Supabase fails
        try {
          const savedContent = localStorage.getItem('ifindlife-content');
          if (savedContent) {
            const parsedContent = JSON.parse(savedContent);
            if (parsedContent.testimonials) {
              setTestimonials(parsedContent.testimonials);
            }
          }
        } catch (localError) {
          console.error('Error loading content from localStorage:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Quote className="h-12 w-12 text-ifind-purple opacity-40" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from real people who have experienced the positive impact of our services
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(index => (
              <div key={index} className="animate-pulse bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...testimonials, {
              id: 'amisha',
              name: 'Amisha M.',
              location: 'Delhi, India',
              rating: 5,
              text: 'The guidance I received here transformed my relationship with my teenage son. Dr. Kumar\'s approach was practical and effective.',
              date: '2 months ago',
              imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop'
            }].slice(0, 4).map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id || index} 
                name={testimonial.name}
                location={testimonial.location}
                rating={testimonial.rating}
                text={testimonial.text}
                date={testimonial.date}
                imageUrl={testimonial.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
