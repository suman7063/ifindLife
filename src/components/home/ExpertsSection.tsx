
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ExpertsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Connect with Expert Therapists</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our certified mental health professionals are here to support you on your journey to wellness.
          </p>
        </div>
        <div className="text-center">
          <Link to="/experts">
            <Button className="bg-ifind-teal hover:bg-ifind-teal/80 text-white px-8 py-3">
              Browse All Experts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExpertsSection;
