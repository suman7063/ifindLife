
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import AstrologerCard from '@/components/AstrologerCard';
import { therapistData as defaultTherapistData } from '@/data/homePageData';

const TopTherapistsSection = () => {
  const [therapists, setTherapists] = useState(defaultTherapistData);

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
            <div key={therapist.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img 
                src={therapist.imageUrl} 
                alt={therapist.name}
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Dr. {therapist.name}</h3>
                  <div className="bg-ifind-aqua/10 text-ifind-aqua px-2 py-1 rounded text-xs">
                    {therapist.availability}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{therapist.expertise}</p>
                <div className="flex items-center text-sm mb-3">
                  <div className="flex items-center text-yellow-400 mr-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-500">({therapist.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-gray-500 text-sm">Languages:</span>
                    <span className="text-sm ml-1">English, Hindi</span>
                  </div>
                  <div>
                    <span className="font-bold">₹{therapist.price}</span>
                    <span className="text-xs text-gray-500">/min</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white" size="sm">
                    Call Now
                  </Button>
                  <Button variant="outline" className="border-ifind-aqua text-ifind-aqua hover:bg-ifind-aqua/10" size="sm">
                    Chat
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopTherapistsSection;
