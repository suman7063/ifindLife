
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import ExpertCard from '@/components/ExpertCard';
import { therapistData as defaultTherapistData } from '@/data/homePageData';

// Update the interface to include missing properties and ensure id is string
interface TherapistData {
  id: string; // Changed to string
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations: number;
  price: number;
  waitTime?: string; // Made optional to match ExpertCardProps
  imageUrl: string;
  online: boolean;
  availability?: string;
  expertise?: string;
  reviewCount?: number;
}

const TopTherapistsSection = () => {
  const [therapists, setTherapists] = useState<TherapistData[]>([]);

  // Load content from localStorage on component mount
  useEffect(() => {
    try {
      // Convert default therapist data IDs to strings
      const defaultTherapistsWithStringIds = defaultTherapistData.map(therapist => ({
        ...therapist,
        id: String(therapist.id) // Convert id to string
      }));
      
      setTherapists(defaultTherapistsWithStringIds as TherapistData[]);
      
      // Try to load from localStorage if available
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.therapists) {
          // Ensure all IDs are strings
          const therapistsWithStringIds = parsedContent.therapists.map((therapist: any) => ({
            ...therapist,
            id: String(therapist.id) // Convert id to string
          }));
          setTherapists(therapistsWithStringIds);
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-2xl font-bold mb-6">Top Mental Wellness Experts</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Our therapists have helped thousands find clarity through video and voice consultations. Connect now for personalized expert advice.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {therapists.slice(0, 3).map((therapist) => (
            <ExpertCard 
              key={therapist.id}
              id={therapist.id}
              name={therapist.name}
              experience={therapist.experience}
              specialties={therapist.specialties}
              rating={therapist.rating}
              consultations={therapist.consultations || therapist.reviewCount || 0}
              price={therapist.price}
              waitTime={therapist.availability || "Available"}
              imageUrl={therapist.imageUrl}
              online={true}
            />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button 
            asChild
            className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white"
          >
            <Link to="/experts" className="flex items-center">
              View All Experts
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopTherapistsSection;
