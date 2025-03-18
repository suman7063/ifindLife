
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import ExpertCard from '@/components/ExpertCard';
import { Expert } from '@/types/expert';

const TopExpertsSection = () => {
  const [experts, setExperts] = useState<Expert[]>([]);

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.therapists) {
          setExperts(parsedContent.therapists);
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }
  }, []);

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-pattern pointer-events-none"></div>
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Top Mental Wellness Experts</h2>
            <p className="text-muted-foreground max-w-2xl">
              Connect with our highly-rated, verified experts for a personalized consultation.
            </p>
          </div>
          <Link to="/experts">
            <Button variant="outline" className="border-ifind-purple text-ifind-purple hover:bg-ifind-purple hover:text-white">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopExpertsSection;
