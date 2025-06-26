
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProgramsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Wellness Programs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover structured programs designed to help you achieve your mental wellness goals.
          </p>
        </div>
        <div className="text-center">
          <Link to="/programs">
            <Button className="bg-ifind-aqua hover:bg-ifind-teal text-white px-8 py-3">
              Explore Programs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
