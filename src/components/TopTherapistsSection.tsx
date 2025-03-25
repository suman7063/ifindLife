
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import AstrologerCard from '@/components/AstrologerCard';
import { therapistData as defaultTherapistData } from '@/data/homePageData';
import { Expert } from '@/types/expert';

// Update the interface to include missing properties
interface TherapistData {
  id: number;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations: number;
  price: number;
  waitTime?: string; // Made optional to match AstrologerCardProps
  imageUrl: string;
  online: boolean;
  availability?: string;
  expertise?: string;
  reviewCount?: number;
}

const TopTherapistsSection = () => {
  const [therapists, setTherapists] = useState<TherapistData[]>(defaultTherapistData as TherapistData[]);

  // Load content from localStorage on component mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.therapists) {
          setTherapists(parsedContent.therapists);
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-2xl font-bold mb-6">Top Mental Wellness Experts</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Our therapists have helped thousands find clarity through video and voice consultations. Connect now for personalized expert advice.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {therapists.slice(0, 3).map((therapist) => (
            <AstrologerCard 
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
